const useLocalStorage = name => {
   const getLocalStorage = () => {
      const local = localStorage.getItem(name);
      if(local != null){
         return JSON.parse(local);
      }
      return null;
   };

   const setLocalStorage = value => localStorage.setItem(name, JSON.stringify(value));

   const removeLocalStorage = () => localStorage.removeItem(name);

   return [getLocalStorage, setLocalStorage, removeLocalStorage];
}

export default useLocalStorage;