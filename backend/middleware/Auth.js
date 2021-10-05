const jwt = require('jsonwebtoken');
const User = require('../model/User');

module.exports = function (req, res, next) {
  console.log(req);
  const {token} = req.body;
  jwt.verify(token, process.env.JWT_KEY, async function (err, payload) {
    if (err) {
      res.json({condition: false, message: err.message});
    } else {
      const {userId} = payload;
      await User.findById(userId, function (err, found) {
        if (err) {
          res.json({condition: false, message: err.message});
        } else {
          if (found) {
            req.user = found;
            next();
          } else {
            res.json({condition: false, message: 'User not found.'});
          }
        }
      });
    }
  });
};
