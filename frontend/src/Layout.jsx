// Layout.jsx
import Navbar from './components/Navbar';
import { Outlet } from 'react-router-dom';

const Layout = ({ currUser, setCurrUser }) => {
  return (
    <>
      <Navbar currUser={currUser} setCurrUser={setCurrUser} />
      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
