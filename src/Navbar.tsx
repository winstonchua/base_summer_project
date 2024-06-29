// src/Navbar.tsx
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { BlackCreateWalletButton } from './BlackCreateWalletButton';
import logo from './pictures/plague.png';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface NavbarProps {
  isAdmin: boolean;
}

const Navbar = ({ isAdmin }: NavbarProps) => {
  const { isConnected } = useAccount();

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', height: '60px', backgroundColor: '#fff', color: '#000' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={logo} alt="Logo" style={{ height: '40px' }} />
        <span style={{ marginLeft: '10px', fontSize: '20px', fontWeight: 'bold' }}>Auggy</span>
      </div>
      <div style={{ display: 'flex', gap: '20px', marginLeft: '40px', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;', fontWeight: 'bold' }}>
        <Link to="/" style={{ color: '#000', textDecoration: 'none', fontSize: '16px' }}>Home</Link>
        <Link to="/profile" style={{ color: '#000', textDecoration: 'none', fontSize: '16px' }}>Profile</Link>
        <Link to="/yourevents" style={{ color: '#000', textDecoration: 'none', fontSize: '16px' }}>Your Events</Link>
        {isAdmin && <Link to="/admin" style={{ color: '#000', textDecoration: 'none', fontSize: '16px' }}>Admin</Link>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <ConnectButton />
        {!isConnected && <BlackCreateWalletButton height={40} width={180} />}
      </div>
    </nav>
  );
};

export default Navbar;
