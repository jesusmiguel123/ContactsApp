import '../../Styles/User/EditProfile.css';
import { useState } from 'react';
import getCSRFToken from '../../utils/getCSRFToken';

const EditProfile = ({ user, name, lastname, email, photo }) => {
   const photoBlob = URL.getFromObjectURL(photo);
   const ext = photoBlob.type.split("/", 2)[1];
   const newFileName = `${user}_profile_photo.${ext}`;
   const newFile = new File([photoBlob], newFileName, {type: photoBlob.type});

   const [data, setData] = useState({
      name: name,
      lastname: lastname,
      username: user,
      oldPassword: '',
      newPassword: '',
      email: email,
      file: newFile
   });

   const handleChange = e => {
      const { name, value } = e.target;

      setData(prev => ({
         ...prev,
         [name]: value
      }));
   };

   const handleFileChange = e => {
      if(e.target.files){
         const file = e.target.files[0];
         const ext = file.name.split(".", 2)[1];
         const newFileName = `${user}_profile_photo.${ext}`;
         const newFile = new File([file], newFileName, {type: file.type});

         setData(prev => ({
            ...prev,
            file: newFile
         }));
      }
   };

   const errorIcon = <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-x-circle icon" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>;
   const successIcon = <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-check-circle icon" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/></svg>;
   const infoIcon = <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-info-circle icon" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>;

   const [message, setMessage] = useState(true);
   const [messageRender, setMessageRender] = useState(
      <div className="info">{infoIcon} If you don't put any image your photo won't change</div>
   );
   
   const handleSubmit = e => {
      e.preventDefault();

      const { name, lastname, username, oldPassword, newPassword, email, file } = data;

      const fileExt = file.name.split(".", 2)[1];

      if(!name.trim()
         || !lastname.trim()
         || !username.trim()
         || !oldPassword.trim()
         || !newPassword.trim()
         || !email.trim()
         || !file){
         setMessageRender(<div className='error'>{errorIcon} Void fields</div>);
         setMessage(true);
         return;
      } else if(!/^[a-zA-Z]+(\s+[a-zA-Z]+){0,5}$/.test(name.trim())
               || !/^[a-zA-Z]+(\s+[a-zA-Z]+){0,5}$/.test(lastname.trim())) {
         setMessageRender(<div className='error'>{errorIcon} You can't write accent marks</div>);
         setMessage(true);
         return;
      } else if(newPassword.length < 8){
         setMessageRender(<div className='error'>{errorIcon} New password must be more larger than 7 characters</div>);
         setMessage(true);
         return;
      } else if(!["jpg", "jpeg", "png"].includes(fileExt)){
         setMessageRender(<div className='error'>{errorIcon} File must be .png, .jpg or .jpeg</div>);
         setMessage(true);
         return;
      } else {
         sendData(data);
         setMessageRender(<div className='success'>{successIcon} Successfully sended!</div>);
         setMessage(true);
      }
   };

   const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
   const sendData = async data => {
      try {
         const CSRFToken = await getCSRFToken();
         const dataToSend = new FormData();
         for (const key in data){
            dataToSend.append(key, data[key]);
         }
         const res = await fetch(`${REACT_APP_API_URL}/api/v1/edit-profile/${user}`, {
            method: 'PUT',
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
         const response = await res.json();
         setMessageRender(<div className='success'>{successIcon} {response.body}</div>);
         setMessage(true);
      } catch (error) {
         console.error(error);
      }
   };

   return (
      <div className="edit-profile">
         <form onSubmit={handleSubmit}>
            {message && messageRender}
            <div className="name-lastname">
               <div className="name">
                  <p>Name:</p>
                  <input
                     type="text"
                     placeholder="Name"
                     name="name"
                     value={data.name}
                     onChange={handleChange}
                     required/>
               </div>
               <div className="lastname">
                  <p>Lastname:</p>
                  <input
                     type="text"
                     placeholder="Lastname"
                     name="lastname"
                     value={data.lastname}
                     onChange={handleChange}
                     required/>
               </div>
            </div>
            <div className="username">
               <p>Username:</p>
               <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={data.username}
                  onChange={handleChange}
                  required/>
            </div>
            <div className="old-password">
               <p>Old Password:</p>
               <input
                  type="password"
                  placeholder="old password"
                  name="oldPassword"
                  value={data.oldPassword}
                  onChange={handleChange}
                  required/>
            </div>
            <div className="new-password">
               <p>New Password:</p>
               <input
                  type="password"
                  placeholder="new password"
                  name="newPassword"
                  value={data.newPassword}
                  onChange={handleChange}
                  required/>
            </div>
            <div className="email">
               <p>Email:</p>
               <input
                  type="email"
                  placeholder="email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  required/>
            </div>
            <div className="photo">
               <p>Profile Photo:</p>
               <input
                  type="file"
                  accept=".jpg, .png, .jpeg"
                  onChange={handleFileChange}/>
            </div>
            <button type="submit" className="send-button">Save</button>
         </form>
      </div>
   );
};

export default EditProfile;