const express = require('express');
const passport = require('passport');
const GithubStrategy = require('passport-github').Strategy;
const CustomStrategy = require('passport-custom').Strategy;
const crypto = require('crypto');
const student = require('../schema/student.js');
const teacher = require('../schema/teacher.js');
const teacherUser = require('../schema/teacherUser.js');
const studentUser = require('../schema/studentUser.js');
const permissions = require('./permissions');
const { signupValidation, loginValidation } = require('../validation/user');

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
          '.glitch.me/api/auth/github/return',
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
    // authentication middleware
    console.log(req.path, req.query);
    console.log(permissions);
    if (req.path in permissions && permissions[req.path].length > 0) {
      if (!(req.isAuthenticated() && req.user)) {
        res.status(401);
        res.json({
          message: 'user not login',
        });
      }
      if (!permissions[req.path].includes(req.user.type)) {
        res.status(401);
        res.json({
          message: 'permission denied',
        });
      }
      return next();
    }
    return next();
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

api.get('/user', (req, res, next) => {
  res.json({
    status: 200,
    data: req.user,
  });
});

api.post('/signup', async (req, res, next) => {
  const newUser = req.body;
  const { error, value } = signupValidation.validate(newUser);

  if (error) {
    res.status(422);
    res.json({
      message: error.message,
    });
    return;
  }

  let accountItem;
  if (identity === 'student') {
    accountItem = await student.findOne({ student_id: newUser.username });
    if (!accountItem) {
      res.json({
        status: -1,
        message: 'cannot find student info associated with ' + username,
      });
      return;
    }
  } else {
    accountItem = await teacher.findOne({ teacher_id: newUser.username });
    if (!accountItem) {
      res.json({
        status: -1,
        message: 'cannot find teacher info associated with ' + username,
      });
      return;
    }
  }

  const { key, salt } = await hashPasswd(newUser.password);

  const newAccount = {
    username: accountItem._id,
    password: key,
    salt,
  };
  const userItem = await (newUser.identity === 'teacher'
    ? teacherUser
    : studentUser
  ).create(newAccount);

  req.login(
    { ...accountItem, username: newUser.username, type: newUser.identity },
    function (err) {
      if (err) {
        return next(err);
      }
      res.json({
        status: 200,
      });
    }
  );
});

api.post('/local', async (req, res, next) => {
  const info = req.body;
  const { error, value } = loginValidation.validate(info);

  if (error) {
    res.status(422);
    res.json({
      message: error.message,
    });
    return;
  }

  let userItem;
  let accountItem = {};
  if (info.identity === 'student') {
    accountItem = await student.findOne({ student_id: info.username });
    if (!userItem) {
      res.json({
        status: -1,
        message: 'username or password incorrect',
      });
      return;
    }
    userItem = await studentUser.findOne({
      username: accountItem._id,
    });
  } else if (info.identity === 'teacher') {
    accountItem = await teacher.findOne({ teacher_id: info.username });
    if (!userItem) {
      res.json({
        status: -1,
        message: 'username or password incorrect',
      });
      return;
    }
    userItem = await teacherUser.findOne({
      username: accountItem._id,
    });
  } else if (info.identity === 'admin') {
    if (
      info.username === process.env.ADMIN_NAME &&
      info.password === process.env.ADMIN_PASS
    ) {
      userItem = {
        type: 'admin',
      };
    }
  }

  if (!userItem) {
    res.json({
      status: -1,
      message: 'username or password incorrect',
    });
    return;
  }

  if (info.identity !== 'admin') {
    const { key, salt } = await hashPasswd(info.password, userItem.salt);
    if (key.compare(userItem.password) !== 0) {
      res.json({
        status: -1,
        message: 'username or password incorrect',
      });
      return;
    }
  }

  // TODO: add student/teacher info
  req.login(
    {
      ...accountItem,
      username: info.username,
      type: info.identity,
    },
    function (err) {
      if (err) {
        return next(err);
      }
      res.json({
        status: 200,
      });
    }
  );
});

api.get('/logoff', function (req, res) {
  if (req.logout) {
    req.logout(() => {});
  } else {
    req.session.destroy();
  }
  res.end();
  // res.redirect('/');
});

module.exports = {
  registerPassport,
  loginApi: api,
};
