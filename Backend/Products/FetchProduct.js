const { MongoClient, ObjectId } = require("mongodb");

const database = "Assignment3";
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

async function FetchProduct(UID) {
  try {
    await client.connect();

    const db = client.db(database);
    const collection = db.collection("Products");

    // ✅ Convert string UID to ObjectId before querying
    const data = await collection.find({ _id: new ObjectId(UID) }).toArray();

    return data;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  } finally {
    // ✅ Always close the connection after operation
    await client.close();
  }
}

module.exports = FetchProduct;