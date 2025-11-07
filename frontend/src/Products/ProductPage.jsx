import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductPage.css";

function ProductPage() {
  const { UID } = useParams();
  const [data, setData] = useState(null);
  const [size, setSize] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const userEmail = "demo_user@example.com"; // temporary dummy email

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:8000/Products/${UID}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      }
    };
    fetchProduct();
  }, [UID]);

  const handleSize = (option) => {
    setSize(option);
  };

  const handleSubmit = async () => {
    if (!size) {
      setError("Please select a size before adding to cart");
      return;
    }

    const newItem = [
      {
        Email: userEmail,
        name: data.name,
        brand: data.brand,
        price: data.price,
        material: data.material,
        description: data.description,
        image: data.images[0],
        size: size,
      },
    ];

    try {
      const res = await fetch("http://localhost:8000/Cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });

      if (!res.ok) throw new Error("Failed to add item to cart");

      setMessage("Product added to cart successfully!");
      setError("");
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError("Error adding to cart");
    }
  };

  if (!data) return <div className="loading">Loading...</div>;

  return (
    <div className="ProductContainer">
      <div className="product-header">
        <h1>{data.name}</h1>
        <p className="brand">{data.brand}</p>
      </div>

      <div className="product-content">
        <div className="product-image">
          <img src={data.images[0]} alt={data.name} />
        </div>

        <div className="product-details">
          <p><strong>Material:</strong> {data.material}</p>
          <p><strong>Price:</strong> ₹{data.price}</p>
          <p><strong>Description:</strong> {data.description}</p>

          <div className="size-section">
            <p><strong>Select Size:</strong></p>
            <div className="SizeOptions">
              {data.sizes?.map((option) => (
                <button
                  key={option}
                  className={`SizeOption ${size === option ? "active" : ""}`}
                  onClick={() => handleSize(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <button className="Cartbutton" onClick={handleSubmit}>
            Add to Cart
          </button>

          {message && <p className="success">{message}</p>}
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default ProductPage;