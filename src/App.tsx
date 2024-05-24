// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import AdminPage from './AdminPage';
import { useAccount } from 'wagmi';

const App = () => {
  const { address } = useAccount();
  const [adminAddresses, setAdminAddresses] = useState(['0x6C5CBA5B117ab22df5D8DCD35eB7a57982F653D8']);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log('Address:', address);
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

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage isAdmin={isAdmin} onWhitelistAdmin={handleWhitelistAdmin} />} />
        <Route path="/admin" element={isAdmin ? <AdminPage onWhitelistAdmin={handleWhitelistAdmin} /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
