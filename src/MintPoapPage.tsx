// src/MintPoapPage.tsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAccount, useSignMessage } from 'wagmi';
import axios from 'axios';

const MintPoapPage = () => {
  const { eventId, poapContractAddress, poapId, nonce } = useParams();
  const { address } = useAccount();
  const [status, setStatus] = useState('');
  const { signMessageAsync } = useSignMessage();

  const mintPoap = async () => {
    try {
      if (!address) {
        setStatus('Please connect your wallet.');
        return;
      }

      setStatus('Minting POAP...');

      const signature = await signMessageAsync({
        message: `Minting POAP with nonce: ${nonce}`,
      });

      await axios.post('http://localhost:5000/poap/mint-poap', {
        eventId,
        poapContractAddress,
        poapId,
        nonce,
        userAddress: address,
        signature,
      });

      setStatus('POAP minted successfully!');
    } catch (error) {
      console.error('Error minting POAP:', error);
      setStatus(`Error minting POAP. ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Mint POAP</h2>
      <p>Event ID: {eventId}</p>
      <p>POAP Contract Address: {poapContractAddress}</p>
      <p>POAP ID: {poapId}</p>
      <button onClick={mintPoap} style={styles.button}>Mint POAP</button>
      {status && <p style={styles.status}>{status}</p>}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#f8f8f8',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  status: {
    marginTop: '20px',
    color: '#ff0000',
  },
};

export default MintPoapPage;
