const express = require('express');
const passport = require('passport');
const GithubStrategy = require('passport-github').Strategy;
const LocalStrategy = require('passport-local');
const crypto = require('crypto');

function registerPassport(app) {
  app.use(
    require('express-session')({
      secret: 'courseNet11111',
      resave: true,
      saveUninitialized: true,
    })
  );

  passport.use(
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL:
          'https://' +
          process.env.PROJECT_DOMAIN +
          '.glitch.me/api/login/github/return',
      },
      function (token, tokenSecret, profile, cb) {
        return cb(null, profile);
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(async (req, res, next) => {
    // check user credential
    // console.log(req);
    next();
  })
}

const api = express.Router();

api.get('/', (req, res) => {
  res.end();
});

api.get(
  '/github/return',
  passport.authenticate('github', { failureRedirect: '/' }),
  function (req, res) {
    res.redirect('/');
  }
);

api.get('/github', passport.authenticate('github'));


module.exports = {
  registerPassport,
  loginApi: api,
};
