import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("/api/products").then((response) => {
      setProducts(response.data);
    });
  }, []);

  return (
    <div>
      <h1>Product List</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <Link to={`/edit/${product.id}`}>Edit Product {product.id}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
