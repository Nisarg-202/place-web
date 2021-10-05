const express = require('express');
const {check} = require('express-validator');
const userActions = require('../actions/userActions');
const Auth = require('../middleware/Auth');

const router = express.Router();

router.post('/auth', Auth, userActions.checkAuth);

router.post(
  '/signup',
  [
    check('password').isLength({min: 6, max: 8}),
    check('email').normalizeEmail().isEmail(),
    check('name').isLength({min: 1}),
  ],
  userActions.signup
);

router.post(
  '/login',
  [
    check('password').isLength({min: 6, max: 8}),
    check('email').normalizeEmail().isEmail(),
  ],
  userActions.login
);

router.post(
  '/create',
  [
    check('title').isLength({min: 1}),
    check('description').isLength({min: 10}),
    check('address').isLength({min: 10}),
  ],
  Auth,
  userActions.create
);

router.post('/places', Auth, userActions.places);

router.post('/userPlace/:id', Auth, userActions.getPlace);

router.post(
  '/editPlace/:id',
  [check('title').isLength({min: 1}), check('description').isLength({min: 10})],
  Auth,
  userActions.editPlace
);

router.post('/deletePlace/:id', Auth, userActions.deletePlace);

router.post('/allUser', userActions.allUser);

router.post('/places/:id', userActions.oneUser);

router.post('/checkId', Auth, userActions.checkId);

module.exports = router;
