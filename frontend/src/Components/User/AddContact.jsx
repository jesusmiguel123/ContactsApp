import '../../Styles/User/AddContact.css';
import { useEffect, useState } from 'react';

const AddContact = () => {
   const [searchContact, setSearchContact] = useState("");
   const [searchShow, setSearchShow] = useState(false);
   const [listShow, setListShow] = useState(false);
   const [data, setData] = useState([]);

   useEffect(() => {
      loadData();
   }, []);

   const loadData = async () => {
      try {
         const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/profiles`);
         if(!res.ok) {
            console.log(res);
         }
         const data = await res.json();
         setData(data["usernames"]);
      } catch (error) {
         console.log(error);
      }
   };

   const filteredContacts = data.filter(
      contact => contact
                  .username
                  .toLowerCase()
                  .includes(searchContact.toLowerCase())
   );

   const handleChange = e => {
      const { value } = e.target;

      setSearchContact(value);

      if(value === ""){
         setSearchShow(false);
      } else {
         setSearchShow(true);
      }
   };

   const SelectContacts = filteredContacts.map(contact => (
      <li
         onClick={() => setSearchContact(contact.username)}
         key={contact.username}>
         {contact.username}
      </li>
   ));

   const searchIcon = <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-search icon" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>

   const ListContacts = filteredContacts.map(contact => (
      <li
         onClick={() => setSearchContact(contact.username)}
         key={contact.username}>
         <div>{contact.username}</div>
         <button>Add</button>
      </li>
   ));

   const handleSubmit = async e => {
      e.preventDefault();
      
      setSearchShow(false);
      setListShow(true);
   };

   return (
      <div className="search-contact">
         <form onSubmit={handleSubmit}>
            <label>
               <input
                  type="text"
                  placeholder='Search contact'
                  name='contact'
                  value={searchContact}
                  onChange={handleChange}
                  required />
               <button type="submit">{searchIcon}</button>
            </label>
         </form>
         {searchShow
            && <div className="select-contacts">
                  <ul>{SelectContacts}</ul>
               </div>}
         {listShow
            && <div className="list-contacts">
                  <ul>{ListContacts}</ul>
               </div>}
      </div>
   );
};

export default AddContact;