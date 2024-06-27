// src/AdminPage.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useAccount } from 'wagmi';

const AdminPage = ({ onAddItem, onWhitelistAdmin }) => {
  const { address } = useAccount();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [owner, setOwner] = useState('');
  const [newAdminAddress, setNewAdminAddress] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const width = 250; // Fixed width
        const height = 135; // Fixed height

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const resizedImage = canvas.toDataURL('image/jpeg');
        setImage(resizedImage);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Get the latest eventId
      const response = await axios.get('http://localhost:5000/events/latestId');
      console.log(response)
      const latestEventId = response.data.latestEventId;
      const newEventId = latestEventId + 1;

      const newItem = {
        name,
        description,
        image,
        category,
        owner,
        eventId: newEventId,
      };

      const eventResponse = await axios.post('http://localhost:5000/events', newItem);
      onAddItem(eventResponse.data);
      setName('');
      setDescription('');
      setImage('');
      setCategory('');
      setOwner('');
      setConfirmationMessage('Event added successfully!');
      setTimeout(() => setConfirmationMessage(''), 3000);
    } catch (err) {
      console.error('Error adding event:', err);
      setConfirmationMessage('Failed to add event.');
      setTimeout(() => setConfirmationMessage(''), 3000);
    }
  };

  const handleWhitelistSubmit = (e) => {
    e.preventDefault();
    onWhitelistAdmin(newAdminAddress);
    setNewAdminAddress('');
    setConfirmationMessage('Admin added successfully!');
    setTimeout(() => setConfirmationMessage(''), 3000);
  };

  return (
    <div style={styles.container}>
      <h2>Admin Page</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={styles.input}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={styles.textarea}
        />
        <input
          type="file"
          onChange={handleImageUpload}
          required
          style={styles.input}
        />
        {image && (
          <img src={image} alt="Preview" style={{ width: '100%', maxWidth: '200px', marginTop: '10px' }} />
        )}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          style={styles.select}
        >
          <option value="" disabled>Select Category</option>
          <option value="Dev">Dev</option>
          <option value="NFT">NFT</option>
          <option value="DeFi">DeFi</option>
          <option value="IRL Events">IRL Events</option>
        </select>
        <input
          type="text"
          placeholder="Owner"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Add Event</button>
      </form>

      <form onSubmit={handleWhitelistSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="New Admin Wallet Address"
          value={newAdminAddress}
          onChange={(e) => setNewAdminAddress(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Whitelist Admin</button>
      </form>
      
      {confirmationMessage && (
        <div style={styles.confirmationMessage}>{confirmationMessage}</div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  textarea: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    height: '100px',
  },
  select: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  confirmationMessage: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '5px',
  },
};

export default AdminPage;
