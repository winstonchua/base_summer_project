// src/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi';
import { BlackCreateWalletButton } from './BlackCreateWalletButton';
import logo from './pictures/plague.png';

const Navbar = ({ isAdmin }) => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const truncatedAddress = address ? `0x${address.slice(2, 6)}...${address.slice(-4)}` : '';

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', height: '60px', backgroundColor: '#000', color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={logo} alt="Logo" style={{ height: '40px' }} />
        <span style={{ marginLeft: '10px', fontSize: '20px', fontWeight: 'bold' }}>Auggy</span>
      </div>
      <div style={{ display: 'flex', gap: '20px', marginLeft: '40px', fontFamily: 'Arial, sans-serif' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px' }}>Home</Link>
        {isAdmin && <Link to="/admin" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px' }}>Admin</Link>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {isConnected ? (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <div style={{ padding: '5px 10px', backgroundColor: '#333', borderRadius: '5px', cursor: 'pointer' }}>
              {truncatedAddress}
            </div>
            <button onClick={() => disconnect()} style={{ marginLeft: '10px', padding: '10px', backgroundColor: '#f00', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Disconnect</button>
          </div>
        ) : (
          <BlackCreateWalletButton height={40} width={180} />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
