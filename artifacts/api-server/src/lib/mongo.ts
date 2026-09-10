import { MongoClient, type Db } from "mongodb";

let client: MongoClient | undefined;
let database: Db | undefined;

export async function getMongoDatabase(): Promise<Db> {
    if (database) return database;
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI must be configured.");
    client ??= new MongoClient(uri);
    await client.connect();
    database = client.db(process.env.MONGODB_DATABASE || "sardaar_ji_dhaba");
    return database;
}
