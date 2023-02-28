import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
   const auth = useContext(AuthContext);
   return auth;
}

export const AuthProvider = ({ children }) => {
   const [isAuth, setAuth] = useState(false);

   const login = async (username, password) => {
      console.log(username, password);
      const response = await sendData({
         username: username,
         password: password
      })
      if(response[1] === 200){
         setAuth(true);
      }
      return response;
   }

   const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
   const sendData = async data => {
      try {
         const res = await fetch(`${REACT_APP_API_URL}/api/v1/login`, {
            method: 'POST',
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
   }

   return (
      <AuthContext.Provider value={{ isAuth, login, logout }}>
         { children }
      </AuthContext.Provider>
   );
}