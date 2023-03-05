import '../Styles/Login.css';
import { useAuth } from '../utils/useAuth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
   const [data, setData] = useState({
      username: '',
      password: ''
   });

   const handleChange = e => {
      const { name, value } = e.target;

      setData(prev => ({
         ...prev,
         [name]: value
      }));
   };

   const { login } = useAuth();
   const navigate = useNavigate();

   const [message, setMessage] = useState(false);
   const [messageRender, setMessageRender] = useState([]);
   
   const errorIcon = <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-x-circle icon" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>;
   const successIcon = <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-check-circle icon" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/></svg>;
   
   const handleSubmit = async e => {
      e.preventDefault();

      const { username, password } = data;

      if(!username.trim()
         || !password.trim()){
         setMessageRender(<div className='error'>{errorIcon} Void fields</div>);
         setMessage(true);
         return;
      } else {
         const [response, HTTPcode] = await login(username, password);
         if(HTTPcode === 400){
            setMessageRender(<div className='error'>{errorIcon} {response}</div>);
            setMessage(true);
            return;
         }
         setMessageRender(<div className='success'>{successIcon} {response}</div>);
         setMessage(true);
         setUser(username);
         navigate("/user");
      }
   };

   return (
      <div className="login">
         <h2 id="title-login">Login to enter</h2>
         <div className="content-login">
            {message && messageRender}
            <form onSubmit={handleSubmit}>
               <div className="fields-login">
                  <label>
                     Username
                     <input
                        type='text'
                        placeholder='Username'
                        name='username'
                        value={data.username}
                        onChange={handleChange}
                        required/>
                  </label>
                  <label>
                     Password
                     <input
                        type='password'
                        placeholder='Password'
                        name='password'
                        value={data.password}
                        onChange={handleChange}
                        required/>
                  </label>
               </div>
               <div className="button-container-login">
                  <button type="submit" id="login">Login</button>
               </div>
            </form>
         </div>
      </div>
   );
}
 
export default Login;