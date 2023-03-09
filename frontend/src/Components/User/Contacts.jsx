import '../../Styles/User/Contacts.css';
import { useEffect, useState } from 'react';

import Modal from './Modal';
import AddContact from './AddContact';

const Contacts = ({ user }) => {
   const [contacts, setContacts] = useState([
      {
         name: "---", email: "---"
      }
   ]);

   useEffect(() => {
      loadContacts(user);
   }, [user]);

   const loadContacts = async (user) => {
      try {
         const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/get-contacts/${user}`);
         if(!res.ok) {
            if(res.status === 400) {
               const response = await res.json();
               console.log(response.body);
            }
            throw new Error(res.statusText);
         }
         const contacts = await res.json();
         setContacts(contacts["contacts"]);
      } catch (error) {
         console.log(error);
      }
   };

   const [showModalAddUser, setShowModalAddUser] = useState(false);
   const addContact = () => {
      setShowModalAddUser(true);
    };
   const closeModal = () => {
      setShowModalAddUser(false);
   };

   return (
      <div className="contacts">
         <h1>Contacts of {user}</h1>
         <table>
            <thead>
               <tr>
                  <th id="left">Name</th>
                  <th id="center">Email</th>
               </tr>
            </thead>
            <tbody>
               {contacts.map(contact => (
                  <tr key={contact.name+contact.email}>
                     <td>{contact.name}</td>
                     <td className="email">{contact.email}</td>
                  </tr>
               ))}
            </tbody>
         </table>
         <button className="add-contact" onClick={addContact}>Add new contact</button>
         {showModalAddUser
           && <Modal closeModal={closeModal} title="Add new contact"><AddContact user={user} /></Modal>}
      </div>
   );
}

export default Contacts;