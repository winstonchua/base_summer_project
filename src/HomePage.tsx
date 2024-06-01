// src/HomePage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAccount } from 'wagmi';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Content from './Content';

const HomePage = ({ isAdmin, onWhitelistAdmin }) => {
  const { address } = useAccount();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/events')
      .then(response => {
        setItems(response.data);
        const uniqueCategories = [...new Set(response.data.map(item => item.category))];
        setCategories(uniqueCategories);
      })
      .catch(error => console.error('Error fetching items:', error));
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prevSelectedCategories =>
      prevSelectedCategories.includes(category)
        ? prevSelectedCategories.filter(c => c !== category)
        : [...prevSelectedCategories, category]
    );
  };

  const handleAddItem = (newItem) => {
    axios.post('http://localhost:5000/events', newItem)
      .then(response => {
        setItems([...items, response.data]);
        if (!categories.includes(response.data.category)) {
          setCategories([...categories, response.data.category]);
        }
      })
      .catch(error => console.error('Error adding item:', error));
  };

  const handleDeleteItem = (id) => {
    axios.delete(`http://localhost:5000/events/${id}`)
      .then(() => setItems(items.filter(item => item._id !== id)))
      .catch(error => console.error('Error deleting item:', error));
  };

  return (
    <div style={styles.container}>
      <Sidebar
        selectedCategories={selectedCategories}
        onCategoryChange={handleCategoryChange}
        categories={categories}
      />
      <Content
        selectedCategories={selectedCategories}
        items={items}
        onDeleteItem={handleDeleteItem}
        currentUserAddress={address}
        isAdmin={isAdmin}
      />
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
