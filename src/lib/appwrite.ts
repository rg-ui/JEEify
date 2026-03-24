import { Client, Account, Databases, ID, Query } from 'appwrite';

let client: Client;
let account: Account;
let databases: Databases;

if (typeof window !== 'undefined') {
  client = new Client();
  client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

  account = new Account(client);
  databases = new Databases(client);
}

export { client as default, account, databases, ID, Query };
