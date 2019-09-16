const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();
const User = require("../models/User");

// write the get /signup route to show a form
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.get("/login", (req, res) => {
  res.render("auth/login", { errorMessage: req.flash("error") });
});

const passport = require("passport");

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true
  })
);

router.get("/github", passport.authenticate("github"));

router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: "/",
    failureRedirect: "/auth/login"
  })
);

router.post("/signup", (req, res, next) => {
  //   console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;
  // const { username, password } = req.body;

  // check if the password is long enough and username is not empty
  if (password.length < 8) {
    res.render("auth/signup", {
      message: "Your password must be 8 char. min."
    });
    return;
  }
  if (username === "") {
    res.render("auth/signup", { message: "Your username cannot be empty" });
    return;
  }

  User.findOne({ username: username }).then(found => {
    if (found !== null) {
      res.render("auth/signup", { message: "This username is already taken" });
    } else {
      // we can create a user with the username and password pair
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);

      User.create({ username: username, password: hash })
        .then(dbUser => {
          //   passport.authenticate("local", { successRedirect: "/" })(
          //     req,
          //     res,
          //     next
          //   );
          req.login(dbUser, err => {
            if (err) next(err);
            else res.redirect("/");
          });
        })
        .catch(err => {
          next(err);
        });
    }
  });
});

router.get("/logout", (req, res, next) => {
  // passport
  req.logout();
  res.redirect("/");
});

module.exports = router;
