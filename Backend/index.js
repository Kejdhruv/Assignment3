const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Internal imports
const Fetch = require("./Products/Fetch");
const FetchProduct = require("./Products/FetchProduct");
const Cart = require("./User/Cart/Cart");
const FetchCart = require("./User/Cart/FetchCart");
const DeleteCartItem = require("./User/Cart/DeleteCart");
const UpdateCartQuantity = require("./User/Cart/UpdateCart");
const Orders = require("./User/Order/PostingOrder");
const FetchOrder = require("./User/Order/FetchingOrder");
const GetUser = require("./User/Authentication/GetUser");
const CreateUser = require("./User/Authentication/CreateUser");

const PORT = 8000;
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ---------------- Products ----------------
app.get("/Products", async (req, res) => {
  try {
    const data = await Fetch();
    res.send(data);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/Products/:UID", async (req, res) => {
  try {
    const { UID } = req.params;
    const data = await FetchProduct(UID);
    if (!data || data.length === 0) return res.status(404).send("Product not found");
    res.send(data[0]);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).send("Internal Server Error");
  }
});

// ---------------- Cart ----------------
app.post("/Cart", async (req, res) => {
  try {
    const newData = req.body;
    if (!Array.isArray(newData)) return res.status(400).send("Invalid input: data must be an array");
    const result = await Cart(newData);
    res.status(200).json({ message: "Items Added", insertedCount: result.insertedCount, insertedIds: result.insertedIds });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/Cart/:Email", async (req, res) => {
  try {
    const { Email } = req.params;
    const data = await FetchCart(Email);
    if (!data) return res.status(404).send("User cart not found");
    res.send(data);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/Cart/:cartItemID", async (req, res) => {
  try {
    const result = await DeleteCartItem(req.params.cartItemID);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});

app.put("/Cart/:cartItemID", async (req, res) => {
  const { Quantity } = req.body;
  if (Quantity === undefined || Quantity < 0)
    return res.status(400).send({ success: false, message: "Invalid quantity" });

  try {
    const result = await UpdateCartQuantity(req.params.cartItemID, Quantity);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});

// ---------------- Orders ----------------
app.post("/Order", async (req, res) => {
  try {
    const newData = req.body;
    if (!Array.isArray(newData)) return res.status(400).send("Invalid input: data must be an array");
    const result = await Orders(newData);
    res.status(200).json({ message: "Items Added", insertedCount: result.insertedCount, insertedIds: result.insertedIds });
  } catch (err) {
    console.error("Error posting order:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/Order/:Email", async (req, res) => {
  try {
    const data = await FetchOrder(req.params.Email);
    if (!data) return res.status(404).send("User order not found");
    res.send(data);
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).send("Internal Server Error");
  }
});

// ---------------- Authentication ----------------
app.post("/Auth/Signup", async (req, res) => {
  try {
    const { username, email, password  } = req.body;
    if (!username || !email || !password )
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await GetUser(email);
    if (existingUser) return res.status(409).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = { username, email, password: hashedPass,  createdAt: new Date() };
    const result = await CreateUser(newUser);

    res.status(201).json({ message: "User added successfully", insertedId: result.insertedId });
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/Auth/Login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "All fields are required" });

    const existingUser = await GetUser(email);
    if (!existingUser) return res.status(404).json({ message: "User doesn't exist" });

    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign(
      {
        userId: existingUser._id.toString(),
        name: existingUser.username,
        email: existingUser.email,
      },
      process.env.TOKEN_SECRET || "secret123",
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({
      message: "Login Successful",
      success: true,
      user: {
        userId: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
      },
    });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/Auth/Logout", (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });
    res.status(200).json({ message: "Logout Successful", success: true });
  } catch (err) {
    console.error("Error logging out:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}); 


