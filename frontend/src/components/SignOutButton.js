import * as React from 'react';
import IconButton from '@mui/material/Button';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Link } from '@mui/material';
import Cookies from "universal-cookie";
import { UserContext } from "../contexts/UserContext";

function SignOut() {
// This is the signout button in the SHACker toolbar.
  //---------------------------------------
  const { user, setUser } = React.useContext(UserContext);

  const logOut = () => (e) => {
    e.preventDefault();

   // Delete cookie with authToken
   const cookies = new Cookies();
    
   localStorage.removeItem('isAuthenticated');

    cookies.remove('authToken', { path: '/admin' });
    cookies.remove('authToken', { path: '/' });
            

    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.clear();
    window.localStorage.clear()
    window.location.reload(true)
}

 return (
     <div>
        <IconButton>
            <ExitToAppIcon />
        </IconButton>

    </div>
 )
}

export default SignOut;