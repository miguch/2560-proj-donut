const express = require('express');
const passport = require('passport');
const GithubStrategy = require('passport-github').Strategy;
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const userSchema = require('../schemas/user');

function registerPassport(app) {
  app.use(
    require('express-session')({
      secret: 'courseNet11111',
      resave: true,
      saveUninitialized: true,
      name: 'course___u-sess',
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
      function (accessToken, refreshToken, profile, cb) {
        return cb(null, profile);
      }
    )
  );

  passport.use(
    new LocalStrategy((username, password, cb) => {
      cb('null');
    })
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
    console.log(req.path, req.query);
    if (req.path.startsWith('/login') || req.path.startsWith('/logoff')) {
      return next();
    }
    if (req.isAuthenticated() && req.user) {
      return next();
    }
    res.status(401);
    res.end();
  });
}

const api = express.Router();

api.get('/', (req, res) => {
  res.end();
});

api.get(
  '/github/return',
  passport.authenticate('github', {
    keepSessionInfo: true,
  }),
  function (req, res) {
    if (req.session.returnUrl) {
      res.redirect(req.session.returnUrl);
      delete req.session.returnUrl;
    } else {
      res.redirect('/');
    }
  }
);

api.get('/github', (req, res, next) => {
  if (req.query.r) {
    req.session.returnUrl = req.query.r;
  }
  passport.authenticate('github', {
    successReturnToOrRedirect: req.query.r,
    keepSessionInfo: true,
  })(req, res, next);
});

function hashPasswd(pass, salt) {
  salt = salt || crypto.randomBytes(16);
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(pass, salt, 32000, 64, 'sha512', (err, key) => {
      if (err) {
        reject(err);
      }
      resolve({
        key,
        salt,
      });
    });
  });
}

api.post('/signup', async (req, res, next) => {
  const newUser = req.body;
  const { error, value } = userSchema.signupValidation.validate(newUser);

  if (error) {
    res.status(422);
    res.json({
      message: error.message,
    });
    return;
  }
  const item = await userSchema.mongo.find({
    $or: [{ username: newUser.username }, { email: newUser.email }],
  });

  console.log(item);

  const { key, salt } = hashPasswd(newUser.password);

  res.json({
    status: 200,
  });
});

api.post('/local', (req, res, next) => {});

module.exports = {
  registerPassport,
  loginApi: api,
};
