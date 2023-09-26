import '../../Styles/User/AddContact.css';
import { useEffect, useState } from 'react';
import getCSRFToken from '../../utils/getCSRFToken';

const VITE_API_URL = import.meta.env.VITE_API_URL;

const AddContact = ({ user }) => {
   const [searchContact, setSearchContact] = useState("");
   const [searchShow, setSearchShow] = useState(false);
   const [listShow, setListShow] = useState(false);
   const [message, setMessage] = useState(false);
   const [messageRender, setMessageRender] = useState([]);
   const [existUsers, setExistUsers] = useState(true);
   const [data, setData] = useState([]);

   useEffect(() => {
      loadData();
      // eslint-disable-next-line
   }, []);

   const loadData = async () => {
      try {
         const res = await fetch(`${VITE_API_URL}/api/v1/profiles/${user}`);
         if(!res.ok) {
            const response = await res.json();
            setMessageRender(<div className='error'>{errorIcon} {response.body}</div>);
            setMessage(true);
            setExistUsers(false);
            return;
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

   const SelectContacts = ({ filteredContacts }) => filteredContacts.map(contact => (
      <li
         onClick={() => setSearchContact(contact.username)}
         key={contact.username}>
         {contact.username}
      </li>
   ));

   const searchIcon = <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-search icon" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>;
   const errorIcon = <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-x-circle icon" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>;
   const successIcon = <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-check-circle icon" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/></svg>;

   const clickAddButton = async username => {
      try {
         const CSRFToken = await getCSRFToken();
         const dataToSend = new FormData();
         dataToSend.append("contact", username);
         const res = await fetch(`${VITE_API_URL}/api/v1/add-contact/${user}`, {
            method: 'POST',
            headers: {
               'X-CSRFToken': CSRFToken
            },
            credentials: 'include',
            body: dataToSend
         });
         if(!res.ok) {
            const response = await res.json();
            setMessageRender(<div className='error'>{errorIcon} {response.body}</div>);
            setMessage(true);
            return;
         }
         const newData = [...data];
         newData.splice(
            newData.indexOf(
               newData.find(e => e.username === username)
            ), 1
         );
         setData(newData);
         const response = await res.json();
         setMessageRender(<div className='success'>{successIcon} {response.body}</div>);
         setMessage(true);
      } catch (error) {
         console.error(error);
      }
   };

   const ListContacts = ({ filteredContacts }) => filteredContacts.map(contact => (
      <li key={contact.username}>
         <div>{contact.username}</div>
         <button onClick={() => clickAddButton(contact.username)}>Add</button>
      </li>
   ));

   const handleSubmit = async e => {
      e.preventDefault();
      
      setSearchShow(false);
      setListShow(true);
   };

   return (
      <div className="search-contact">
         {existUsers
            && <form onSubmit={handleSubmit}>
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
               </form>}
         {message && messageRender}
         {searchShow
            && <div className="select-contacts">
                  <ul><SelectContacts filteredContacts={filteredContacts} /></ul>
               </div>}
         {listShow
            && <div className="list-contacts">
                  <ul><ListContacts filteredContacts={filteredContacts} /></ul>
               </div>}
      </div>
   );
};

export default AddContact;