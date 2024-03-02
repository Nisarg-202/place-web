import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import PlaceCard from "../components/PlaceCard";

function MyPlaceScreen(props) {
  const [places, setPlaces] = useState([]);

  async function getData() {
    await axios
      .post(
        `${process.env.REACT_APP_SERVER_URL}/places/${props.match.params.id}`
      )
      .then(function (response) {
        setPlaces([...response.data.places]);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  useEffect(function () {
    getData();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container">
        {places.map(function (item) {
          return (
            <PlaceCard
              src={item.placeImage}
              userId={props.match.params.id}
              id={item._id}
              title={item.title}
              description={item.description}
              address={item.address}
              lat={item.lat}
              lng={item.lng}
              getData={getData}
            />
          );
        })}
      </div>
    </div>
  );
}

export default MyPlaceScreen;
