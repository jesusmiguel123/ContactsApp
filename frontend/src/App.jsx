import './App.css';

//import { Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Register';

import Profile from './Components/User/Profile';
import Contacts from './Components/User/Contacts';
import Contact from './Components/User/Contact';

import { useAuth } from './utils/useAuth';
import useLocalStorage from './utils/useLocalStorage';
import getCSRFToken from './utils/getCSRFToken';

const App = () => {
  const [getUser, , ] = useLocalStorage("user");

  const [user, setUser] = useState(getUser() || null);
  
  useEffect(() => {
    const get_token = async () => {
      await getCSRFToken();
    }
    get_token();
  }, []);

  /*
  const ProtectedRoute = ({ children }) => {
    const { isAuth } = useAuth();
    if(!isAuth){
      return <Navigate to="/login" />
    }
    return children;
  };
  */

  const navigate = useNavigate();
  const { logout } = useAuth();
  const logouthandler = () => {
    logout();
    setUser(null);
    navigate('/login');
  };
  
  return (
    <>
      <header>
        <h1><Link to="/">Reservation Web</Link></h1>
        <nav>
          <ul>
              { user ?
                <><li><Link to={"/user"}>Home</Link></li>
                  <li><Link to={"/user/my-contacts"}>My Contacts</Link></li>
                  <li onClick={logouthandler} className="logout">Logout</li></>
              :
                <><li><Link to="/">Home</Link></li>
                  <li><Link to="/login">Login</Link></li>
                  <li><Link to="/register">Register</Link></li></>
              }
          </ul>
        </nav>
      </header>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/user" element={<Profile user={user} />} />
          <Route path="/user/my-contacts" element={<Contacts user={user} />}>
            <Route path="contact/:username" element={<Contact />} />
          </Route>
      </Routes>
    </>
  );
}

export default App;