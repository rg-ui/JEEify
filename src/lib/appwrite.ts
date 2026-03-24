import { Client, Account, Databases, ID, Query } from 'appwrite';

let client: Client;
let account: Account;
let databases: Databases;

if (typeof window !== 'undefined') {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

  if (!endpoint || !projectId) {
    console.error('Appwrite environment variables are missing! Check your Vercel settings.');
    // Initialize with dummy values to prevent crash but keep functionality limited
    client = new Client();
  } else {
    client = new Client();
    client
      .setEndpoint(endpoint)
      .setProject(projectId);
  }

  account = new Account(client);
  databases = new Databases(client);
}

export { client as default, account, databases, ID, Query };
