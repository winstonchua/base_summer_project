// src/Sidebar.tsx
import React from 'react';

const categories = ['Dev', 'NFT', 'DeFi', 'IRL Events'];

const Sidebar = ({ selectedCategories, onCategoryChange }) => {
  return (
    <div style={styles.sidebar}>
      <h3>Categories</h3>
      {categories.map((category) => (
        <div key={category} style={styles.checkboxContainer}>
          <input
            type="checkbox"
            id={category}
            checked={selectedCategories.includes(category)}
            onChange={() => onCategoryChange(category)}
          />
          <label htmlFor={category} style={styles.label}>{category}</label>
        </div>
      ))}
    </div>
  );
};

const styles = {
  sidebar: {
    width: '200px',
    padding: '20px',
    backgroundColor: '#f8f8f8',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '5px',
  },
  checkboxContainer: {
    marginBottom: '10px',
  },
  label: {
    marginLeft: '8px',
  },
};

export default Sidebar;
