const express = require("express");
const cors = require("cors");
const Fetch = require("./Products/Fetch");
const FetchProduct = require("./Products/FetchProduct");
const Cart = require("./User/Cart/Cart");
const FetchCart = require("./User/Cart/FetchCart");
const DeleteCartItem = require("./User/Cart/DeleteCart");
const UpdateCartQuantity = require("./User/Cart/UpdateCart");
const Orders = require("./User/Order/PostingOrder");
const FetchOrder = require("./User/Order/FetchingOrder");

const PORT = 8000;
const app = express();

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});  

// Fetching Products 

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


//Modyfing Cart 

app.post('/Cart', async (req, res) => {
        try {
            const newData = req.body;
            if (!Array.isArray(newData)) {
                return res.status(400).send('Invalid input: data must be an array');
            }
            const result = await Cart(newData);
            res.status(200).json({
                message: 'Items Added',
                insertedCount: result.insertedCount, 
                insertedIds: result.insertedIds 
            });
        } catch (err) {
            console.error('Error adding product to Cart:', err);
            res.status(500).send('Internal Server Error');
        }
});    

app.get("/Cart/:Email", async (req, res) => {
  try {
    const {Email} = req.params; 
    const data = await FetchCart(Email);
    if (!data ) {
      return res.status(404).send("User Cart not found");
    }
    res.send(data);
  } catch (err) {
    console.error("Error fetching Product for User through Email ", err);
    res.status(500).send("Internal Server Error");
  }
}); 

app.delete("/Cart/:cartItemID", async (req, res) => {
  const { cartItemID } = req.params;
  try {
    const result = await DeleteCartItem(cartItemID);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});
 
app.put("/Cart/:cartItemID", async (req, res) => {
  const { cartItemID } = req.params;
  const { Quantity } = req.body;

  if (Quantity === undefined || Quantity < 0) {
    return res.status(400).send({ success: false, message: "Invalid quantity" });
  }

  try {
    const result = await UpdateCartQuantity(cartItemID, Quantity);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
}); 


//Orders of User 

app.post('/Order', async (req, res) => {
        try {
            const newData = req.body;
            if (!Array.isArray(newData)) {
                return res.status(400).send('Invalid input: data must be an array');
            }
            const result = await Orders(newData);
            res.status(200).json({
                message: 'Items Added',
                insertedCount: result.insertedCount, 
                insertedIds: result.insertedIds 
            });
        } catch (err) {
            console.error('Error Posting Order', err);
            res.status(500).send('Internal Server Error');
        }
});  
    
app.get("/Order/:Email", async (req, res) => {
  try {
    const {Email} = req.params; 
    const data = await FetchOrder(Email);
    if (!data ) {
      return res.status(404).send("User Order not found");
    }
    res.send(data);
  } catch (err) {
    console.error("Error fetching Product for User through Email ", err);
    res.status(500).send("Internal Server Error");
  }
}); 
