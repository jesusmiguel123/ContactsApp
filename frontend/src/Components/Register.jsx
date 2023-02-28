import '../Styles/Register.css';
import { useState } from 'react';

const Register = () => {
   const [data, setData] = useState({
      name: '',
      lastname: '',
      username: '',
      password: '',
      repassword: '',
      email: '',
      file: null
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
         const newFileName = `${data.username}_profile_photo.${ext}`;
         const newFile = new File([file], newFileName, {type: file.type});

         setData(prev => ({
            ...prev,
            file: newFile
         }));
      }
   };

   const [message, setMessage] = useState(false);
   const [messageRender, setMessageRender] = useState([]);
   const errorIcon = <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-x-circle icon" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>;
   const successIcon = <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-check-circle icon" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/></svg>;
   const handleSubmit = e => {
      e.preventDefault();

      const { name, lastname, username, password, repassword, email, file } = data;

      const fileExt = file.name.split(".", 2)[1];

      if(!name.trim()
         || !lastname.trim()
         || !username.trim()
         || !password.trim()
         || !repassword.trim()
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
      } else if(password !== repassword){
         setMessageRender(<div className='error'>{errorIcon} Password and Repassword must be equals</div>);
         setMessage(true);
         return;
      } else if(password.length < 8){
         setMessageRender(<div className='error'>{errorIcon} Password must be more larger than 7 characters</div>);
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
         const res = await fetch(`${REACT_APP_API_URL}/api/v1/register`, {
            method: 'POST',
            body: JSON.stringify(data)
         });
         if(res.status !== 200) {
            if(res.status === 400) {
               const response = await res.json();
               setMessageRender(<div className='error'>{errorIcon} {response.body}</div>);
               setMessage(true);
            }
            throw new Error(res.statusText);
         }
         const response = await res.json();
         setMessageRender(<div className='exito'>{successIcon} {response.body}</div>);
         setMessage(true);
      } catch (error) {
         console.error(error);
      }
   };

   return (
      <div className="register">
         <div className="fields-register">
            <h2 id="title-register">Register to enter</h2>
            <form onSubmit={handleSubmit}>
               {message && messageRender}
               <table>
                  <tbody>
                     <tr>
                        <td id="field-name-register">
                           <label>Name</label>
                        </td>
                        <td>
                           <input
                              type='text'
                              placeholder='Name'
                              name='name'
                              value={data.name}
                              onChange={handleChange}
                              required/>
                        </td>
                     </tr>
                     <tr>
                        <td id="field-name-register">
                           <label>Lastname</label>
                        </td>
                        <td>
                           <input
                              type='text'
                              placeholder='Lastname'
                              name='lastname'
                              value={data.lastname}
                              onChange={handleChange}
                              required/>
                        </td>
                     </tr>
                     <tr>
                        <td id="field-name-register">
                           <label>Username</label>
                        </td>
                        <td>
                           <input
                              type='text'
                              placeholder='Username'
                              name='username'
                              value={data.username}
                              onChange={handleChange}
                              required/>
                        </td>
                     </tr>
                     <tr>
                        <td id="field-name-register">
                           <label>Password</label>
                        </td>
                        <td>
                           <input
                              type='password'
                              placeholder='Password'
                              name='password'
                              value={data.password}
                              onChange={handleChange}
                              required/>
                        </td>
                     </tr>
                     <tr>
                        <td id="field-name-register">
                           <label>Rewrite Password</label>
                        </td>
                        <td>
                           <input
                              type='password'
                              placeholder='Repassword'
                              name='repassword'
                              value={data.repassword}
                              onChange={handleChange}
                              required/>
                        </td>
                     </tr>
                     <tr>
                        <td id="field-name-register">
                           <label>Email</label>
                        </td>
                        <td>
                           <input
                              type='email'
                              placeholder='email'
                              name='email'
                              value={data.email}
                              onChange={handleChange}
                              required/>
                        </td>
                     </tr>
                     <tr>
                        <td id="field-name-register">
                           <label>Photo</label>
                        </td>
                        <td>
                           <input
                              type="file"
                              accept=".jpg, .png, .jpeg"
                              onChange={handleFileChange}
                              required/>
                        </td>
                     </tr>
                  </tbody>
               </table>
               <div className="button-container-register">
                  <button type="submit" onClick={() => {;}} id="register">Register</button>
               </div>
            </form>
         </div>
      </div>
   );
}
 
export default Register;