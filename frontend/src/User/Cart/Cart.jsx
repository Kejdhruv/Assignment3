import React, { useEffect, useState } from "react";
import "./Cart.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Cart() {
  const [cart, setCart] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const userEmail = "demo1_user@example.com"; // dummy email for now

  // Fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`http://localhost:8000/Cart/${userEmail}`);
        if (!res.ok) throw new Error("Failed to fetch cart");
        const result = await res.json();
        setCart(result);
      } catch (err) {
        toast.error("Error loading cart" , err);
      }
    };
    fetchCart();
  }, []);

  // Remove item
  const removeItem = async (index) => {
    const item = cart[index];
    try {
      await fetch(`http://localhost:8000/Cart/${item._id}`, {
        method: "DELETE",
      });
      setCart(cart.filter((_, i) => i !== index));
      toast.success("Item removed!");
    } catch (err) {
      toast.error("Failed to remove item" , err );
    }
  };

  // Update quantity
 const handleQuantity = async (index, value) => {
  if (value < 1) return;

  const updatedCart = [...cart];
  const item = updatedCart[index];
  updatedCart[index].quantity = value;
  setCart(updatedCart); // update UI instantly

  try {
    const res = await fetch(`http://localhost:8000/Cart/${item._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: value }),
    });

    if (!res.ok) throw new Error("Failed to update quantity");
    toast.success(`${item.name} quantity updated`);
  } catch (err) {
    console.error("Error updating quantity:", err);
    toast.error("Failed to update quantity in backend");
  }
};

  // Calculate total
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  // Checkout handler
 const handleCheckout = async () => {
  if (!address || !phone) {
    toast.error("Please fill in address and phone");
    return;
  }

  if (cart.length === 0) {
    toast.error("Your cart is empty");
    return;
  }

  setLoading(true);

  const orderData = {
    userEmail: "demo1_user@example.com", // replace with actual user email later
    address,
    phone,
    products: cart.map((item) => ({
      productId: item._id,
      name: item.name,
      brand: item.brand,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      image: item.image,
    })),
    totalAmount: cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ),
    orderDate: new Date().toISOString(),
  };

  try {
    const res = await fetch("http://localhost:8000/Order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([orderData]),
    });

    if (!res.ok) throw new Error("Failed to save order");

    toast.success("Order placed successfully!");

    // clear frontend states
    setCart([]);
    setAddress("");
    setPhone("");
    setShowModal(false);
  } catch (err) {
    console.error("Error placing order:", err);
    toast.error("Error placing order");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="CartContainer">
      <ToastContainer position="top-center" />
      <h1 className="CartTitle">Your Cart 🛒</h1>

      {cart.length === 0 ? (
        <p className="EmptyCart">Your cart is empty.</p>
      ) : (
        <div className="CartItems">
          {cart.map((item, index) => (
            <div className="CartItem" key={item._id}>
              <img src={item.image} alt={item.name} className="CartItemImage" />
              <div className="CartItemInfo">
                <h3>{item.name}</h3>
                <p>{item.brand}</p>
                <p>Size: {item.size}</p>
                <p>₹{item.price}</p>
                <input
                  type="number"
                  min="1"
                  value={item.quantity || 1}
                  className="QuantityBox"
                  onChange={(e) => handleQuantity(index, e.target.value)}
                />
              </div>
              <button className="RemoveBtn" onClick={() => removeItem(index)}>
                ✖
              </button>
            </div>
          ))}

          <div className="CartSummary">
            <h2>Total: ₹{totalPrice}</h2>
            <button className="CheckoutBtn" onClick={() => setShowModal(true)}>
              Checkout
            </button>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showModal && (
        <div className="ModalOverlay">
          <div className="ModalContent">
            <h2>Checkout</h2>
            <input
              type="text"
              placeholder="Full Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="ModalInput"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="ModalInput"
            />
            <div className="ModalButtons">
              <button
                className="ConfirmBtn"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm Checkout"}
              </button>
              <button
                className="CancelBtn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;