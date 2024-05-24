// src/AdminPage.tsx
import React, { useState } from 'react';

const AdminPage = ({ onAddItem, onWhitelistAdmin }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [newAdminAddress, setNewAdminAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddItem({ name, description, image, category });
    setName('');
    setDescription('');
    setImage('');
    setCategory('');
  };

  const handleWhitelistSubmit = (e) => {
    e.preventDefault();
    onWhitelistAdmin(newAdminAddress);
    setNewAdminAddress('');
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
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
          style={styles.input}
        />
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
        <button type="submit" style={styles.button}>Add Item</button>
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
};

export default AdminPage;
