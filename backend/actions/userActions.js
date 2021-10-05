const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const {validationResult} = require('express-validator');
const axios = require('axios');
const {v4} = require('uuid');
const cloudinary = require('cloudinary').v2;
const User = require('../model/User');

const checkAuth = function (req, res) {
  res.json({condition: true});
};

const signup = function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json({condition: false, message: 'Please enter a valid information.'});
  } else {
    const {name, email, password} = req.body;
    const {image} = req.files;
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) {
          res.json({condition: false, message: err.message});
        } else {
          cloudinary.uploader
            .upload_stream(async function (err, result) {
              if (err) {
                res.json({condition: false, message: err.message});
              } else {
                const user = new User({
                  name,
                  email,
                  password: hash,
                  profileImage: result.secure_url,
                });
                const token = jwt.sign({userId: user._id}, process.env.JWT_KEY);
                await user.save(function (err) {
                  if (err) {
                    res.json({condition: false, message: err.message});
                  } else {
                    res.json({condition: true, token});
                  }
                });
              }
            })
            .end(image.data);
        }
      });
    });
  }
};

const login = async function (req, res) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    res.json({condition: false, message: 'Please enter a valid information.'});
  } else {
    const {email, password} = req.body;
    await User.findOne({email}, function (err, found) {
      if (err) {
        res.json({condition: false, message: err.message});
      } else {
        if (found) {
          bcrypt.compare(password, found.password, function (err, result) {
            if (err) {
              res.json({condition: false, message: err.message});
            } else {
              if (result) {
                const token = jwt.sign(
                  {userId: found._id},
                  process.env.JWT_KEY
                );
                res.json({condition: true, token});
              } else {
                res.json({condition: false, message: 'Incorrect Password!'});
              }
            }
          });
        } else {
          res.json({condition: false, message: 'User not found!'});
        }
      }
    });
  }
};

const create = async function (req, res) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    res.json({condition: false, message: 'Please enter a valid information.'});
  } else {
    const {title, description, address} = req.body;
    const {image} = req.files;
    const {user} = req;
    const response = await axios.get(
      `https://eu1.locationiq.com/v1/search.php?key=${process.env.KEY}&format=json&q=${address}`
    );
    await User.findOne({_id: user._id}, async function (err, found) {
      if (err) {
        res.json({condition: false, message: err.message});
      } else {
        if (found) {
          cloudinary.uploader
            .upload_stream(async function (err, result) {
              if (err) {
                res.json({condition: false, message: err.message});
              } else {
                const place = {
                  title,
                  description,
                  address,
                  placeImage: result.secure_url,
                  lat: response.data[0].lat,
                  lng: response.data[0].lon,
                };
                found.places.push(place);
                await found.save(function (err) {
                  if (err) {
                    res.json({condition: false, message: err.message});
                  } else {
                    res.json({condition: true});
                  }
                });
              }
            })
            .end(image.data);
        } else {
          res.json({condition: false, message: 'User not found'});
        }
      }
    });
  }
};

const places = async function (req, res) {
  const {user} = req;
  await User.findOne({_id: user._id}, function (err, found) {
    if (err) {
      res.json({condition: false, message: err.message});
    } else {
      if (found) {
        res.json({condition: true, userPlaces: found.places, userId: user._id});
      } else {
        res.json({condition: false, message: 'User not found!'});
      }
    }
  });
};

const getPlace = async function (req, res) {
  const {user} = req;
  await User.findOne({_id: user._id}, function (err, found) {
    if (err) {
      res.json({condition: false, message: err.message});
    } else {
      if (found) {
        const place = found.places.find(function (item) {
          return item._id == req.params.id;
        });
        if (place) {
          res.json({condition: true, place});
        } else {
          res.json({condition: false, message: 'Place not found!'});
        }
      } else {
        res.json({condition: false, message: 'User not found!'});
      }
    }
  });
};

const editPlace = async function (req, res) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    res.json({
      condition: false,
      message: 'Please enter a valid information.',
    });
  } else {
    const {user} = req;
    const {title, description} = req.body;
    await User.findOne({_id: user._id}, async function (err, found) {
      if (err) {
        res.json({condition: false, message: err.message});
      } else {
        if (found) {
          for (var i = 0; i < found.places.length; i++) {
            if (found.places[i]._id == req.params.id) {
              found.places[i].title = title;
              found.places[i].description = description;
            }
          }
          await found.save();
          res.json({condition: true});
        } else {
          res.json({condition: false, message: 'User not found!'});
        }
      }
    });
  }
};

const deletePlace = async function (req, res) {
  const {user} = req;
  let fileId;
  await User.findOne({_id: user._id}, function (err, found) {
    if (err) {
      console.log(err);
    } else {
      found.places.forEach(function (item) {
        if (item._id == req.params.id) {
          fileId = item.placeImage;
        }
      });
    }
  });

  await User.updateOne(
    {_id: user._id},
    {$pull: {places: {_id: req.params.id}}},
    function (err) {
      if (err) {
        res.json({condition: false, message: err.message});
      } else {
        res.json({condition: true});
      }
    }
  );
};

const allUser = async function (req, res) {
  console.log(req);
  await User.find(function (err, found) {
    if (err) {
      res.json({condition: false, message: err.message});
    } else {
      if (found) {
        res.json({condition: true, users: found});
      } else {
        res.json({condition: false, message: 'User not found'});
      }
    }
  });
};

const oneUser = async function (req, res) {
  await User.findById(req.params.id, function (err, found) {
    if (err) {
      res.json({condition: false, message: err.message});
    } else {
      if (found) {
        res.json({condition: true, places: found.places});
      } else {
        res.json({condition: false, message: err.message});
      }
    }
  });
};

const checkId = function (req, res) {
  const {user} = req;
  res.json({condition: true, userId: user._id});
};

exports.signup = signup;
exports.checkAuth = checkAuth;
exports.login = login;
exports.create = create;
exports.places = places;
exports.getPlace = getPlace;
exports.editPlace = editPlace;
exports.deletePlace = deletePlace;
exports.allUser = allUser;
exports.oneUser = oneUser;
exports.checkId = checkId;
