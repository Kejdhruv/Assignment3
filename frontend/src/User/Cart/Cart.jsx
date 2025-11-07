import React, { useEffect, useState } from "react";
import "./Cart.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Cart() {
  const [cart, setCart] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Checkout form fields
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");


  // Fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
          const res = await fetch("http://localhost:8000/Cart", {
        method: "GET",
        credentials: "include", // <--- important to send cookies
      });

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
      toast.error("Failed to remove item" , err);
    }
  };

  // Quantity control
  const handleQuantity = (index, value) => {
    if (value < 1) return;
    const updatedCart = [...cart];
    updatedCart[index].quantity = value;
    setCart(updatedCart);
  };

  // Total price
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  // Checkout handler
  const handleCheckout = async () => {
    if (!address1 || !city || !state || !pincode || !phone) {
      toast.error("Please fill in all details");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    const orderData = {
      address: {
        line1: address1,
        line2: address2,
        city,
        state,
        pincode,
      },
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
        credentials: "include",
      });

      if (!res.ok) throw new Error("Order failed");

      toast.success("Order placed successfully!");
      setCart([]);
      setShowModal(false);
      setAddress1("");
      setAddress2("");
      setCity("");
      setState("");
      setPincode("");
      setPhone("");
    } catch (err) {
      toast.error("Failed to place order" , err );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-page">
      <ToastContainer />

      {/* Cart Section */}
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

      {/* Order Summary */}
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
            <div className="checkout-form">

              <div className="form-group">
                <label>Address Line 1</label>
                <input type="text" placeholder="Street / House No." value={address1} onChange={(e) => setAddress1(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Address Line 2</label>
                <input type="text" placeholder="Apartment / Landmark" value={address2} onChange={(e) => setAddress2(e.target.value)} />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>City</label>
                  <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Pincode</label>
                  <input type="text" placeholder="Postal Code" value={pincode} onChange={(e) => setPincode(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="text" placeholder="Mobile" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
            </div>

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