const { MongoClient, ObjectId } = require("mongodb");

const url = "mongodb://localhost:27017";
const database = "Assignment3";
const client = new MongoClient(url);

async function DeleteCartItem(cartItemID) {
  try {
    await client.connect();
    const db = client.db(database);
    const collection = db.collection("Cart");

    const result = await collection.deleteOne({
      _id: new ObjectId(cartItemID),
    });

    if (result.deletedCount === 1) {
      return { success: true, message: "Item removed from cart" };
    } else {
      return { success: false, message: "Item not found in cart" };
    }
  } catch (err) {
    console.error("Error deleting cart item:", err);
    throw err;
  } finally {
    await client.close();
  }
}

module.exports = DeleteCartItem;