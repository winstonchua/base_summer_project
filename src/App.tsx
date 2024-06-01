// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import MyEventsPage from './MyEventsPage';
import AdminPage from './AdminPage';
import { useAccount } from 'wagmi';
import DeployERC721 from './DeployERC721';
import Layout from './Layout';
import axios from 'axios';

const App = () => {
  const { address } = useAccount();
  const [items, setItems] = useState([]);
  const [adminAddresses, setAdminAddresses] = useState(['0x6C5CBA5B117ab22df5D8DCD35eB7a57982F653D8']);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/events')
      .then(response => {
        setItems(response.data);
      })
      .catch(error => console.error('Error fetching items:', error));
  }, []);

  useEffect(() => {
    if (address && adminAddresses.includes(address)) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [address, adminAddresses]);

  const handleWhitelistAdmin = (newAdminAddress) => {
    if (!adminAddresses.includes(newAdminAddress)) {
      setAdminAddresses([...adminAddresses, newAdminAddress]);
    }
  };

  const handleAddItem = (newItem) => {
    setItems([...items, newItem]);
  };

  const handleDeleteItem = (id) => {
    axios.delete(`http://localhost:5000/events/${id}`)
      .then(() => setItems(items.filter(item => item._id !== id)))
      .catch(error => console.error('Error deleting item:', error));
  };

  return (
    <Router>
      <Layout isAdmin={isAdmin}>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                isAdmin={isAdmin}
                onWhitelistAdmin={handleWhitelistAdmin}
                items={items}
                onAddItem={handleAddItem}
                onDeleteItem={handleDeleteItem}
                currentUserAddress={address}
              />
            }
          />
          <Route
            path="/myevents"
            element={
              <MyEventsPage
                items={items}
                onDeleteItem={handleDeleteItem}
                currentUserAddress={address}
                isAdmin={isAdmin}
              />
            }
          />
          <Route path="/deploy" element={<DeployERC721 />} />
          <Route
            path="/admin"
            element={isAdmin ? <AdminPage onAddItem={handleAddItem} onWhitelistAdmin={handleWhitelistAdmin} /> : <Navigate to="/" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
