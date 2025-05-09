import React, { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';

const Home = ({ searchTerm }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Sample static data with image URLs for each product
    const sampleProducts = [
      { id: 1, name: 'Smartphone', price: 15000, image: 'https://electronicparadise.in/cdn/shop/files/5_df7b1222-8a60-4b6b-bb78-f873cc6408a4.png?v=1702452453&width=1406' },
      { id: 2, name: 'Laptop', price: 55000, image: 'https://electronicparadise.in/cdn/shop/files/5_df7b1222-8a60-4b6b-bb78-f873cc6408a4.png?v=1702452453&width=1406' },
      { id: 3, name: 'Headphones', price: 2000, image: 'https://electronicparadise.in/cdn/shop/files/5_df7b1222-8a60-4b6b-bb78-f873cc6408a4.png?v=1702452453&width=1406' },
      { id: 4, name: 'Smartwatch', price: 8000, image: 'https://electronicparadise.in/cdn/shop/files/5_df7b1222-8a60-4b6b-bb78-f873cc6408a4.png?v=1702452453&width=1406' },
      { id: 5, name: 'Camera', price: 25000, image: 'https://electronicparadise.in/cdn/shop/files/5_df7b1222-8a60-4b6b-bb78-f873cc6408a4.png?v=1702452453&width=1406' },
      { id: 6, name: 'Bluetooth Speaker', price: 3500, image: 'https://electronicparadise.in/cdn/shop/files/5_df7b1222-8a60-4b6b-bb78-f873cc6408a4.png?v=1702452453&width=1406' },
      { id: 7, name: 'Gaming Console', price: 45000, image: 'https://electronicparadise.in/cdn/shop/files/5_df7b1222-8a60-4b6b-bb78-f873cc6408a4.png?v=1702452453&width=1406' },
      { id: 8, name: 'Wireless Mouse', price: 1200, image: 'https://electronicparadise.in/cdn/shop/files/5_df7b1222-8a60-4b6b-bb78-f873cc6408a4.png?v=1702452453&width=1406' },
      { id: 9, name: 'Mechanical Keyboard', price: 7000, image: 'https://electronicparadise.in/cdn/shop/files/5_df7b1222-8a60-4b6b-bb78-f873cc6408a4.png?v=1702452453&width=1406' },
      { id: 10, name: 'External Hard Drive', price: 6000, image: 'https://electronicparadise.in/cdn/shop/files/5_df7b1222-8a60-4b6b-bb78-f873cc6408a4.png?v=1702452453&width=1406' },
      { id: 11, name: 'Fitness Tracker', price: 4000, image: 'https://electronicparadise.in/cdn/shop/files/5_df7b1222-8a60-4b6b-bb78-f873cc6408a4.png?v=1702452453&width=1406' },
      { id: 12, name: 'Drone', price: 35000, image: 'https://electronicparadise.in/cdn/shop/files/5_df7b1222-8a60-4b6b-bb78-f873cc6408a4.png?v=1702452453&width=1406' },
      { id: 13, name: 'VR Headset', price: 28000, image: 'https://electronicparadise.in/cdn/shop/files/5_df7b1222-8a60-4b6b-bb78-f873cc6408a4.png?v=1702452453&width=1406' },
      { id: 14, name: 'Tablet', price: 22000, image: 'https://electronicparadise.in/cdn/shop/files/5_df7b1222-8a60-4b6b-bb78-f873cc6408a4.png?v=1702452453&width=1406' },
      { id: 15, name: 'Smart Home Hub', price: 9000, image: 'https://electronicparadise.in/cdn/shop/files/5_df7b1222-8a60-4b6b-bb78-f873cc6408a4.png?v=1702452453&width=1406' },
    ];
    const filteredProducts = searchTerm && searchTerm.trim() !== ''
      ? sampleProducts.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : sampleProducts;
    setProducts(filteredProducts);
  }, [searchTerm]);

  return (
    <div className="page home-page">
      <h1>Welcome to ShopSphere</h1>
      <p>Discover the best electronics and gadgets at unbeatable prices.</p>
      {products.length > 0 ? (
        <ProductList products={products} />
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default Home;
