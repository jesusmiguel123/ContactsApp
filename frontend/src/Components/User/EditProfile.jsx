import '../../Styles/User/EditProfile.css';

const EditProfile = ({ user }) => {
   return (
      <div className="edit-profile">
         <form>
            <div className="name-lastname">
               <div className="name">
                  <p>Name:</p>
                  <input
                     type='text'
                     placeholder='Name'
                     name='name'
                     required/>
               </div>
               <div className="lastname">
                  <p>Lastname:</p>
                  <input
                     type='text'
                     placeholder='Lastname'
                     name='lastname'
                     required/>
               </div>
            </div>
            <div className="username">
               <p>Username:</p>
               <input
                  type='text'
                  placeholder='Username'
                  name='username'
                  required/>
            </div>
            <div className="old-password">
               <p>Old Password:</p>
               <input
                  type="password"
                  placeholder="old password"
                  name="oldPassword"
                  required/>
            </div>
            <div className="new-password">
               <p>New Password:</p>
               <input
                  type="password"
                  placeholder="new password"
                  name="newPassword"
                  required/>
            </div>
            <div className="email">
               <p>Email:</p>
               <input
                  type='email'
                  placeholder='email'
                  name='email'
                  required/>
            </div>
            <div className="photo">
               <p>Profile Photo:</p>
               <input
                  type="file"
                  accept=".jpg, .png, .jpeg"
                  required/>
            </div>
            <button className="send-button">Save</button>
         </form>
      </div>
   );
};

export default EditProfile;