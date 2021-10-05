import React from 'react';
import {withRouter} from 'react-router-dom';

function Card(props) {
  return (
    <div
      className="shadow rounded bg-white d-flex justify-content-around py-3"
      onClick={function () {
        props.history.push(`/other/${props.id}`);
      }}
    >
      <div>
        <img
          className="rounded-circle"
          height="50"
          width="50"
          src={props.image}
          alt="profile-img"
        />
      </div>
      <div>
        <h5 className="display-5">{props.name}</h5>
        <h6>{props.place} Place</h6>
      </div>
    </div>
  );
}

export default withRouter(Card);
