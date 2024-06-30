// src/MintPoapPage.tsx
import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAccount, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';
import axios from 'axios';

const MintPoapPage = () => {
  const { eventId, poapContractAddress, poapId, nonce } = useParams();
  const { address } = useAccount();
  const [status, setStatus] = useState('');
  const { signMessageAsync } = useSignMessage();
  const apiUrl = import.meta.env.VITE_API_URL;

  const siweMessage = useMemo(() => {
    return new SiweMessage({
      domain: document.location.host,
      address,
      uri: document.location.origin,
      version: '1',
      statement: 'Minting POAP',
      nonce,
    });
  }, [address, nonce]);

  const mintPoap = async () => {
    try {
      if (!address) {
        setStatus('Please connect your wallet.');
        return;
      }

      setStatus('Minting POAP...');

      const signature = await signMessageAsync({
        message: siweMessage.prepareMessage(),
      });

      await axios.post(`${apiUrl}/poap/mint-poap`, {
        eventId,
        poapContractAddress,
        poapId,
        nonce,
        userAddress: address,
        signature,
      });

      setStatus('POAP minted successfully!');
    } catch (error: any) {
      console.error('Error minting POAP:', error);
      setStatus(`Error minting POAP. ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div style={styles.container as React.CSSProperties}>
      <h2>Mint POAP</h2>
      <p>Event ID: {eventId}</p>
      <p>POAP Contract Address: {poapContractAddress}</p>
      <p>POAP ID: {poapId}</p>
      <button onClick={mintPoap} style={styles.button as React.CSSProperties}>Mint POAP</button>
      {status && <p style={styles.status as React.CSSProperties}>{status}</p>}
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
    textAlign: 'center' as const,
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
