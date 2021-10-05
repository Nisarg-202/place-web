import React, {useRef, useState} from 'react';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './LoginScreen.css';

function CreatePlaceScreen(props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState();
  const [error, setError] = useState('');
  const [spinner, setSpinner] = useState(false);
  const imageRef = useRef(null);

  function onImageChange(e) {
    setImage(e.target.files[0]);
    imageRef.current.src = URL.createObjectURL(e.target.files[0]);
    imageRef.current.onload = function () {
      URL.revokeObjectURL(imageRef.current.src);
    };
  }

  async function onHandleChange(e) {
    e.preventDefault();
    setSpinner(true);
    const formData = new FormData();
    formData.append('image', image);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('address', address);
    formData.append('token', localStorage.getItem('TOKEN'));
    await axios
      .post('https://intense-ravine-21610.herokuapp.com/create', formData)
      .then(function (response) {
        if (response.data.condition) {
          setSpinner(false);
          setTitle('');
          setDescription('');
          setAddress('');
          imageRef.current.src = null;
          alert('Successfully Added!');
          props.history.push('/');
        } else {
          setSpinner(false);
          setError(response.data.message);
        }
      })
      .catch(function (err) {
        setSpinner(false);
        setError(err);
      });
  }

  return (
    <div>
      <Navbar />
      <div className="container my-5 d-flex justify-content-center">
        <div className="card shadow p-3 bg-white">
          <form onSubmit={onHandleChange}>
            <div className="form-group">
              <label htmlFor="title" className="h5">
                Title
              </label>
              <input
                type="text"
                required
                minLength="1"
                id="title"
                className="form-control"
                value={title}
                onChange={function (e) {
                  setTitle(e.target.value);
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description" className="h5">
                Description
              </label>
              <input
                type="text"
                required
                minLength="10"
                id="description"
                className="form-control"
                value={description}
                onChange={function (e) {
                  setDescription(e.target.value);
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="address" className="h5">
                Address
              </label>
              <input
                type="text"
                required
                minLength="10"
                id="address"
                className="form-control"
                value={address}
                onChange={function (e) {
                  setAddress(e.target.value);
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="file" className="h5">
                Pick Place Image
              </label>
              <div id="file-upload" className="border">
                <img ref={imageRef} id="file-upload" alt="file" />
              </div>
              <input
                type="file"
                required
                accept="image/x-png"
                id="file"
                className="form-control-file mt-2"
                onChange={onImageChange}
              />
            </div>
            {error}
            <div className="form-group">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={
                  title.length === 0 ||
                  description.length === 0 ||
                  address.length === 0
                }
              >
                {spinner ? (
                  <div class="d-flex justify-content-center">
                    <div class="spinner-border" role="status">
                      <span class="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : (
                  'ADD PLACE'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default withRouter(CreatePlaceScreen);
