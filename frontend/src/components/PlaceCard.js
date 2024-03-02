import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthContext from "../Context/AuthContext";

function PlaceCard(props) {
  const auth = useContext(AuthContext);
  const [id, setId] = useState();
  const [map, setMap] = useState(false);

  async function getUserId() {
    await axios
      .post(`${process.env.REACT_APP_SERVER_URL}/checkId`, {
        token: localStorage.getItem("TOKEN"),
      })
      .then(function (response) {
        setId(response.data.userId);
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  useEffect(
    function () {
      if (auth.isLoggedin) {
        getUserId();
      }
    },
    [auth.isLoggedin]
  );

  async function onDeletePress() {
    await axios
      .post(`${process.env.REACT_APP_SERVER_URL}/deletePlace/${props.id}`, {
        token: localStorage.getItem("TOKEN"),
      })
      .then(function (response) {
        if (response.data.condition) {
          props.getData();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  return (
    <div className="d-flex justify-content-center my-3">
      <div className="card rounded pb-3 shadow" style={{ width: "30rem" }}>
        <img
          className="card-img-top"
          src={
            map
              ? `https://maps.locationiq.com/v2/staticmap?key=${process.env.REACT_APP_API_KEY}&center=${props.lat},${props.lng}&size=480x270&zoom=18&markers=icon:large-red-cutout|${props.lat},${props.lng}`
              : props.src
          }
          alt="map-img"
          height="270"
        />
        <div className="card-body">
          <h5 className="card-title text-center">{props.title}</h5>
          <h6 className="card-subtitle text-center">{props.address}</h6>
          <p className="card-text text-center">{props.description}</p>
        </div>
        <hr />
        <div className="d-flex justify-content-around">
          <button
            type="button"
            className="btn btn-primary"
            onClick={function () {
              if (map) {
                setMap(false);
              } else {
                setMap(true);
              }
            }}
          >
            {map ? "HIDE MAP" : "SHOW MAP"}
          </button>
          {auth.isLoggedin && props.userId === id && (
            <Link className="btn btn-primary" to={`/edit/${props.id}`}>
              EDIT
            </Link>
          )}
          {auth.isLoggedin && props.userId === id && (
            <Link className="btn btn-primary" onClick={onDeletePress}>
              DELETE
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlaceCard;
