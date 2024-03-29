import { createContext, useContext, useState } from 'react';
import useLocalStorage from './useLocalStorage';
import getCSRFToken from './getCSRFToken';

const VITE_API_URL = import.meta.env.VITE_API_URL;
const AuthContext = createContext();

export const useAuth = () => {
   const auth = useContext(AuthContext);
   return auth;
}

export const AuthProvider = ({ children }) => {
   const [getUser, setUser, removeUser] = useLocalStorage("user");
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

   const sendData = async data => {
      try {
         const CSRFToken = await getCSRFToken();
         const res = await fetch(`${VITE_API_URL}/api/v1/login`, {
            method: 'POST',
            headers: {
               'X-CSRFToken': CSRFToken
            },
            credentials: 'include',
            body: JSON.stringify(data)
         });
         if(!res.ok) {
            const response = await res.json();
            return [response.body, 400];
         }
         const response = await res.json();
         return [response.body, 200];
      } catch (error) {
         console.error(error);
      }
   };

   const logout = async () => {
      await logout_user();
      setAuth(false);
      removeUser();
   }

   const logout_user  = async () => {
      try {
         const res = await fetch(`${VITE_API_URL}/api/v1/logout/${getUser()}`);
         if(!res.ok) {
            console.log(res);
            return;
         }
         const data = await res.json();
         console.log(data.body);
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <AuthContext.Provider value={{ isAuth, login, logout }}>
         { children }
      </AuthContext.Provider>
   );
}