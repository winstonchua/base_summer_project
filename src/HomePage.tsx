// src/HomePage.tsx
import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Content from './Content';

const HomePage = ({ isAdmin, onWhitelistAdmin }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [items, setItems] = useState([
    { category: 'Dev', name: 'Item 1', description: 'Description for Item 1', image: '/path/to/image1.jpg' },
    { category: 'Dev', name: 'Item 2', description: 'Description for Item 2', image: '/path/to/image2.jpg' },
    { category: 'NFT', name: 'Item 3', description: 'Description for Item 3', image: '/path/to/image3.jpg' },
    { category: 'NFT', name: 'Item 4', description: 'Description for Item 4', image: '/path/to/image4.jpg' },
    { category: 'DeFi', name: 'Item 5', description: 'Description for Item 5', image: '/path/to/image5.jpg' },
    { category: 'DeFi', name: 'Item 6', description: 'Description for Item 6', image: '/path/to/image6.jpg' },
    { category: 'IRL Events', name: 'Item 7', description: 'Description for Item 7', image: '/path/to/image7.jpg' },
    { category: 'IRL Events', name: 'Item 8', description: 'Description for Item 8', image: '/path/to/image8.jpg' },
  ]);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prevSelectedCategories =>
      prevSelectedCategories.includes(category)
        ? prevSelectedCategories.filter(c => c !== category)
        : [...prevSelectedCategories, category]
    );
  };

  const handleAddItem = (newItem) => {
    setItems([...items, newItem]);
  };

  return (
    <div>
      <Navbar isAdmin={isAdmin} />
      <div style={styles.container}>
        <Sidebar
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
        />
        <Content selectedCategories={selectedCategories} items={items} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    padding: '20px',
  },
};

export default HomePage;
