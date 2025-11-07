const express = require("express");
const cors = require("cors");

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

