const { MongoClient, ObjectId } = require("mongodb");

const url = "mongodb://localhost:27017";
const database = "Assignment3";
const client = new MongoClient(url);

async function DeleteFromCart(Email, ProductID) {
  try {
    await client.connect();
    const db = client.db(database);
    const collection = db.collection("Cart");

    // Delete one item that matches both the email and product ID
    const result = await collection.deleteOne({
      Email: Email,
      _id: new ObjectId(ProductID)
    });

    if (result.deletedCount === 1) {
      console.log(` Successfully deleted Product ${ProductID} from ${Email}'s cart`);
      return { success: true, message: "Item removed from cart" };
    } else {
      console.log(`⚠️ No matching item found for ${Email} and ${ProductID}`);
      return { success: false, message: "Item not found in cart" };
    }
  } catch (err) {
    console.error("Error deleting from cart:", err);
    throw err;
  } finally {
    await client.close();
  }
}

module.exports = DeleteFromCart;