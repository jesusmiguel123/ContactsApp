const deleteProfile = async username => {
   try {
      const res = await fetch(`${deleteProfileURL}?username=${username}`, {
         method: 'DELETE',
         headers: {
            'X-CSRFToken': csrf_token
         },
         credentials: 'include'
      });
      if(!res.ok) {
         const data = await res.json();
         alert(data.body);
         return;
      }
      const data = await res.json();
      alert(data.body);
   } catch (error) {
      console.log(error);
   }
};

const deleteProfileClick = username => {
   deleteProfile(username);
};