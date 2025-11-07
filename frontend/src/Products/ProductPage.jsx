import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductPage.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductPage() {
  const { UID } = useParams();
  const [data, setData] = useState(null);
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:8000/Products/${UID}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching product:", err);
        toast.error("Failed to load product");
      }
    };
    fetchProduct();
  }, [UID]);

  const handleSize = (option) => {
    setSize(option);
  };

  const handleSubmit = async () => {
    if (!size) {
      toast.warn("Please select a size before adding to cart");
      return;
    }

    const newItem = [
      {
        ProductId : data._id , 
        name: data.name,
        brand: data.brand,
        price: data.price,
        material: data.material,
        description: data.description,
        image: data.images[0],
        size: size,
        quantity: quantity,
      },
    ];

    try {
      const res = await fetch("http://localhost:8000/Cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to add item to cart");

      toast.success("✅ Product added to cart successfully!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("❌ Error adding product to cart");
    }
  };

  if (!data) return <div className="loading">Loading...</div>;

  return (
    <>
      <div className="ProductContainer">
        <div className="ProductWrapper">
          {/* LEFT SIDE: IMAGE */}
          <div className="ProductImageSection">
            <img
              src={data.images[0]}
              alt={data.name}
              className="MainProductImage"
            />
          </div>

          {/* RIGHT SIDE: DETAILS */}
          <div className="ProductInfoSection">
            <h1 className="ProductName">{data.name}</h1>
            <p className="ProductBrand">
              {data.brand} <span className="ProductRating">⭐ 4.5/5</span>
            </p>

            <p className="ProductPrice">₹{data.price}</p>

            <p className="ProductDescription">{data.description}</p>
            <p className="ProductMaterial">
              <strong>Material:</strong> {data.material}
            </p>

            <div className="SizeSection">
              <p className="SectionTitle">Select Size:</p>
              <div className="SizeOptions">
                {data.sizesAvailable?.map((option) => (
                  <button
                    key={option}
                    className={`SizeOption ${
                      size === option ? "active" : ""
                    }`}
                    onClick={() => handleSize(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="QuantitySection">
              <p className="SectionTitle">Quantity:</p>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="QuantityInput"
              />
            </div>

            <button className="AddToCartButton" onClick={handleSubmit}>
              🛒 Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default ProductPage;