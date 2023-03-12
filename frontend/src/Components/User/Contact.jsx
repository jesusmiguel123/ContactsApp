import '../../Styles/User/Contact.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Contact = ({ user }) => {
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

   const errorIcon = <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-x-circle icon" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>;
   const successIcon = <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-check-circle icon" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/></svg>;

   const [message, setMessage] = useState(true);
   const [messageRender, setMessageRender] = useState();

   const deleteContact  = async () => {
      try {
         const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/delete-contact/${user}/${username}`);
         if(res.status !== 200) {
            if(res.status === 400) {
               const response = await res.json();
               setMessageRender(<div className='error'>{errorIcon} {response.body}</div>);
               setMessage(true);
            }
            throw new Error(res.statusText);
         }
         const response = await res.json();
         setMessageRender(<div className='success'>{successIcon} {response.body}</div>);
         setMessage(true);
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <div className="contact">
         <div className="image"><img src={photo} alt={username}/></div>
         <div className="data">
            {message && messageRender}
            <div>
               <div><p>Name:</p> {data.name}</div>
               <div><p>Lastname:</p> {data.lastname}</div>
            </div>
            <div><p>Email:</p> {data.email}</div>
            <button className="delete-contact" onClick={deleteContact}>Delete</button>
         </div>
      </div>
   );
};

export default Contact;