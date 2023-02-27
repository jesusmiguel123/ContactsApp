import '../Styles/Login.css';
import { useAuth } from '../utils/useAuth';
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
   const { login } = useAuth();
   const navigate = useNavigate();

   const handleClick = () => {
      login();
      props.setUser('juan');
      navigate('/juan');
   }

   return (
      <div className="login">
         <h2 id="title-login">Login to enter</h2>
         <div className="content-login">
            <div className="fields-login">
               <label>
                  Username
                  <input
                     type='text'
                     placeholder='Username'
                     name='username'
                     required/>
               </label>
               <label>
                  Password
                  <input
                     type='password'
                     placeholder='Password'
                     name='password'
                     required/>
               </label>
            </div>
            <div className="button-container-login">
               <button onClick={handleClick} id="login">Login</button>
            </div>
         </div>
      </div>
   );
}
 
export default Login;