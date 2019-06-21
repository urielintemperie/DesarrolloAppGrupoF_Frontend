import React from 'react';
import {withRouter} from 'react-router-dom';
import auth0Client from 'authorization/auth';
import LanguageSelector from './LanguageSelector';

function NavBar(props) {
  const signOut = () => {
    auth0Client.signOut();
    props.history.replace('/');
  };

  return (
    <nav className="navbar navbar-dark bg-primary fixed-top">
      {
        !auth0Client.isAuthenticated() &&
        <button className="btn btn-dark" onClick={auth0Client.signIn}>Sign In</button>
      }
      {
        auth0Client.isAuthenticated() &&
        <div>
          <label className="mr-2 text-white">{auth0Client.getProfile().name}</label>
          <button className="btn btn-dark" onClick={() => {signOut()}}>Sign Out</button>
        </div>

      }
      <LanguageSelector/>
    </nav>
  );
}

export default withRouter(NavBar);