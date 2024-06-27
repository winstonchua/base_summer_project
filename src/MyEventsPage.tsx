// src/MyEventsPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Content from './Content';

const MyEventsPage = ({ isAdmin }) => {
  const { address, isConnected } = useAccount();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isConnected) {
      axios.get('http://localhost:5000/events')
        .then(response => {
          const myItems = response.data.filter(item => item.owner === address);
          setItems(myItems);
          const uniqueCategories = [...new Set(myItems.map(item => item.category))];
          setCategories(uniqueCategories);
        })
        .catch(error => console.error('Error fetching items:', error));
    }
  }, [address, isConnected]);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prevSelectedCategories =>
      prevSelectedCategories.includes(category)
        ? prevSelectedCategories.filter(c => c !== category)
        : [...prevSelectedCategories, category]
    );
  };

  const handleDeleteItem = (id) => {
    axios.delete(`http://localhost:5000/events/${id}`)
      .then(() => setItems(items.filter(item => item._id !== id)))
      .catch(error => console.error('Error deleting item:', error));
  };

  const handleItemClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  if (!isConnected) {
    return <div style={styles.message}>Please connect your wallet to view your events.</div>;
  }

  if (items.length === 0) {
    return <div style={styles.message}>You have no events.</div>;
  }

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
        onItemClick={handleItemClick}
      />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    padding: '20px',
  },
  message: {
    padding: '20px',
    textAlign: 'center',
    fontSize: '18px',
    color: '#555',
  },
};

export default MyEventsPage;
