// src/Content.tsx
import React, { useState } from 'react';
import EventModal from './EventModal';

const Content = ({ selectedCategories, items, onDeleteItem, currentUserAddress, isAdmin }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filteredItems = selectedCategories.length === 0 ? items : items.filter(item => selectedCategories.includes(item.category));

  return (
    <div style={styles.content}>
      {filteredItems.map((item, index) => (
        <div key={index} style={styles.itemBox} onClick={() => setSelectedEvent(item)}>
          <img src={item.image} alt={item.name} style={styles.itemImage} />
          <h3 style={styles.itemTitle}>{item.name}</h3>
          <p style={styles.itemDescription}>{item.description}</p>
          <p style={styles.itemOwner}>Owner: {item.owner}</p>
        </div>
      ))}
      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onDelete={onDeleteItem}
        onEdit={() => console.log('Edit functionality not yet implemented')}
        currentUserAddress={currentUserAddress}
        isAdmin={isAdmin}
      />
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
  itemBox: {
    width: '250px',
    height: '350px',
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
    textAlign: 'center',
    cursor: 'pointer',
  },
  itemImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '5px',
  },
  itemTitle: {
    textDecoration: 'underline',
    margin: '10px 0',
    height: '40px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  itemDescription: {
    fontSize: '14px',
    color: '#555',
    textAlign: 'justify',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    height: '80px',
  },
  itemOwner: {
    fontSize: '12px',
    color: '#999',
    wordBreak: 'break-word',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    height: '20px',
  },
};

export default Content;
