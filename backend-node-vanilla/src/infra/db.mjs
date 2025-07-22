import mongodb from "mongodb";

let client;

export async function createDatabaseConnection(dbURI, timeoutMS = 5000) {
  if (client) {
    console.log('INFO: Reusing existing database connection');
    return client.db(client.options.dbName);
  }

  client = new mongodb.MongoClient(dbURI, {
    timeoutMS: timeoutMS,
    connectTimeoutMS: timeoutMS,
    socketTimeoutMS: timeoutMS,
  });
  await client.connect();
  return client.db(client.options.dbName);
}

export async function closeDatabaseConnection() {
  if (!client) {
    console.warn('WARN: Client does not exist to close');
  }
  await client.close();
}