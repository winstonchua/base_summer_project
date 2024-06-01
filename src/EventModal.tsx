import React from 'react';
import { createPortal } from 'react-dom';

const EventModal = ({ event, onClose, onDelete, onEdit, currentUserAddress, isAdmin }) => {
  if (!event) return null;

  const isOwner = event.owner === currentUserAddress;

  const handleDelete = () => {
    onDelete(event._id);
    onClose();
  };

  return createPortal(
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeButton}>X</button>
        <h2 style={styles.title}>{event.name}</h2>
        <img src={event.image} alt={event.name} style={styles.image} />
        <p style={styles.label}>Description:</p>
        <p style={styles.description}>{event.description}</p>
        <p style={styles.details}>Category: {event.category}</p>
        <p style={styles.details}>Owner: {event.owner}</p>
        {(isOwner || isAdmin) && (
          <div style={styles.actions}>
            <button onClick={onEdit} style={styles.editButton}>Edit</button>
            <button onClick={handleDelete} style={styles.deleteButton}>Delete</button>
          </div>
        )}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    position: 'relative',
    fontFamily: 'Arial, sans-serif',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  label: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  description: {
    fontSize: '16px',
    marginBottom: '10px',
  },
  details: {
    fontSize: '14px',
    color: '#555',
    marginBottom: '5px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  editButton: {
    padding: '10px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '10px',
    backgroundColor: '#ff0000',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default EventModal;
