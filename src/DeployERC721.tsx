import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'; //new
import { useChainId, useWaitForTransactionReceipt, useWatchContractEvent } from 'wagmi';
import ChooseNetwork from './ChooseNetwork'; 
import { writeContract } from '@wagmi/core';
import { abi } from './contractDeployer/abi';
import { config } from './wagmi.ts';

const explorers = {
  1: 'https://etherscan.io/tx/', 
  11155111: 'https://sepolia.etherscan.io/tx/', 
  84531: 'https://sepolia.basescan.org/tx/', 
};

const DeployERC721 = () => {
  const [bytecode, setBytecode] = useState('');
  const [status, setStatus] = useState('');
  const [hash, setHash] = useState('');
  const [eventId, setEventId] = useState(null); //new

  const location = useLocation();//new
  const chainId = useChainId();

  useEffect(() => {
    if (location.state && location.state.eventId) {
      setEventId(location.state.eventId);
    }
  }, [location.state]);
  
  useWatchContractEvent ({
    address: '0x1ecf27dfcd407597629b8d8c35f3c8c53b0f7421',
    abi,
    eventName: 'ContractDeployed',
    onLogs(logs) {
      console.log('New logs!', logs)
      console.log(`/nContractAddress: ${"0x" + logs.data.slice(-40)}`)
    },
    poll: true,
    pollingInterval: 1_000,
  })


  const handleDeploy = async (e) => {
    e.preventDefault();

    try {
      
      const result = await writeContract(config, {
        abi,
        address: '0x1ecf27dfcd407597629b8d8c35f3c8c53b0f7421', // Replace with your contract address
        functionName: 'deploy', // Replace with your actual function name if different
        args: [bytecode],
      });
      setHash(result.hash);
      setStatus('Transaction sent!');
      console.log(`Result: ${result}`)
    } catch (error) {
      console.error('Failed to call contract function', error);
      setStatus('Failed to call contract function');
    }
  };
  
  const { isLoading: isLoad, isPending: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: hash || undefined,
  });

  return (
    <div style={styles.container}>
      <h1>Deploy ERC-721 Contract</h1>
      <ChooseNetwork setStatus={setStatus} />
      {status && <p style={styles.status}>{status}</p>}
      <form onSubmit={handleDeploy} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Bytecode:</label>
          <input  
            type="text"
            value={bytecode}
            onChange={(e) => setBytecode(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" disabled={isLoad || status === 'Transaction sent!'} style={styles.button}>
          {isLoad ? 'Confirming...' : status === 'Transaction sent!' ? 'Deploying...' : 'Deploy'}
        </button>
        {hash && (
          <div style={styles.result}>
            Transaction sent! Hash: <a href={`${explorers[chainId]}${hash}`} target="_blank" rel="noopener noreferrer">{hash}</a>
          </div>
        )}
        {isConfirmed && (
          <div style={styles.result}>
            Transaction confirmed! <a href={`${explorers[chainId]}${hash}`} target="_blank" rel="noopener noreferrer">View on Explorer</a>
          </div>
        )}
        {isConfirming && <div style={styles.result}>Waiting for confirmation...</div>}
      </form>
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
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '5px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
    fontFamily: 'Arial, sans-serif',
    marginTop: '10px',
  },
  result: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '5px',
  },
  status: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '5px',
  },
  error: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '5px',
  },
};

export default DeployERC721;
