import '../../Styles/User/Contacts.css';
//import { useEffect, useState } from 'react';

const Contacts = ({ user }) => {
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
               <tr>
                  <td>Asd</td>
                  <td className="email">Asd@asd.asd</td>
               </tr>
               <tr>
                  <td>Asdfg</td>
                  <td className="email">Asdfg@asdfg.asdfg</td>
               </tr>
            </tbody>
         </table>
         <button className="add-contact">Add new contact</button>
      </div>
   );
}

export default Contacts;