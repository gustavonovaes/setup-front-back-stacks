import { MongoClient, Db } from "mongodb";

let client: MongoClient;

export async function createDatabaseConnection(dbURI: string, timeoutMS = 5000): Promise<Db> {
  if (client) {
    console.log('INFO: Reusing existing database connection')
    return client.db(client.options.dbName);
  }

  client = new MongoClient(dbURI, {
    timeoutMS: timeoutMS,
    connectTimeoutMS: timeoutMS,
    socketTimeoutMS: timeoutMS,
  });
  await client.connect();
  return client.db(client.options.dbName);
}

export async function closeDatabaseConnection() {
  if (!client) {
    console.warn('WARN: Client does not exist to close')
  }
  await client.close();
}