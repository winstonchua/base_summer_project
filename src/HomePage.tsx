// src/HomePage.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Content from './Content';

interface HomePageProps {
  items: any[];
  onDeleteItem: (id: string) => void;
  currentUserAddress: `0x${string}` | undefined;
}

const HomePage: React.FC<HomePageProps> = ({ items, onDeleteItem, currentUserAddress }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/events')
      .then(response => {
        const uniqueCategories = [...new Set<string>(response.data.map((item: any) => item.category))];
        setCategories(uniqueCategories);
      })
      .catch(error => console.error('Error fetching items:', error));
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prevSelectedCategories =>
      prevSelectedCategories.includes(category)
        ? prevSelectedCategories.filter(c => c !== category)
        : [...prevSelectedCategories, category]
    );
  };

  const handleItemClick = (eventId: string) => {
    navigate(`/event/${eventId}`);
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
        onDeleteItem={onDeleteItem}
        currentUserAddress={currentUserAddress}
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
};

export default HomePage;
