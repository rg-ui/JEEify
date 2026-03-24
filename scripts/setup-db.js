const { Client, Databases, Permission, Role } = require('node-appwrite');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function setupDatabase() {
  console.log('\n🚀 STARTING JEEIFY DATABASE SETUP (v2.2 - VERBOSE MODE)');
  
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const key = process.env.APPWRITE_API_KEY;

  if (!endpoint || !project || !key) {
    console.error('❌ Missing environment variables in .env.local');
    return;
  }

  const client = new Client().setEndpoint(endpoint).setProject(project).setKey(key);
  const databases = new Databases(client);
  const dbId = 'jeeify_db';

  const collections = [
    {
      id: 'tests',
      name: 'Tests',
      permissions: [Permission.read(Role.any()), Permission.create(Role.users()), Permission.update(Role.users()), Permission.delete(Role.users())],
      attributes: [
        { name: 'title', type: 'string', size: 255, required: true },
        { name: 'subtitle', type: 'string', size: 255, required: true },
        { name: 'provider', type: 'string', size: 255, required: false },
        { name: 'price', type: 'string', size: 50, required: false },
        { name: 'status', type: 'string', size: 50, required: true },
        { name: 'type', type: 'string', size: 50, required: true },
        { name: 'questionsData', type: 'string', size: 1000000, required: true },
      ]
    },
    {
      id: 'videos',
      name: 'Videos',
      permissions: [Permission.read(Role.any()), Permission.create(Role.users()), Permission.update(Role.users()), Permission.delete(Role.users())],
      attributes: [
        { name: 'title', type: 'string', size: 255, required: true },
        { name: 'url', type: 'string', size: 2048, required: true },
        { name: 'subject', type: 'string', size: 100, required: true },
      ]
    },
    {
      id: 'submissions',
      name: 'Submissions',
      permissions: [Permission.create(Role.users()), Permission.read(Role.users()), Permission.update(Role.users())],
      attributes: [
        { name: 'userId', type: 'string', size: 50, required: true },
        { name: 'testId', type: 'string', size: 50, required: true },
        { name: 'testName', type: 'string', size: 255, required: false },
        { name: 'score', type: 'integer', required: false },
        { name: 'totalMarks', type: 'integer', required: false },
        { name: 'percentile', type: 'string', size: 50, required: false },
        { name: 'completedAt', type: 'string', size: 50, required: false },
        { name: 'subjectAnalysis', type: 'string', size: 5000, required: false },
      ]
    }
  ];

  for (const col of collections) {
    console.log(`\n📦 Checking Collection: ${col.id}`);
    try {
      await databases.updateCollection(dbId, col.id, col.name, col.permissions);
      console.log(`   ✅ Permissions Verified.`);
    } catch (e) {
      if (e.code === 404) {
        await databases.createCollection(dbId, col.id, col.name, col.permissions);
        console.log(`   ✅ Created Collection.`);
      } else {
        console.log(`   ℹ️ Exists: ${e.message}`);
      }
    }

    for (const attr of col.attributes) {
      console.log(`      🔎 Checking Attribute: "${attr.name}"...`);
      try {
        if (attr.type === 'string') {
          await databases.createStringAttribute(dbId, col.id, attr.name, attr.size, attr.required);
        } else if (attr.type === 'integer') {
          await databases.createIntegerAttribute(dbId, col.id, attr.name, attr.required);
        }
        console.log(`      + SUCCESS: Added "${attr.name}"`);
        await new Promise(r => setTimeout(r, 800));
      } catch (e) {
        if (e.code === 409) console.log(`      ✓ SKIPPING: "${attr.name}" already exists.`);
        else console.error(`      ❌ ERROR adding "${attr.name}":`, e.message);
      }
    }
  }
  console.log('\n✨ DATABASE SYNC COMPLETE! You can now upload tests.\n');
}

setupDatabase();
