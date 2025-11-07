const { MongoClient } = require("mongodb");

const database = "Assignment3";
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

async function FetchCart(Email) {
  try {
    await client.connect();
    const db = client.db(database);
    const collection = db.collection("Cart");

    const data = await collection.find({ Email: Email }).toArray();

    return data;
  } catch (err) {
    console.error("Error fetching cart data:", err);
    throw err;
  } finally {
    await client.close();
  }
}

module.exports = FetchCart;