import React from 'react';
import { GoogleLogin } from 'react-google-login';

const clientId = "99768717874-tjn91p480djdbniisjs9a7i1b5brb5dd.apps.googleusercontent.com"; 
function GoogleLoginButton() {

    const onSuccess = (res) => {
        console.log("LOGIN SUCCESS! Current user: ", res.profileObj);
    }
    
    const onFailure = (res) => {
        console.log("LOGIN FAILED! res: ", res);
    }

  return (
    <div id="signInButton">
        <GoogleLogin
        clientId={clientId}
        buttonText="Log in with Google"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        isSignedIn={true}
        />
    </div>
  );
};

export default GoogleLoginButton;
