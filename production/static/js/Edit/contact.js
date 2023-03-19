const getUsers = async () => {
   try {
      const res = await fetch(getUsersURL);
      if(!res.ok) {
         console.log(res);
         return;
      }
      const data = await res.json();
      return data.users;
   } catch (error) {
      console.log(error);
   }
};

const setOptions = async (select, user) => {
   const list_users = await getUsers();
   list_users.forEach(e => {
      if (e !== user){
         const myOption = document.createElement("option");
         myOption.value = e;
         myOption.innerText = e;
         select.appendChild(myOption);
      }
   });
};

const editContact = async (id, data) => {
   try {
      const res = await fetch(`${editContactURL}?id=${id}`, {
         method: 'PUT',
         headers: {
            'X-CSRFToken': csrf_token
         },
         credentials: 'include',
         body: data
      });
      if(!res.ok) {
         const response = await res.json();
         alert(response.body);
         return;
      }
      const response = await res.json();
      alert(response.body);
   } catch (error) {
      console.error(error);
   }
};

const editContactClick = (id, user) => {
   const divBackground = document.createElement('div');
   divBackground.className = "background";

   const divModal = document.createElement('div');
   divModal.className = "modal";

   const divHeader = document.createElement('div');
   divHeader.className = "header";

   const h3Title = document.createElement('h3');
   h3Title.innerHTML = "Edit contact";

   const closeButton = document.createElement('button');
   closeButton.className = "close";
   closeButton.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' className='bi bi-x' viewBox='0 0 16 16'><path d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z'/></svg>";
   closeButton.onclick = () => {
      const divAdminHome = document.getElementsByClassName("admin-contacts")[0];
      divAdminHome.removeChild(document.getElementsByClassName("background")[0]);
   }

   divHeader.appendChild(h3Title);
   divHeader.appendChild(closeButton);

   const divBody = document.createElement('div');
   divBody.className = "body";
   divBody.innerHTML = `
   <form class="edit-contact-form">
      <input type="hidden" name="csrf_token" value=${csrf_token} />
      <div class="contact-username">
         <p>Contact:</p>
         <select name="contact" class="select-contact">
         </select>
      </div>
      <button type="submit" class="send-button">Save</button>
   </form>`;

   const myForm = divBody.getElementsByClassName("edit-contact-form")[0];
   
   const selectContact = myForm.getElementsByClassName("select-contact")[0];
   
   setOptions(selectContact, user);

   myForm.addEventListener("submit", e => {
      e.preventDefault();

      const myFormData = new FormData(myForm);

      const contact = myFormData.get("contact");

      if(!contact.trim()){
         alert("Void fields");
         return;
      } else {
         editContact(id, myFormData);
      }
   });

   divModal.appendChild(divHeader);
   divModal.appendChild(divBody);
   divBackground.appendChild(divModal);

   const divAdminHome = document.getElementsByClassName("admin-contacts")[0];
   divAdminHome.appendChild(divBackground);
};