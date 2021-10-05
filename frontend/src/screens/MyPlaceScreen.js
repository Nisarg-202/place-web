import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import PlaceCard from '../components/PlaceCard';

function MyPlaceScreen() {
  const [places, setPlaces] = useState([]);
  const [id, setId] = useState();

  async function getData() {
    await axios
      .post('https://intense-ravine-21610.herokuapp.com/places', {
        token: localStorage.getItem('TOKEN'),
      })
      .then(function (response) {
        setPlaces([...response.data.userPlaces]);
        setId(response.data.userId);
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
              id={item._id}
              userId={id}
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
