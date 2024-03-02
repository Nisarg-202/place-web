import React, { useContext, useRef, useState } from "react";
import axios from "axios";
import Recaptcha from "react-recaptcha";
import Navbar from "../components/Navbar";
import AuthContext from "../Context/AuthContext";
import "./LoginScreen.css";

function LoginScreen() {
  const auth = useContext(AuthContext);
  const [captcha, setCaptcha] = useState();
  const [condition, setCondition] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [spinner, setSpinner] = useState(false);
  const imageRef = useRef();
  async function onHandleChange(e) {
    e.preventDefault();
    setSpinner(true);
    if (captcha) {
      if (condition) {
        await axios
          .post(`${process.env.REACT_APP_SERVER_URL}/login`, {
            email,
            password,
          })
          .then(function (response) {
            if (response.data.condition) {
              localStorage.setItem("TOKEN", response.data.token);
              auth.login();
            } else {
              setError(response.data.message);
              setSpinner(false);
            }
          })
          .catch(function (err) {
            setSpinner(false);
            setError(err);
          });
      } else {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        await axios
          .post(`${process.env.REACT_APP_SERVER_URL}/signup`, formData)
          .then(function (response) {
            if (response.data.condition) {
              localStorage.setItem("TOKEN", response.data.token);
              auth.login();
            } else {
              setError(response.data.message);
              setSpinner(false);
            }
          })
          .catch(function (err) {
            setError(err);
            setSpinner(false);
          });
      }
    } else {
      setSpinner(false);
      setError("Please Enter a captcha");
    }
  }

  function onImageChange(e) {
    setImage(e.target.files[0]);
    imageRef.current.src = URL.createObjectURL(e.target.files[0]);
    imageRef.current.onload = function () {
      URL.revokeObjectURL(imageRef.current.src);
    };
  }

  return (
    <div>
      <Navbar />
      <div className="container my-5 d-flex justify-content-center">
        <div className="card rounded shadow p-3 bg-white">
          <form onSubmit={onHandleChange}>
            <h3 className="text-center">
              {condition ? "Login Required" : "Sign Up Required"}
            </h3>
            <hr />
            {!condition && (
              <div className="form-group text-center">
                <label htmlFor="name" className="h5">
                  Your Name
                </label>
                <input
                  placeholder="Enter Your Name"
                  type="text"
                  required
                  minLength="1"
                  id="name"
                  className="form-control"
                  value={name}
                  onChange={function (e) {
                    setName(e.target.value);
                  }}
                />
              </div>
            )}
            {!condition && (
              <div className="form-group text-center">
                <label htmlFor="file" className="h5">
                  Profile Image
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
            )}
            <div className="form-group text-center">
              <label htmlFor="email" className="h5">
                E-mail
              </label>
              <input
                placeholder="Enter E-mail"
                type="email"
                required
                id="email"
                className="form-control"
                value={email}
                onChange={function (e) {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="form-group text-center">
              <label htmlFor="password" className="h5">
                Password
              </label>
              <input
                placeholder="Enter Password"
                type="password"
                minLength="6"
                maxLength="8"
                required
                id="password"
                className="form-control"
                value={password}
                onChange={function (e) {
                  setPassword(e.target.value);
                }}
              />
            </div>
            {error}
            <Recaptcha
              sitekey={process.env.REACT_APP_CAPTCHA_KEY}
              render="explicit"
              onloadCallback={function () {
                console.log("Captcha loaded successfully!");
              }}
              verifyCallback={function (response) {
                setCaptcha(response);
              }}
              expiredCallback={function () {
                setCaptcha("");
              }}
            />
            <div className="form-group text-center mt-2">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={
                  condition
                    ? email.length === 0 || password.length === 0
                    : email.length === 0 ||
                      password.length === 0 ||
                      name.length === 0
                }
              >
                {condition ? (
                  spinner ? (
                    <div class="d-flex justify-content-center">
                      <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    "Login"
                  )
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          </form>
          <div className="form-group text-center">
            <button
              className="btn btn-primary"
              onClick={function () {
                if (condition) {
                  setEmail("");
                  setImage(null);
                  setName("");
                  setPassword("");
                  setCondition(false);
                  setError("");
                } else {
                  setEmail("");
                  setImage(null);
                  setName("");
                  setPassword("");
                  setCondition(true);
                  setError("");
                }
              }}
            >
              {condition ? "Go to Sign Up" : "Go to Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
