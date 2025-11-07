const { MongoClient, ObjectId } = require("mongodb");

const url = "mongodb://localhost:27017";
const database = "Assignment3";
const client = new MongoClient(url);


async function UpdateCartQuantity(cartItemID, newQuantity) {
  try {
    await client.connect();
    const db = client.db(database);
    const collection = db.collection("Cart");

    if (newQuantity > 0) {
      // Update quantity
      const result = await collection.updateOne(
        { _id: new ObjectId(cartItemID) },
        { $set: { Quantity: newQuantity } }
      );
      if (result.matchedCount === 1) {
        return { success: true, message: "Quantity updated successfully" };
      } else {
        return { success: false, message: "Cart item not found" };
      }
    } else {
      // Delete item if quantity is zero
      const result = await collection.deleteOne({ _id: new ObjectId(cartItemID) });
      if (result.deletedCount === 1) {
        return { success: true, message: "Item removed from cart" };
      } else {
        return { success: false, message: "Cart item not found" };
      }
    }
  } catch (err) {
    console.error("Error updating/deleting cart item:", err);
    throw err;
  } finally {
    await client.close();
  }
}

module.exports = UpdateCartQuantity;