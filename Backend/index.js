const express = require("express");
const cors = require("cors");
const Fetch = require("./Products/Fetch");

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
