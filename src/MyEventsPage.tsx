// src/MyEventsPage.tsx
import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import EventModal from './EventModal';

const MyEventsPage = ({ items, onDeleteItem, currentUserAddress, isAdmin }) => {
  const { address, isConnected } = useAccount();
  const [selectedEvent, setSelectedEvent] = useState(null);

  if (!isConnected) {
    return <div style={styles.message}>Please connect your wallet to view your events.</div>;
  }

  const myItems = items.filter(item => item.owner === address);

  if (myItems.length === 0) {
    return <div style={styles.message}>You have no events.</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Events</h2>
      <div style={styles.content}>
        {myItems.map((item, index) => (
          <div key={index} style={styles.itemBox} onClick={() => setSelectedEvent(item)}>
            <img src={item.image} alt={item.name} style={styles.itemImage} />
            <h3 style={styles.itemTitle}>{item.name}</h3>
            <p style={styles.itemDescription}>{item.description}</p>
            <p style={styles.itemOwner}>Owner: {item.owner}</p>
          </div>
        ))}
      </div>
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
  message: {
    padding: '20px',
    textAlign: 'center',
    fontSize: '18px',
    color: '#555',
  },
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
    height: 'auto',
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

export default MyEventsPage;
