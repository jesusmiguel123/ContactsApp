import './App.css';

//import { Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';

import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Register';

import Profile from './Components/User/Profile';

import { useAuth } from './utils/useAuth';
import { useState } from 'react';

const App = () => {
  const [user, setUser] = useState(null);

  const { isAuth } = useAuth();
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
              { isAuth ?
                <><li><Link to={`/${user}`}>Home</Link></li>
                  <li><Link to={`/${user}/my-groups`}>My Groups</Link></li>
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
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login setUser={setUser} />} />
        <Route path={`/${user}`} element={<Profile user={user} />}>
          <Route path='my-groups' element={<><div>My groups</div></>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;