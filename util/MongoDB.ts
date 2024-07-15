import { MongoClient, Db } from "mongodb";
import * as dotenv from "dotenv";
dotenv.config();

let _db: Db | null = null;

async function connectToDatabase(): Promise<Db> {
  if (!_db) {
    const connetctionURL: string = process.env.DB_URL as string;
    const dbName: string = process.env.DB_NAME as string;
    console.log(`Connecting to database: ${dbName}`);

    const client = await MongoClient.connect(connetctionURL);
    _db = client.db(dbName);
  }

  return _db;
}

async function ping() {
  const db = await connectToDatabase();
  await db.command({ ping: 1 });
  console.log("Pinged the database...");
}

export { connectToDatabase, ping };
