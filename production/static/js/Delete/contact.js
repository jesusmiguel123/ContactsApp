const deleteContact = async id => {
   try {
      const res = await fetch(`${deleteContactURL}?id=${id}`, {
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

const deleteContactClick = id => {
   deleteContact(id);
};