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

  const userEmail = "demo1_user@example.com"; // dummy email

  // Fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`http://localhost:8000/Cart/${userEmail}`);
        if (!res.ok) throw new Error("Failed to fetch cart");
        const result = await res.json();
        setCart(result);
      } catch (err) {
        toast.error("Error loading cart" , err );
      }
    };
    fetchCart();
  }, []);

  // Remove item (frontend only)
    const removeItem = async (index) => {
    const item = cart[index];
    try {
      await fetch(`http://localhost:8000/Cart/${item._id}`, {
        method: "DELETE",
      });
      setCart(cart.filter((_, i) => i !== index));
      toast.success("Item removed!");
    } catch (err) {
      toast.error("Failed to remove item" , err);
    }
  };

  // Update quantity (frontend only)
  const handleQuantity = (index, value) => {
    if (value < 1) return;
    const updatedCart = [...cart];
    updatedCart[index].quantity = value;
    setCart(updatedCart);
  };

  // Calculate total
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  // Checkout
  const handleCheckout = async () => {
    if (!address || !phone) {
      toast.error("Please fill in address and phone");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    const orderData = {
      email: userEmail,
      address,
      phone,
      products: cart.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        image: item.image,
      })),
      total: totalPrice,
      date: new Date().toISOString(),
    };

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/Order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([orderData]),
      });

      if (!res.ok) throw new Error("Order failed");

      toast.success("Order placed successfully!");
      setCart([]);
      setAddress("");
      setPhone("");
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to place order" , err );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-page">
      <ToastContainer />

      <div className="cart-left">
        <h2>Your Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cart.map((item, index) => (
            <div className="cart-item" key={index}>
              <img src={item.image} alt={item.name} />
              <div className="cart-details">
                <h3>{item.name}</h3>
                <p>₹{item.price}</p>
                <div className="quantity-control">
                  <button onClick={() => handleQuantity(index, item.quantity - 1)}>-</button>
                  <input
                    type="number"
                    value={item.quantity || 1}
                    onChange={(e) => handleQuantity(index, parseInt(e.target.value))}
                  />
                  <button onClick={() => handleQuantity(index, item.quantity + 1)}>+</button>
                </div>
              </div>
              <button className="remove-btn" onClick={() => removeItem(index)}>Remove</button>
            </div>
          ))
        )}
      </div>

     <div className="cart-right">
  <h3>Order Summary</h3>

  <ul className="summary-items">
    {cart.map((item) => (
      <li key={item._id}>
        <span>{item.name} × {item.quantity}</span>
        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
      </li>
    ))}
  </ul>

  <hr />

  <div className="summary-details">
    <p><span>Subtotal:</span> <span>₹{totalPrice}</span></p>
    <p><span>Delivery Charges:</span> <span>₹100</span></p>
    <p className="discount-line"><span>Delivery Discount:</span> <span>-₹100</span></p>
    <p><span>Reward Points Earned:</span> <span>+{Math.floor(totalPrice / 50)} pts</span></p>
  </div>

  <hr />

  <h4 className="summary-total">
    <span>Total Payable:</span>
    <span>₹{totalPrice.toFixed(2)}</span>
  </h4>

  <p className="delivery-estimate">
    Estimated delivery: <strong>3–5 days</strong>
  </p>

  <button className="checkout-btn" onClick={() => setShowModal(true)} disabled={cart.length === 0}>
    Proceed to Checkout
  </button>

  <p className="reward-note">✨ Earn 1 point for every ₹50 spent!</p>
</div>

      {/* Checkout Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Checkout</h3>
            <input
              type="text"
              placeholder="Enter Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={handleCheckout} disabled={loading}>
                {loading ? "Processing..." : "Confirm Checkout"}
              </button>
              <button className="cancel" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;