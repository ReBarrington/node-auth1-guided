const router = require("express").Router();
const bcrypt = require("bcryptjs");
const authenticator = require('../auth/authenticator.js');

const Users = require("./users-model.js");

router.get("/users", (req, res) => {
  if (req.session.loggedIn = true ) {
    Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
  } else {
    res.status(404).json({ message: "Please log in first."})
  }
});

router.post("/register", (req, res) => {

  let user = req.body; // username, password
  // rounds are 2 to the N times

  const rounds = process.env.HASH_ROUNDS || 14;
  // hash the user.password

  const hash = bcrypt.hashSync(user.password, rounds);
  // update the user to use the hash

  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: error.message });
    });
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;

    //search for the user using the username:
    Users.findBy({ username })
        .then(([user]) => {
            // user is an array, so we need to use deconstruct user
            // if we find the user, check that the passwords match.
            if (user && bcrypt.compareSync(password, user.password)) {
                req.session.loggedIn = true 
                res.status(200).json({ message: "You are now logged in!", id: user.id });
                // needs to return a cookie with the user.id in it...
            } else {
                res.status(401).json({ message: "Username or password not found. You shall not pass!"})
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Could not log in."})
        })
})

module.exports = router;
