const express = require("express");
const cors = require("cors");
const Fetch = require("./Products/Fetch");
const FetchProduct = require("./Products/FetchProduct");

const PORT = 8000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("HI");
});

app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});  

app.get('/Products', async (req, res) => {
    try {
        const data = await Fetch() ; 
              res.send(data);
    } catch (err) {
        console.error('Error fetching Products data:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get("/Products/:UID", async (req, res) => {
  try {
    const { UID } = req.params; 
    const data = await FetchProduct(UID);
    if (!data || data.length === 0) {
      return res.status(404).send("Product not found");
    }
    res.send(data[0]);
  } catch (err) {
    console.error("Error fetching Product by ID:", err);
    res.status(500).send("Internal Server Error");
  }
});

