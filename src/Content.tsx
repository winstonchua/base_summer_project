// src/Content.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Content = ({ selectedCategories, items }) => {
  const filteredItems = selectedCategories.length === 0 ? items : items.filter(item => selectedCategories.includes(item.category));

  return (
    <div style={styles.content}>
      {filteredItems.map((item, index) => (
        <Link to={`/event/${item.eventId}`} key={index} style={styles.itemBoxLink}>
          <div style={styles.itemBox}>
            <img src={item.image} alt={item.name} style={styles.itemImage} />
            <h3 style={styles.itemTitle}>{item.name}</h3>
            <p style={styles.itemDescription}>{item.description}</p>
            <p style={styles.itemOwner}>Owner: {item.owner}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

const styles = {
  content: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    padding: '20px',
  },
  itemBoxLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  itemBox: {
    width: '300px',
    height: '400px',
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '5px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  itemImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '5px',
  },
  itemTitle: {
    fontSize: '16px',
    textDecoration: 'underline',
    margin: '10px 0',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 1,
  },
  itemDescription: {
    fontSize: '14px',
    color: '#555',
    flexGrow: 1,
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 3, // Change this value to set the number of lines
  },
  itemOwner: {
    fontSize: '12px',
    color: '#999',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  },
};

export default Content;
