import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

function EditScreen(props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [spinner, setSpinner] = useState(false);

  async function onHandleChange(e) {
    e.preventDefault();
    setSpinner(true);
    await axios
      .post(
        `https://intense-ravine-21610.herokuapp.com/editPlace/${props.match.params.id}`,
        {
          title,
          description,
          token: localStorage.getItem('TOKEN'),
        }
      )
      .then(function (response) {
        if (response.data.condition) {
          alert('Successfully updated!');
          setTitle('');
          setDescription('');
          setSpinner(false);
        } else {
          setSpinner(false);
          setError(response.data.message);
        }
      });
  }

  async function getData() {
    setError('');
    await axios
      .post(
        `https://intense-ravine-21610.herokuapp.com/userPlace/${props.match.params.id}`,
        {
          token: localStorage.getItem('TOKEN'),
        }
      )
      .then(function (response) {
        const {title, description} = response.data.place;
        setTitle(title);
        setDescription(description);
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
      <div className="container my-4 d-flex justify-content-center">
        <div className="card shadow p-4 rounded bg-white">
          <form onSubmit={onHandleChange}>
            <div className="form-group">
              <label htmlFor="title" className="h5">
                Title
              </label>
              <input
                className="form-control"
                type="text"
                required
                id="title"
                minLength="1"
                value={title}
                onChange={function (e) {
                  setTitle(e.target.value);
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description" className="h5" contentEditable>
                Description
              </label>
              <input
                className="form-control"
                type="text"
                required
                minLength="10"
                id="description"
                value={description}
                onChange={function (e) {
                  setDescription(e.target.value);
                }}
              />
            </div>
            {error}
            <div className="form-group">
              <button className="btn btn-primary" type="submit">
                {spinner ? (
                  <div class="d-flex justify-content-center">
                    <div class="spinner-border" role="status">
                      <span class="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : (
                  'UPDATE PLACE'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditScreen;
