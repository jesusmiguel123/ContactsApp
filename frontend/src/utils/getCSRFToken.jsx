const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const getCookie = name => {
   let cookieValue = null;

   if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
         const cookie = cookies[i].trim();
         if (cookie.substring(0, name.length + 1) === (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
         }
      }
   }
   return cookieValue;
}

const getCSRFtoken = async () => {
   const token = getCookie('csrftoken');
   if(token != null) {
      return token;
   }
   const res = await fetch(`${REACT_APP_API_URL}/api/v1/get_csrf_token`, {
      credentials: 'include'
   });
   return res.headers.get(["X-CSRFToken"]);
};

export default getCSRFtoken;