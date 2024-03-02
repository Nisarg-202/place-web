import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Card from "../components/Card";

function HomeScreen(props) {
  const [users, setUsers] = useState([]);

  async function getData() {
    await axios
      .post(`${process.env.REACT_APP_SERVER_URL}/allUser`, {
        token: localStorage.getItem("TOKEN"),
      })
      .then(function (response) {
        setUsers(response.data.users);
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  useEffect(function () {
    getData();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container my-4">
        <div className="row">
          {users &&
            users.map(function (item) {
              return (
                <div className="col-lg-4 col-md-6 my-3">
                  <Card
                    {...props}
                    id={item._id}
                    name={item.name}
                    place={item.places.length}
                    image={item.profileImage}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
