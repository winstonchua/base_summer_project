import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { readContract } from '@wagmi/core';
import { abiPoap } from './contractDeployer/abiPoap';
import { config } from './wagmi.ts';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

interface EventDetailsPageProps {
  currentUserAddress: `0x${string}`;
  isAdmin: boolean;
  onDelete: (id: string) => void;
}

interface Event {
  _id: string;
  name: string;
  image: string;
  description: string;
  category: string;
  owner: string;
  eventId: string;
}

interface Poap {
  address: `0x${string}`;
  name?: string;
  maxSupply?: string;
  totalSupply?: string;
}

const EventDetailsPage = ({ currentUserAddress, isAdmin, onDelete }: EventDetailsPageProps) => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [status, setStatus] = useState<string>('');
  const [poapDetails, setPoapDetails] = useState<Poap[]>([]);
  const [selectedPoap, setSelectedPoap] = useState<Poap | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [poapDropdownOpen, setPoapDropdownOpen] = useState<boolean>(false);
  const [mintLink, setMintLink] = useState<string>('');
  const [isMintingEnded, setIsMintingEnded] = useState<boolean>(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const togglePoapDropdown = () => setPoapDropdownOpen(!poapDropdownOpen);

  useEffect(() => {
    axios.get(`${apiUrl}/events/${eventId}`)
      .then(response => {
        setEvent(response.data);
      })
      .catch(error => console.error('Error fetching event:', error));
  }, [eventId]);

  const viewPoapDetails = async () => {
    try {
      const response = await axios.get(`${apiUrl}/events/${eventId}/poaps`);
      const poaps = response.data;

      console.log('Fetched POAPs:', poaps);

      const updatedPoaps = await Promise.all(poaps.map(async (poap: Poap) => {
        if (!poap.address) {
          console.error(`Missing address for POAP: ${JSON.stringify(poap)}`);
          return poap;
        }

        try {
          const maxSupply = await readContract(config, {
            abi: abiPoap,
            address: poap.address,
            functionName: 'maxSupply',
          }) as bigint;

          const poapContractName = await readContract(config, {
            abi: abiPoap,
            address: poap.address,
            functionName: 'name',
          }) as string;

          const totalSupply = await readContract(config, {
            abi: abiPoap,
            address: poap.address,
            functionName: 'totalSupply',
          }) as bigint;

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

  const handleDelete = async () => {
    if (event) {
      try {
        await axios.delete(`${apiUrl}/events/${event._id}`);
        onDelete(event._id);
        navigate('/');
      } catch (error) {
        console.error('Error deleting event:', error);
        setStatus('Failed to delete event.');
      }
    }
  };

  const handleDeployPoap = () => {
    navigate(`/deploy-poap/${eventId}`);
  };

  const handlePoapSelect = (poap: Poap) => {
    setSelectedPoap(poap);
  };

  const generateMintLink = async (type: string) => {
    if (!selectedPoap) {
      alert('Please select a POAP first.');
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/poap/generate-mint-link`, {
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
        <h2 style={styles.title as React.CSSProperties}>{event.name}</h2>
        {(isOwner || isAdmin) && (
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle caret style={styles.dropdownToggle}>
              <div className="menu-bar menu-bar-top"></div>
              <div className="menu-bar menu-bar-middle"></div>
              <div className="menu-bar menu-bar-bottom"></div>
            </DropdownToggle>
            <DropdownMenu>
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
      {status && <p style={styles.status as React.CSSProperties}>{status}</p>}
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
                  {mintLink && <p style={styles.mintLink as React.CSSProperties}>Mint Link: <a href={mintLink}>{mintLink}</a></p>}
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
