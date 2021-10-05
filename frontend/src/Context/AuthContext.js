import {createContext} from 'react';

export default createContext({
  isLoggedin: false,
  login: function () {},
  logout: function () {},
});
