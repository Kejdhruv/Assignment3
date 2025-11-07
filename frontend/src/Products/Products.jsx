import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Products.css";

function Products() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/Products");
        const responseData = await response.json();
        setData(responseData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="Title">Products</div>
      <div className="Cards">
        {data.map((product) => (
          <Link
            to={`/Product/${product._id}`}
            key={product._id}
            className="product-link"
          >
            <div className="product">
              <div className="pimage">
                <img
                  src={product.images?.[0] || ""}
                  alt={product.name}
                />
              </div>
              <p className="product-name">{product.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default Products;