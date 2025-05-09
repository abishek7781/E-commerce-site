import React from 'react';
import ProductItem from './ProductItem';

const ProductList = ({ products = [] }) => {
  // Add image URL to each product if not present
  const productsWithImages = products.map(product => ({
    ...product,
    image: product.image || 'https://electronicparadise.in/cdn/shop/files/5_df7b1222-8a60-4b6b-bb78-f873cc6408a4.png?v=1702452453&width=1406'
  }));

  return (
    <div className="product-list">
      {productsWithImages.map(product => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
