// src/Layout.tsx
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  isAdmin: boolean;
}

const Layout = ({ children, isAdmin }: LayoutProps) => {
  return (
    <div>
      <Navbar isAdmin={isAdmin} />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
