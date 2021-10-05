import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import AuthContext from '../Context/AuthContext';
import NavList from './NavList';

function Navbar() {
  const auth = useContext(AuthContext);
  return (
    <nav className="navbar navbar-dark bg-secondary navbar-expand-lg">
      <Link className="navbar-brand" to="/">
        YourPlaces
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ml-auto">
          <NavList title="ALL USERS" to="/" />
          {!auth.isLoggedin && <NavList title="AUTHENTICATE" to="/auth" />}
          {auth.isLoggedin && <NavList title="MY PLACES" to="/places" />}
          {auth.isLoggedin && <NavList title="ADD PLACE" to="/create" />}
          {auth.isLoggedin && (
            <li className="nav-item">
              <Link
                className="nav-link text-white"
                onClick={function (e) {
                  e.preventDefault();
                  localStorage.removeItem('TOKEN');
                  auth.logout();
                }}
              >
                LOGOUT
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
