const { MongoClient } = require("mongodb");

const database = 'Assignment3';
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

async function Fetch() {
    try {
        
        await client.connect();
       
        const db = client.db(database);
        const collection = db.collection('Products');

        const data = await collection.find({}).toArray();

        return data;
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        throw err; 
    }
}

module.exports = Fetch; 