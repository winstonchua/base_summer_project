// src/DeployPoapPage.tsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { writeContract, waitForTransactionReceipt } from '@wagmi/core';
import { baseSepolia } from '@wagmi/core/chains';
import { useChainId } from 'wagmi';
import { abi } from './contractDeployer/abi';
import { config } from './wagmi.ts';

const explorers = {
    1: 'https://etherscan.io/',
    11155111: 'https://sepolia.etherscan.io/',
    84532: 'https://sepolia.basescan.org/',
  };

const DeployPoapPage = () => {
  const { eventId } = useParams();
  const [status, setStatus] = useState('');
  const [poapName, setPoapName] = useState('');
  const [poapSymbol, setPoapSymbol] = useState('');
  const [maxSupply, setMaxSupply] = useState('');
  const [image, setImage] = useState(null);
  const [tokenURI, setTokenURI] = useState('');
  const [contractCode, setContractCode] = useState('');
  const [bytecode, setBytecode] = useState('');
  const [hash, setHash] = useState('');
  const chainId = useChainId();

  const handleCompile = async (e) => {
    e.preventDefault();

    if (!tokenURI) {
      setStatus('Please upload an image to create the token URI');
      return;
    }
    
    const contractTemplate = `
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.20;

    import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
    import "@openzeppelin/contracts/access/Ownable.sol";

    contract ${poapName} is ERC721URIStorage, Ownable {
        uint256 public maxSupply = ${maxSupply};
        uint256 public totalSupply = 0;
        string private baseTokenURI = "${tokenURI}";

        constructor() ERC721("${poapName}", "${poapSymbol}") Ownable(0x000000D3aC45A5Dcf16048cb74E3D530B2894a2c) {}

        function mint(address to) external onlyOwner {
            require(totalSupply < maxSupply, "Max supply reached");
            uint256 tokenId = totalSupply + 1; // Start tokenId from 1
            _safeMint(to, tokenId);
            _setTokenURI(tokenId, baseTokenURI);
            totalSupply++;
        }
    }`;

    setContractCode(contractTemplate);

    // Call the backend to compile the contract and get the bytecode
    try {
      const response = await axios.post('http://localhost:5000/compile/compile', { contractTemplate, poapName });
      setBytecode(response.data.bytecode);
      setStatus('Contract compiled successfully');
    } catch (error) {
      console.error('Failed to compile contract', error);
      setStatus('Failed to compile contract');
    }
  };

  const handleDeploy = async (e) => {
    e.preventDefault();

    try {
      const result = await writeContract(config, {
        abi: abi,
        address: '0x1ecf27dfcd407597629b8d8c35f3c8c53b0f7421',
        functionName: 'deploy',
        args: [bytecode],
      });
      setHash(result);
      setStatus('Transaction sent!');
      console.log(result);
      try {
        let txnReceipt = await waitForTransactionReceipt(config, {
          chainId: baseSepolia.id,
          hash: result,
          pollingInterval: 1_000,
        });
        // Filter for the correct contract address
        const contractAddress = txnReceipt.logs
        .filter(log => log.topics[0] === '0x33c981baba081f8fd2c52ac6ad1ea95b6814b4376640f55689051f6584729688')
        .map(log => `0x${log.data.slice(26, 66)}`)[0];

        console.log(`Contract Address: ${contractAddress}`)
        setStatus('Contract deployed successfully!');
        updateContractAddress(eventId, contractAddress);
      } catch (error) {
        console.error('Error fetching transaction receipt:', error);
      }
    } catch (error) {
      console.error('Failed to deploy contract', error);
      setStatus('Failed to deploy contract');
    }
  };

  const updateContractAddress = async (eventId, contractAddress) => {
    try {
      const response = await axios.put(`http://localhost:5000/events/${eventId}/contract`, { contractAddress });
      console.log('Event updated with contract address:', response.data);
    } catch (error) {
      console.error('Error updating event with contract address:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setImage(file);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:5000/upload/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setTokenURI(response.data.tokenURI);
      setStatus('Image uploaded successfully');
    } catch (error) {
      console.error('Failed to upload image', error);
      setStatus('Failed to upload image');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Deploy POAP</h2>
      <form onSubmit={handleCompile} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>POAP Name:</label>
          <input
            type="text"
            value={poapName}
            onChange={(e) => setPoapName(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>POAP Symbol:</label>
          <input
            type="text"
            value={poapSymbol}
            onChange={(e) => setPoapSymbol(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Max Supply:</label>
          <input
            type="number"
            value={maxSupply}
            onChange={(e) => setMaxSupply(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Upload Image:</label>
          <input type="file" onChange={handleImageUpload} style={styles.input} />
        </div>
        <button type="submit" style={{ ...styles.button, ...styles.actionButton }}>
          Compile
        </button>
      </form>
      {contractCode && (
        <div style={styles.result}>
          <h3>Contract Code:</h3>
          <pre style={styles.pre}>{contractCode}</pre>
        </div>
      )}
      {bytecode && (
        <>
          <div style={styles.result}>
            <h3>Bytecode:</h3>
            <pre style={styles.pre}>{bytecode}</pre>
          </div>
          <button onClick={handleDeploy} style={{ ...styles.button, ...styles.actionButton, marginTop: '20px' }}>
            Deploy
          </button>
        </>
      )}
      {hash && (
        <div style={styles.result}>
          Transaction sent! Hash: <a href={`${explorers[chainId]}tx/${hash}`} target="_blank" rel="noopener noreferrer">{hash}</a>
        </div>
      )}
      {status && <p style={styles.status}>{status}</p>}
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
    fontFamily: 'Arial, sans-serif',
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
    backgroundColor: 'transparent',
    color: '#007bff',
    cursor: 'pointer',
    fontFamily: 'Arial, sans-serif',
    transition: 'background-color 0.3s, color 0.3s',
  },
  actionButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: '5px',
    border: 'none',
  },
  result: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '5px',
    wordWrap: 'break-word',
  },
  pre: {
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  },
  status: {
    marginTop: '10px',
    color: '#ff0000',
    textAlign: 'center',
  },
};

export default DeployPoapPage;
