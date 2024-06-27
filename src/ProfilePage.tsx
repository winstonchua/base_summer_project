// src/ProfilePage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAccount } from 'wagmi';

const ProfilePage = () => {
  const { address } = useAccount();
  const [poaps, setPoaps] = useState([]);

  useEffect(() => {
    if (!address) return;

    const fetchPoaps = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/poap/user/${address}`);
        setPoaps(response.data);
        console.log(`huehue  ${JSON.stringify(response.data)}`)
      } catch (error) {
        console.error('Error fetching POAPs:', error);
      }
    };

    fetchPoaps();
  }, [address]);

  return (
    <div style={styles.container}>
      <h2>Your POAPs</h2>
      {poaps.length > 0 ? (
        <div style={styles.poapGrid}>
          {poaps.map((poap, index) => (
            <div key={index} style={styles.poapItem}>
              <img src={poap.tokenURI} alt={`POAP ${index + 1}`} style={styles.poapImage} />
              <p>{poap.eventName}</p>
              <p>Contract Address: {poap.tokenURI}</p>
              <p>POAP ID: {poap.poapId}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>You have not collected any POAPs yet.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#f8f8f8',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    textAlign: 'center',
  },
  poapGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  poapItem: {
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  poapImage: {
    width: '100%',
    borderRadius: '10px',
  },
};

export default ProfilePage;