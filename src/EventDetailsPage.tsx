import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { readContract } from '@wagmi/core';
import { useChainId } from 'wagmi';
import { abiPoap } from './contractDeployer/abiPoap';
import { config } from './wagmi.ts';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const explorers = {
  1: 'https://etherscan.io/',
  11155111: 'https://sepolia.etherscan.io/',
  84532: 'https://sepolia.basescan.org/',
};

const EventDetailsPage = ({ currentUserAddress, isAdmin, onDelete }) => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [status, setStatus] = useState('');
  const [poapDetails, setPoapDetails] = useState([]);
  const [selectedPoap, setSelectedPoap] = useState(null); 
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [poapDropdownOpen, setPoapDropdownOpen] = useState(false);
  const [mintLink, setMintLink] = useState(''); 
  const [linkTypeDropdownOpen, setLinkTypeDropdownOpen] = useState(false);
  const [isMintingEnded, setIsMintingEnded] = useState(false); // State for minting end status
  const navigate = useNavigate();
  const chainId = useChainId();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const togglePoapDropdown = () => setPoapDropdownOpen(!poapDropdownOpen);
  const toggleLinkTypeDropdown = () => setLinkTypeDropdownOpen(!linkTypeDropdownOpen);

  useEffect(() => {
    axios.get(`http://localhost:5000/events/${eventId}`)
      .then(response => {
        setEvent(response.data);
      })
      .catch(error => console.error('Error fetching event:', error));
  }, [eventId]);

  const viewPoapDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/events/${eventId}/poaps`);
      const poaps = response.data;

      console.log('Fetched POAPs:', poaps);

      const updatedPoaps = await Promise.all(poaps.map(async poap => {
        if (!poap.address) {
          console.error(`Missing address for POAP: ${JSON.stringify(poap)}`);
          return poap;
        }

        try {
          console.log(`Fetching details for POAP contract: ${poap.address}`);
          const maxSupply = await readContract(config, {
            abi: abiPoap,
            address: poap.address,
            functionName: 'maxSupply',
          });
          console.log(`maxSupply for ${poap.address}: ${maxSupply}`);

          const poapContractName = await readContract(config, {
            abi: abiPoap,
            address: poap.address,
            functionName: 'name',
          });
          console.log(`Name for ${poap.address}: ${poapContractName}`);

          const totalSupply = await readContract(config, {
            abi: abiPoap,
            address: poap.address,
            functionName: 'totalSupply',
          });
          console.log(`totalSupply for ${poap.address}: ${totalSupply}`);

          return {
            ...poap,
            name: poapContractName,
            maxSupply: maxSupply.toString(),
            totalSupply: totalSupply.toString(),
          };
        } catch (error) {
          console.error(`Error fetching details for POAP contract ${poap.address}:`, error);
          return poap;
        }
      }));
      setPoapDetails(updatedPoaps);
    } catch (error) {
      console.error('Error fetching POAP details:', error);
    }
  };

  const handleDelete = () => {
    onDelete(event._id);
    navigate('/');
  };

  const handleDeployPoap = () => {
    navigate(`/deploy-poap/${eventId}`);
  };

  const handlePoapSelect = (poap) => {
    setSelectedPoap(poap);
  };

  const generateMintLink = async (type) => {
    if (!selectedPoap) {
      alert('Please select a POAP first.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/poap/generate-mint-link', {
        poapContractAddress: selectedPoap.address,
        eventId: eventId,
        poapId: poapDetails.indexOf(selectedPoap) + 1,
        type: type,
      });
      setMintLink(response.data.link);
    } catch (error) {
      console.error('Error generating mint link:', error);
    }
  };

  const endMinting = async () => {
    try {
      setIsMintingEnded(true);
      setStatus('Minting has been ended.');
    } catch (error) {
      console.error('Error ending minting:', error);
    }
  };

  if (!event) return <div>Loading...</div>;

  const isOwner = event.owner === currentUserAddress;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>{event.name}</h2>
        {(isOwner || isAdmin) && (
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle caret style={styles.dropdownToggle}>
              <div className="menu-bar menu-bar-top"></div>
              <div className="menu-bar menu-bar-middle"></div>
              <div className="menu-bar menu-bar-bottom"></div>
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => setStatus('Editing...')}>Edit</DropdownItem>
              <DropdownItem onClick={handleDelete}>Delete</DropdownItem>
              <DropdownItem onClick={handleDeployPoap}>Deploy POAP</DropdownItem>
              <DropdownItem onClick={viewPoapDetails}>View POAP</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </div>
      <div style={styles.content}>
        <img src={event.image} alt={event.name} style={styles.image} />
        <div style={styles.details}>
          <p style={styles.label}>Description:</p>
          <p style={styles.description}>{event.description}</p>
        </div>
      </div>
      <p style={styles.category}>Category: {event.category}</p>
      <p style={styles.owner}>Owner: {event.owner}</p>
      {status && <p style={styles.status}>{status}</p>}
      {poapDetails.length > 0 && (
        <div style={styles.poapDetails}>
          <h3>POAP Details</h3>
          <Dropdown isOpen={poapDropdownOpen} toggle={togglePoapDropdown}>
            <DropdownToggle caret style={styles.poapDropdownToggle}>
              {selectedPoap ? `POAP ${poapDetails.indexOf(selectedPoap) + 1}` : 'Select POAP'}
            </DropdownToggle>
            <DropdownMenu>
              {poapDetails.map((poap, index) => (
                <DropdownItem key={index} onClick={() => handlePoapSelect(poap)}>
                  POAP {index + 1}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          {selectedPoap && (
            <div style={styles.poapDetail}>
              <p>Contract Address: {selectedPoap.address}</p>
              {selectedPoap.name ? <p>Name: {selectedPoap.name}</p> : <p>Error fetching name</p>}
              {selectedPoap.maxSupply && selectedPoap.totalSupply ? (
                <>
                  <p>Total POAPs Minted: {selectedPoap.totalSupply} / {selectedPoap.maxSupply}</p>
                  {mintLink && <p style={styles.mintLink}>Mint Link: <a href={mintLink}>{mintLink}</a></p>}
                  <p>Mint Status: {selectedPoap.totalSupply === selectedPoap.maxSupply ? 'Fully Minted' : isMintingEnded ? 'Mint Ended' : 'Active'}</p>
                  {!isMintingEnded && (
                    <>
                      <button style={styles.button} onClick={() => generateMintLink('single-use')}>
                        Generate Single-Use Mint Link
                      </button>
                      <button style={styles.button} onClick={() => generateMintLink('general')}>
                        Generate General Mint Link
                      </button>
                      <button style={styles.button} onClick={endMinting}>
                        End Mint
                      </button>
                    </>
                  )}
                </>
              ) : (
                <p>Error fetching supply details</p>
              )}
            </div>
          )}
        </div>
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
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  dropdownToggle: {
    backgroundColor: 'transparent',
    color: '#000',
    border: 'solid',
  },
  menuBar: {
    width: '25px',
    height: '3px',
    backgroundColor: '#333',
    margin: '4px 0',
  },
  content: {
    display: 'flex',
    gap: '20px',
    marginTop: '20px',
  },
  image: {
    width: '300px',
    height: 'auto',
    borderRadius: '8px',
  },
  details: {
    flex: 1,
  },
  label: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  description: {
    fontSize: '16px',
    marginBottom: '10px',
  },
  category: {
    fontSize: '14px',
    color: '#555',
    marginTop: '10px',
  },
  owner: {
    fontSize: '14px',
    color: '#555',
    marginTop: '5px',
  },
  status: {
    marginTop: '10px',
    color: '#ff0000',
    textAlign: 'center',
  },
  poapDetails: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: '5px',
  },
  poapDetail: {
    marginTop: '10px',
  },
  button: {
    backgroundColor: '#fff',
    color: '#000',
    border: 'groove ',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  poapDropdownToggle: {
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: '5px',
    border: 'groove ',
    marginTop: '10px',
  },
  mintLink: {
    marginTop: '10px',
    wordWrap: 'break-word',
  }
};

export default EventDetailsPage;
