// src/MyEventsPage.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import Sidebar from './Sidebar';
import Content from './Content';

const MyEventsPage = () => {
  const { address, isConnected } = useAccount();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isConnected) {
      axios.get('http://localhost:5000/events')
        .then(response => {
          const myItems = response.data.filter((item: any) => item.owner === address);
          setItems(myItems);
          const uniqueCategories = [...new Set<string>(myItems.map((item: any) => item.category))];
          setCategories(uniqueCategories);
        })
        .catch(error => console.error('Error fetching items:', error));
    }
  }, [address, isConnected]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prevSelectedCategories =>
      prevSelectedCategories.includes(category)
        ? prevSelectedCategories.filter(c => c !== category)
        : [...prevSelectedCategories, category]
    );
  };

  const handleDeleteItem = (id: string) => {
    axios.delete(`http://localhost:5000/events/${id}`)
      .then(() => setItems(items.filter(item => item._id !== id)))
      .catch(error => console.error('Error deleting item:', error));
  };

  const handleItemClick = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };

  if (!isConnected) {
    return <div style={styles.message as React.CSSProperties}>Please connect your wallet to view your events.</div>;
  }

  if (items.length === 0) {
    return <div style={styles.message as React.CSSProperties}>You have no events.</div>;
  }

  return (
    <div style={styles.container as React.CSSProperties}>
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
