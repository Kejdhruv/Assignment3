const { MongoClient } = require("mongodb");

const database = 'Assignment3';
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
async function Orders(newData) {
    try {
        await client.connect();
   
        const db = client.db(database);
        const collection = db.collection('Orders');

        const result = await collection.insertMany(newData);
        return result;
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        throw err;
    } finally {
        await client.close();
    }
}

module.exports = Orders ; 