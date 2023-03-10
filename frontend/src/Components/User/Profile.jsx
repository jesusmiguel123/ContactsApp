import '../../Styles/User/Profile.css';
import { useEffect, useState } from 'react';

import Modal from './Modal';
import EditProfile from './EditProfile';

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

   const editIcon = <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-pencil edit" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>;

   const [showModalEditProfile, setShowModalEditProfile] = useState(false);
   const editProfile = () => {
      setShowModalEditProfile(true);
    };
   const closeModalEditProfile = () => {
      setShowModalEditProfile(false);
   };

   return (
      <div className="profile">
         <h1>{user}</h1>
         <div className="data">
            <div className="data-image">
               <img src={photo} alt={user}/>
            </div>
            <div className="data-fields">
               <div className="name-lastname">
                  <div><p>Name:</p> {data.name}</div>
                  <div><p>Lastname:</p> {data.lastname}</div>
               </div>
               <div className="email">
                  <div><p>Email:</p> {data.email}</div>
               </div>
            </div>
         </div>
         <button onClick={editProfile}>Edit {editIcon}</button>
         {showModalEditProfile
            && <Modal closeModal={closeModalEditProfile} title="Edit profile">
                  <EditProfile user={user} />
               </Modal>}
      </div>
   );  
}

export default Profile;