const express = require('express');
const user_router = express.Router();
const User = require('./config/db');

function checkAdmin(req, res, next) {
  if (res.locals.user.admin) {
    next();
  } else {
    res.status(401).json({ "error": "You need to be an admin to perform this action." });
  }
}

function ensureSameUserInParam(req, res, next) {
  if(req.headers.user == req.params.username) next();
  else res.status(401).json({"error": "You cannot access another user's data."}); 
}

function ensureSameUserInBody(req, res, next) {
  if(req.headers.user == req.body.username) next();
  else res.status(401).json({"error": "You cannot access another user's data."}); 
}

user_router.use((req, res, next) => {
  console.log(new Date() + " " + req.path);
  next();
})

user_router.use(express.json());

/**
 * endpoint for the front end to login the user with
 * 
 * @method post
 * @param username the username of the user to be logged in
 * @param password the password of the user that is going to login
 */
user_router.post('/login', async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let user = await User.findOne({ username: username, password: password });
  if (user) {
    res.status(200).json({ "user": user });
  } else {
    res.status(405).json({ "error": "Incorrect username/password combination." });
  }
});

user_router.use(async (req, res, next) => {
  if (req.header('user')) {
    res.locals.user = await User.findOne({ username: req.headers['user'] }).exec();
    next();
  } else {
    res.status(401).json({ "error": "Unauthorized access." });
  }
});

/**
 * REST API endpoint for the users to be viewed and added
 * 
 * @method get
 * @returns the details of all the users registered on this microservice
 * 
 * @method post
 * adds a user to database if there is a unique username
 * 
 * @method put
 * @param username the username of the user to modify
 * @param to_update a json key that contains the json of the modified values
 */
user_router.route('/')
  .get(checkAdmin, async (req, res) => {
    let users = await User.find({});
    res.status(200).json(users);
  })
  .post(checkAdmin, async (req, res) => {
    let user = req.body;
    if ((await User.find({ username: user.username })).length !== 0) {
      res.status(200).json({ "error": "Username already exists." });
    } else {
      await User.create(user);
      res.status(200).json({ "success": "Added user successfully." });
    }
  });

/**
 * endpoint to perform view, update and delete operations on a user
 * 
 * @requires request.headers.user exists (user is logged in)
 */
user_router.route('/:username')
  .get(ensureSameUserInParam, async (req, res) => {
    let user = await User.findOne({username: req.params.username});
    if (user) res.status(200).json(user);
    else res.status(404);
  })
  .put(ensureSameUserInParam, async (req, res) => {
    let username = req.body.username;
    let to_update = req.body.to_update;
    await User.findOneAndUpdate({ username: username }, to_update);
    res.status(200).json({ "success": "Details updated successfully!" });
  })
  .delete(ensureSameUserInParam, async (req, res) => {
    let user = await User.findOne({username: req.params.username});
    if (user) {
      await User.deleteOne({username: user.username});
      res.status(200).json({"success": "Deleted user successfully."});
    }
    else res.status(404).json({"error": "This user doesn't exist."});
  });

module.exports = user_router;
