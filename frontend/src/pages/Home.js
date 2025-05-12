import React, { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';

const dealOfTheDayProducts = [
  { id: 101, name: 'Gaming Console', price: 45000, image: 'https://m.media-amazon.com/images/I/71d4Z5wr+AL.jpg' },
  { id: 102, name: 'Wireless Mouse', price: 1200, image: 'https://www.primeabgb.com/wp-content/uploads/2023/10/Logitech-G502-X-Lightspeed-Wireless-Gaming-Mouse-910-006182.jpg' },
  { id: 103, name: 'Fitness Tracker', price: 4000, image: 'https://api.time.com/wp-content/uploads/2014/01/fitbit.jpg' },
  { id: 104, name: 'Wireless Charger', price: 2500, image: 'https://m.media-amazon.com/images/I/614+4XNwpML.jpg' },
  { id: 105, name: 'Tablet', price: 22000, image: 'https://p2-ofp.static.pub/fes/cms/2021/10/28/juqs65pgl1gh3dysi7yv1tnvtsiqva364946.png' }
];

const Home = ({ searchTerm }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const sampleProducts = [
      { id: 1, name: 'Smartphone', price: 15000, image: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1729857221/Croma%20Assets/Communication/Mobiles/Images/311650_0_tzbu9n.png' },
      { id: 2, name: 'Laptop', price: 55000, image: 'https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/FL2C-A-BB-01?qlt=90&wid=1253&hei=705&extendN=0.12,0.12,0.12,0.12&bgc=FFFFFFFF&fmt=jpg' },
      { id: 3, name: 'Headphones', price: 2000, image: 'https://assets.myntassets.com/dpr_1.5,q_60,w_400,c_limit,fl_progressive/assets/images/29856318/2025/1/8/79a9f99b-915e-4187-b16a-370d4c8f79491736328891444-Sony-Unisex-Headphones-2641736328890534-1.jpg' },
      { id: 4, name: 'Smartwatch', price: 8000, image: 'https://img.fruugo.com/product/9/98/1235619989_0340_0340.jpg' },
      { id: 5, name: 'Camera', price: 25000, image: 'https://poojaelectronics.in/storage/2023/08/Nikon-D7500-DSLR-Camera-with-18-140mm-Lens-Online-Buy-India_01.jpg' },
      { id: 6, name: 'Portable Projector', price: 12000, image: 'https://m.media-amazon.com/images/I/51GTqntMW8L.jpg' },
      { id: 7, name: 'Gaming Console', price: 45000, image: 'https://m.media-amazon.com/images/I/71d4Z5wr+AL.jpg' },
      { id: 8, name: 'Wireless Mouse', price: 1200, image: 'https://www.primeabgb.com/wp-content/uploads/2023/10/Logitech-G502-X-Lightspeed-Wireless-Gaming-Mouse-910-006182.jpg' },
      { id: 9, name: 'Wireless Charger', price: 2500, image: 'https://m.media-amazon.com/images/I/614+4XNwpML.jpg' },
      { id: 10, name: 'Smart Light Bulb', price: 1500, image: 'https://d1vfpdpyv21g5i.cloudfront.net/zunpulse/products_v5/bulb/D10000_1.jpg' },
      { id: 11, name: 'Fitness Tracker', price: 4000, image: 'https://api.time.com/wp-content/uploads/2014/01/fitbit.jpg' },
      { id: 12, name: 'Drone', price: 35000, image: 'https://se-cdn.djiits.com/stormsend/uploads/a04962b9405f36a2a0461142c149b909.png' },
      { id: 13, name: 'VR Headset', price: 28000, image: 'https://cdn.mos.cms.futurecdn.net/H7Fom2R9cYUsquyzzB86dH.jpg' },
      { id: 14, name: 'Tablet', price: 22000, image: 'https://p2-ofp.static.pub/fes/cms/2021/10/28/juqs65pgl1gh3dysi7yv1tnvtsiqva364946.png' },
      { id: 15, name: 'Smart Home Hub', price: 9000, image: 'https://rukminim2.flixcart.com/image/850/1000/xif0q/speaker/smart-speaker/a/6/l/b09b917z8d-alexa-original-imah4wy9zzezh5pv.jpeg?q=90&crop=false' },
      { id: 16, name: 'Mechanical Keyboard', price: 7000, image: 'https://www.amkette.com/cdn/shop/files/newmechanicalKeyboard.952.png?v=1728639637' },
      { id: 17, name: 'External Hard Drive', price: 6000, image: 'https://www.minitool.com/images/uploads/2019/06/external-hard-disk-1.png' },
      { id: 18, name: 'Bluetooth Speaker', price: 3500, image: 'https://www.boat-lifestyle.com/cdn/shop/files/Stone_SpinXPro_1.png?v=1709717404' },
      { id: 19, name: 'Noise Cancelling Earbuds', price: 8000, image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-4-anc-select-202409_FMT_WHH?wid=752&hei=636&fmt=jpeg&qlt=90&.v=1725502639798' },
      { id: 20, name: 'Wireless Keyboard', price: 3500, image: 'https://zebronics.com/cdn/shop/products/ZEB-K5000MW-pic1.jpg?v=1648026336' },
    ];
    const filteredProducts = searchTerm && searchTerm.trim() !== ''
      ? sampleProducts.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : sampleProducts;
    setProducts(filteredProducts);
  }, [searchTerm]);

  const containerStyle = {
    maxWidth: '1200px',
    margin: '3rem auto',
    padding: '1rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const sectionStyle = {
    marginBottom: '3rem',
  };

  const headingStyle = {
    color: '#007acc',
    marginBottom: '1rem',
    borderBottom: '2px solid #007acc',
    paddingBottom: '0.5rem',
  };

  return (
    <div style={containerStyle}>
      {/* Deal of the Day */}
      <section style={sectionStyle}>
        <h2 style={headingStyle}>Deal of the Day</h2>
        <ProductList products={dealOfTheDayProducts} />
      </section>

      {/* Top Products */}
      <section style={sectionStyle}>
        <h2 style={headingStyle}>Top Products</h2>
        {products.length > 0 ? (
          <ProductList products={products} />
        ) : (
          <p>No products found.</p>
        )}
      </section>
    </div>
  );
};

export default Home;
