import React, {useCallback, useEffect, useState} from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import axios from 'axios';
import AuthContext from './Context/AuthContext';
import CreatePlaceScreen from './screens/CreatePlaceScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import MyPlaceScreen from './screens/MyPlaceScreen';
import EditScreen from './screens/EditScreen';
import AllPlaceScreen from './screens/AllPlaceScreen';

function App() {
  const [isLoggedin, setisLoggedin] = useState(false);
  const login = useCallback(function () {
    setisLoggedin(true);
  }, []);
  const logout = useCallback(function () {
    setisLoggedin(false);
  }, []);

  async function checkUser() {
    const token = localStorage.getItem('TOKEN');
    if (token) {
      await axios
        .post('http://localhost:5000/auth', {token})
        .then(function (response) {
          if (response.data.condition) {
            setisLoggedin(true);
          } else {
            setisLoggedin(false);
          }
        })
        .catch(function (error) {
          setisLoggedin(false);
        });
    } else {
      setisLoggedin(false);
    }
  }

  useEffect(function () {
    checkUser();
  }, []);

  let router;
  if (isLoggedin) {
    router = (
      <Switch>
        <Route path="/" component={HomeScreen} exact />
        <Route path="/places" component={MyPlaceScreen} exact />
        <Route path="/create" component={CreatePlaceScreen} exact />
        <Route path="/edit/:id" component={EditScreen} exact />
        <Route path="/other/:id" component={AllPlaceScreen} exact />
        <Redirect to="/" exact />
      </Switch>
    );
  } else {
    router = (
      <Switch>
        <Route path="/" component={HomeScreen} exact />
        <Route path="/auth" component={LoginScreen} exact />
        <Route path="/other/:id" component={AllPlaceScreen} exact />
        <Redirect to="/" exact />
      </Switch>
    );
  }
  return (
    <AuthContext.Provider
      value={{isLoggedin: isLoggedin, login: login, logout: logout}}
    >
      <BrowserRouter>{router}</BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
