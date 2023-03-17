const addProfiles = document.getElementById("add-profiles");

addProfiles.onclick = () => {
   const divBackground = document.createElement('div');
   divBackground.className = "background";

   const divModal = document.createElement('div');
   divModal.className = "modal";

   const divHeader = document.createElement('div');
   divHeader.className = "header";

   const h3Title = document.createElement('h3');
   h3Title.innerHTML = "Add new profile";

   const closeButton = document.createElement('button');
   closeButton.className = "close";
   closeButton.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' className='bi bi-x' viewBox='0 0 16 16'><path d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z'/></svg>";
   closeButton.onclick = () => {
      const divAdminHome = document.getElementsByClassName("admin-home")[0];
      divAdminHome.removeChild(document.getElementsByClassName("background")[0]);
   }

   divHeader.appendChild(h3Title);
   divHeader.appendChild(closeButton);

   const divBody = document.createElement('div');
   divBody.className = "body";
   divBody.innerHTML = `
   <form class="add-profiles-form">
      <div class="name-lastname">
         <div class="name">
            <p>Name:</p>
            <input
               type="text"
               placeholder="Name"
               name="name"
               required/>
         </div>
         <div class="lastname">
            <p>Lastname:</p>
            <input
               type="text"
               placeholder="Lastname"
               name="lastname"
               required/>
         </div>
      </div>
      <div class="username">
         <p>Username:</p>
         <input
            type="text"
            placeholder="Username"
            name="username"
            required/>
      </div>
      <div class="password">
         <p>Password:</p>
         <input
            type="password"
            placeholder="Password"
            name="password"
            required/>
      </div>
      <div class="email">
         <p>Email:</p>
         <input
            type="email"
            placeholder="email"
            name="email"
            required/>
      </div>
      <div class="photo">
         <p>Profile Photo:</p>
         <input
            id="file"
            type="file"
            accept=".jpg, .png, .jpeg"
            required/>
      </div>
      <button type="submit" class="send-button">Save</button>
   </form>`;
   const myForm = divBody.getElementsByClassName("add-profiles-form")[0];
   
   const sendData = async data => {
      try {
         const res = await fetch(addProfilesURL, {
            method: 'POST',
            headers: {
               'X-CSRFToken': csrf_token
            },
            credentials: 'include',
            body: data
         });
         if(res.status !== 200) {
            if(res.status === 400) {
               const response = await res.json();
               alert(response.body);
            }
            throw new Error(res.statusText);
         }
         const response = await res.json();
         const usersPage = response.body;
         window.location.href = usersPage;
      } catch (error) {
         console.error(error);
      }
   };
   
   myForm.addEventListener("submit", e => {
      e.preventDefault();

      const myFormData = new FormData(myForm);
      
      const name = myFormData.get("name");
      const lastname = myFormData.get("lastname");
      const username = myFormData.get("username");
      const password = myFormData.get("password");
      const email = myFormData.get("email");
      
      const file = document.getElementById("file").files[0];
      const ext = file.name.split(".", 2)[1];
      const newFileName = `${username}_profile_photo.${ext}`;
      const newFile = new File([file], newFileName, {type: file.type});
      myFormData.append("file", newFile);

      if(!name.trim()
         || !lastname.trim()
         || !username.trim()
         || !password.trim()
         || !email.trim()){
         alert("Void fields");
         return;
      } else if(!/^[a-zA-Z]+(\s+[a-zA-Z]+){0,5}$/.test(name.trim())
               || !/^[a-zA-Z]+(\s+[a-zA-Z]+){0,5}$/.test(lastname.trim())) {
         alert("You can't write accent marks");
         return;
      } else if(password.length < 8){
         alert("Password must be more larger than 7 characters");
         return;
      } else if(!["jpg", "jpeg", "png"].includes(ext)){
         alert("File must be .png, .jpg or .jpeg");
         return;
      } else {
         sendData(myFormData);
      }
   });

   divModal.appendChild(divHeader);
   divModal.appendChild(divBody);
   divBackground.appendChild(divModal);

   const divAdminHome = document.getElementsByClassName("admin-home")[0];
   divAdminHome.appendChild(divBackground);
};