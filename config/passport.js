"use strict";
const passport = require("passport");
const User = require("../models/user");
const config = require("./");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");

// ============================ Custom Login Strategy ============================ //

const localLogin = new LocalStrategy({ usernameField: "email" }, function(
  email,
  password,
  done
) {
  return User.findOne({ email: email })
    .then(user => {
      if (!user)
        return done(null, false, {
          error: "Email not found. Please try again."
        });

      const isValid = user.validatePassword(password);
      if (!isValid)
        return done(null, false, {
          error: "Incorrect password. Please try again."
        });

      return done(null, user);
    })
    .catch(err => done(err));
});

// ============================ JWT Strategy ============================ //

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.secret
};

// Setting up JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(jwtPayload, done) {
  return User.findById(jwtPayload._id)
    .then(user => {
      if (!user) return done(null, false);
      return done(null, user);
    })
    .catch(err => done(err, false));
});

passport.use(jwtLogin);
passport.use(localLogin);

module.exports = passport;
