const express = require('express');
const passport = require('passport');
const GithubStrategy = require('passport-github').Strategy;
const CustomStrategy = require('passport-custom').Strategy;
const crypto = require('crypto');
const userSchema = require('../schema/user');

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
    new CustomStrategy((req, cb) => {
      cb(null, req.user);
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
  const nameItem = await userSchema.mongo.find({
    $or: [{ username: newUser.username }],
  });
  const emailItem = await userSchema.mongo.find({
    $or: [{ email: newUser.email }],
  });

  if (nameItem.length > 0) {
    res.json({
      status: -1,
      message: 'username is already in use',
    });
  }
  if (emailItem.length > 0) {
    res.json({
      status: -1,
      message: 'email is already in use',
    });
  }

  const { key, salt } = await hashPasswd(newUser.password);

  const newUserItem = new userSchema.mongo({
    ...newUser,
    salt,
    password: key,
    avatar: '/default.png',
  });

  await newUserItem.save();

  req.login(newUserItem, function(err) {
    if (err) { return next(err); }
    res.json({
      status: 200,
    });
  });
});

api.post('/local', async (req, res, next) => {
  const info = req.body;
  const { error, value } = userSchema.loginValidation.validate(info);

  if (error) {
    res.status(422);
    res.json({
      message: error.message,
    });
    return;
  }
  const item = await userSchema.mongo.findOne({
    $or: [{ email: info.email }, { username: info.username }],
  });
  if (!item) {
    res.json({
      status: -1,
      message: 'username or password incorrect',
    });
    return;
  }

  const { key, salt } = await hashPasswd(info.password, item.salt);
  if (key.compare(item.password) !== 0) {
    res.json({
      status: -1,
      message: 'username or password incorrect',
    });
    return;
  }

  req.login(item, function(err) {
    if (err) { return next(err); }
    res.json({
      status: 200,
    });
  });
});

module.exports = {
  registerPassport,
  loginApi: api,
};