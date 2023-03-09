import '../../Styles/User/Contact.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Contact = () => {
   const { username } = useParams();

   const [data, setData] = useState({});
   const [photo, setPhoto] = useState();

   useEffect(() => {
      loadData(username);
      loadPhoto(username);
   }, [username]);

   const loadData = async (username) => {
      try {
         const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/profile/${username}`);
         if(!res.ok) {
            console.log(res);
         }
         const data = await res.json();
         setData(data.body);
      } catch (error) {
         console.log(error);
      }
   };

   const loadPhoto = async (username) => {
      try {
         const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/profile/photo/${username}`);
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
      <div className="contact">
         <div className="image"><img src={photo} alt={username}/></div>
         <div className="data">
            <div>
               <p><div>Name:</div> {data.name}</p>
               <p><div>Lastname:</div> {data.lastname}</p>
            </div>
            <p><div>Email:</div> {data.email}</p>
         </div>
      </div>
   );
};

export default Contact;