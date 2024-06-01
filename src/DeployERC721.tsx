// src/DeployERC721.tsx
import React, { useState } from 'react';
import { ethers } from 'ethers';

const DeployERC721 = () => {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [baseURI, setBaseURI] = useState('');

  const handleDeploy = async (e) => {
    e.preventDefault();

    if (!window.ethereum) {
      alert('Please install MetaMask to use this feature');
      return;
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const owner = signer.address;
/*
      const factory =  new ethers.ContractFactory(abi, bytecode, signer);

      const contract = await factory.deploy(name, symbol, baseURI, owner);
      await contract.deployed();

      alert(`Contract deployed at address: ${contract.address}`);*/
    } catch (error) {
      console.error(error);
      alert('Failed to deploy contract');
    }
  };

  return (
    <div>
      <h1>Deploy ERC-721 Contract</h1>
      <form onSubmit={handleDeploy}>
        <div>
          <label>Name: </label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Symbol: </label>
          <input value={symbol} onChange={(e) => setSymbol(e.target.value)} />
        </div>
        <div>
          <label>Base URI: </label>
          <input value={baseURI} onChange={(e) => setBaseURI(e.target.value)} />
        </div>
        <button type="submit">Deploy</button>
      </form>
    </div>
  );
};

// ABI and Bytecode from the compiled contract
const abi = [
  // Add the ABI from the compiled contract here
];

const bytecode = '0x...'; // Add the bytecode from the compiled contract here

export default DeployERC721;
