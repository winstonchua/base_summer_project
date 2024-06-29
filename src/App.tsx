// src/App.tsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import EventDetailsPage from './EventDetailsPage';
import AdminPage from './AdminPage';
import MyEventsPage from './MyEventsPage';
import Layout from './Layout';
import axios from 'axios';
import { useAccount } from 'wagmi';
import 'bootstrap/dist/css/bootstrap.min.css';
import DeployPoapPage from './DeployPoapPage';
import MintPoapPage from './MintPoapPage';
import ProfilePage from './ProfilePage';

const App = () => {
  const { address } = useAccount();
  const [items, setItems] = useState<any[]>([]);
  const [adminAddresses, setAdminAddresses] = useState<string[]>(['0x6C5CBA5B117ab22df5D8DCD35eB7a57982F653D8']);
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

  const handleWhitelistAdmin = (newAdminAddress: string) => {
    if (!adminAddresses.includes(newAdminAddress)) {
      setAdminAddresses([...adminAddresses, newAdminAddress]);
    }
  };

  const handleAddItem = (newItem: any) => {
    setItems([...items, newItem]);
  };

  const handleDeleteItem = (id: string) => {
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
                items={items}
                onDeleteItem={handleDeleteItem}
                currentUserAddress={address}
              />
            }
          />
          <Route
            path="/event/:eventId"
            element={
              <EventDetailsPage
                currentUserAddress={address || '0x'}
                isAdmin={isAdmin}
                onDelete={handleDeleteItem}
              />
            }
          />
          <Route path="/deploy-poap/:eventId" element={<DeployPoapPage />} />
          <Route path="/mint-poap/:poapContractAddress/:eventId/:poapId/:nonce" element={<MintPoapPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/yourevents" element={<MyEventsPage />} />
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
