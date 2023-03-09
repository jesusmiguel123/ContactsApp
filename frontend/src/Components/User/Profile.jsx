import '../../Styles/User/Profile.css';
import { useEffect, useState } from 'react';

const Profile = ({ user }) => {
   const [data, setData] = useState({});
   const [photo, setPhoto] = useState();

   useEffect(() => {
      loadData(user);
      loadPhoto(user);
   }, [user]);

   const loadData = async (user) => {
      try {
         const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/profile/${user}`);
         if(!res.ok) {
            console.log(res);
         }
         const data = await res.json();
         setData(data.body);
      } catch (error) {
         console.log(error);
      }
   };

   const loadPhoto = async (user) => {
      try {
         const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/profile/photo/${user}`);
         if(!res.ok) {
            console.log(res);
         }
         const photo = await res.blob();
         const src = URL.createObjectURL(photo);
         setPhoto(src);
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <div className="profile">
         <h1>{user}</h1>
         <table>
            <tbody>
               <tr className="row1">
                  <td colSpan="4">
                     <img src={photo} alt={user}/>
                  </td>
               </tr>
               <tr>
                  <th scope="row" id="field-name-profile">Name</th>
                  <td>{data.name}</td>
                  <th scope="row" id="field-name-profile">Lastname</th>
                  <td>{data.lastname}</td>
               </tr>
               <tr className="row1">
                  <th scope="row" colSpan="2">Email</th>
                  <td colSpan="2">{data.email}</td>
               </tr>
            </tbody>
         </table>
      </div>
   );  
}

export default Profile;