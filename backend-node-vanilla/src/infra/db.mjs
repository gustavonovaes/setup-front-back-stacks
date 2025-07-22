import mongodb from "mongodb";

let conn;

export async function createDatabaseConnection(dbURI, timeoutMS = 5000) {
  if (conn) {
    console.log('INFO: Reusing existing database connection')
    return conn;
  }

  const client = new mongodb.MongoClient(dbURI, {
    timeoutMS: timeoutMS,
    connectTimeoutMS: timeoutMS,
    socketTimeoutMS: timeoutMS,
  });
  await client.connect();
  conn = client.db(client.options.dbName);
  return conn;
}

export async function closeDatabaseConnection() {
  await conn?.close();
}