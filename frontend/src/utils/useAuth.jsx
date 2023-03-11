import { createContext, useContext, useState } from 'react';
import useLocalStorage from './useLocalStorage';
import getCSRFToken from './getCSRFToken';

const AuthContext = createContext();

export const useAuth = () => {
   const auth = useContext(AuthContext);
   return auth;
}

export const AuthProvider = ({ children }) => {
   const [, setUser, removeUser] = useLocalStorage("user");
   const [isAuth, setAuth] = useState(false);

   const login = async (username, password) => {
      const response = await sendData({
         username: username,
         password: password
      })
      if(response[1] === 200){
         setAuth(true);
         setUser(username);
      }
      return response;
   }

   const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
   const sendData = async data => {
      try {
         const CSRFToken = await getCSRFToken();
         const res = await fetch(`${REACT_APP_API_URL}/api/v1/login`, {
            method: 'POST',
            headers: {
               'X-CSRFToken': CSRFToken
            },
            credentials: 'include',
            body: JSON.stringify(data)
         });
         if(res.status !== 200) {
            if(res.status === 400) {
               const response = await res.json();
               return [response.body, 400];
            }
            throw new Error(res.statusText);
         }
         const response = await res.json();
         return [response.body, 200];
      } catch (error) {
         console.error(error);
      }
   };

   const logout = () => {
      setAuth(false);
      removeUser();
   }

   return (
      <AuthContext.Provider value={{ isAuth, login, logout }}>
         { children }
      </AuthContext.Provider>
   );
}