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
         const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/contacts/${user}`);
         if(!res.ok) {
            console.log(res);
         }
         const contacts = await res.json();
         setContacts(contacts.body);
      } catch (error) {
         console.log(error);
      }
   };

   const [showModal, setShowModal] = useState(false);
   const addContact = () => {
      setShowModal(true);
    };
   const closeModal = () => {
      setShowModal(false);
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
                  <tr>
                     <td>{contact.name}</td>
                     <td className="email">{contact.email}</td>
                  </tr>
               ))}
            </tbody>
         </table>
         <button className="add-contact" onClick={addContact}>Add new contact</button>
         {showModal
           && <Modal closeModal={closeModal} title="Add new contact"><AddContact /></Modal>}
      </div>
   );
}

export default Contacts;