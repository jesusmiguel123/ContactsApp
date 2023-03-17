const addAdmins = document.getElementById("add-admins");

addAdmins.onclick = () => {
   const divBackground = document.createElement('div');
   divBackground.className = "background";

   const divModal = document.createElement('div');
   divModal.className = "modal";

   const divHeader = document.createElement('div');
   divHeader.className = "header";

   const h3Title = document.createElement('h3');
   h3Title.innerHTML = "Add new admin user";

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
   <form class="add-admins-form">
      <input type="hidden" name="csrf_token" value=${csrf_token} />
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
      <button type="submit" class="send-button">Save</button>
   </form>`;
   const myForm = divBody.getElementsByClassName("add-admins-form")[0];
   
   const sendData = async data => {
      try {
         const res = await fetch(addAdminsURL, {
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
      sendData(myFormData);
   });

   divModal.appendChild(divHeader);
   divModal.appendChild(divBody);
   divBackground.appendChild(divModal);

   const divAdminHome = document.getElementsByClassName("admin-home")[0];
   divAdminHome.appendChild(divBackground);
};