import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
   const auth = useContext(AuthContext);
   return auth;
}

export const AuthProvider = ({ children }) => {
   const [isAuth, setAuth] = useState(false);

   const login = () => {
      setAuth(true);
   }

   const logout = () => {
      setAuth(false);
   }

   return (
      <AuthContext.Provider value={{ isAuth, login, logout }}>
         { children }
      </AuthContext.Provider>
   );
}