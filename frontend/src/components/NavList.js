import React from 'react';
import {Link} from 'react-router-dom';

function NavList(props) {
  return (
    <li className="nav-item">
      <Link className="nav-link text-white" to={props.to}>
        {props.title}
      </Link>
    </li>
  );
}

export default NavList;
