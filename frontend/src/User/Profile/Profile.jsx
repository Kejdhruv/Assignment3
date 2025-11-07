import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Profile.css";

export default function Profile() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:8000/Order", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();

        if (data.length > 0) {
          const firstOrder = data[0];
          setUser({
            name: firstOrder.name || "Unknown User",
            email: firstOrder.Email || "No email",
          });
        }

        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error("Failed to load your orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="text-loading">Loading orders...</p>;
  if (orders.length === 0) return <p className="text-loading">No orders placed yet.</p>;

  return (
    <div className="profile-page">

      <div className="profile-header">
        <p className="profile-title">{user.name}</p>
        <p className="profile-email">{user.email}</p>
      </div>

      <div className="profile-content">
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-info">
                <p>
                  <span className="label">Shipping Address:</span>{" "}
                  {order.address?.line1 || ""}, {order.address?.line2 || ""}, {order.address?.city || ""}, {order.address?.state || ""} - {order.address?.pincode || ""}
                </p>
                <p>
                  <span className="label">Phone:</span> {order.phone || "N/A"}
                </p>
                <p>
                  <span className="label">Order Date:</span> {new Date(order.date || order.products?.[0]?.date || Date.now()).toLocaleString()}
                      </p>
                       <p>
                  <span className="label">Total Price:</span> ₹{order.total }
                </p>
              </div>

              <div className="items-grid">
                {order.products?.map((item, idx) => (
                  <div className="item-card" key={idx}>
                    <img src={item.image || ""} alt={item.name || "Product"} />
                    <p className="item-name">{item.name || "Unnamed Product"}</p>
                    <p><span className="label">Price:</span> ₹{item.price || 0}</p>
                    <p><span className="label">Qty:</span> {item.quantity || 0}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}