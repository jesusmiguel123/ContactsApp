//import { useParams, Outlet } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

const Profile = (props) => {
   //const { username } = useParams();
   return (
      <>
         {props.user}
         <Outlet />
      </>
   );
   
}
export default Profile;