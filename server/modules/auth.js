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
    // authentication & permission middleware
    console.log(req.path, req.query);
    if (req.path in permissions && permissions[req.path].length > 0) {
      if (!(req.isAuthenticated() && req.user)) {
        res.status(401);
        res.json({
          message: 'user not login',
        });
        return;
      }
      if (!permissions[req.path].includes(req.user.type)) {
        res.status(401);
        res.json({
          message: 'permission denied',
        });
        return;
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
  async function (req, res) {
    let userItem, accountItem;
    if (req.session.account) {
      // link the account to GitHub
      const { type, username } = req.session.account;
      if (type === 'student') {
        userItem = await studentUser.findOne({
          _id: req.session.account.account_id,
        });
        accountItem = await student.findOne({
          _id: req.session.account._id,
        });
      } else if (type === 'teacher') {
        userItem = await teacherUser.findOne({
          _id: req.session.account.account_id,
        });
        accountItem = await teacher.findOne({
          _id: req.session.account._id,
        });
      }
      await userItem.update({
        github_id: req.user.id,
      });
      delete req.session.account;
      req.logout(() => {});
    } else {
      userItem = await studentUser.findOne({
        github_id: req.user.id,
      });
      if (userItem) {
        accountItem = await student.findOne({
          _id: userItem.username,
        });
      } else {
        userItem = await teacherUser.findOne({
          github_id: req.user.id,
        });
        if (userItem) {
          accountItem = await teacher.findOne({
            _id: userItem.username,
          });
        }
      }
    }
    if (userItem && accountItem) {
      req.login(
        {
          ...accountItem._doc,
          username: accountItem.student_id || accountItem.teacher_id,
          type: accountItem.student_id ? 'student' : 'teacher',
          github_id: userItem.github_id,
          account_id: userItem._id,
        },
        function (err) {
          if (req.session.returnUrl) {
            res.redirect(req.session.returnUrl);
            delete req.session.returnUrl;
          } else {
            res.redirect('/');
          }
        }
      );
    } else {
      // normal login
      if (req.session.returnUrl) {
        res.redirect(req.session.returnUrl);
        delete req.session.returnUrl;
      } else {
        res.redirect('/');
      }
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

api.get('/github/link', (req, res, next) => {
  if (req.query.r) {
    req.session.returnUrl = req.query.r;
  }
  req.session.account = {
    ...req.user,
  };
  passport.authenticate('github', {
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
  if (!(req.isAuthenticated() && req.user)) {
    res.status(401);
    res.json({
      message: 'user not login',
    });
    return;
  }

  console.log(req.user);
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
  if (newUser.identity === 'student') {
    accountItem = await student.findOne({ student_id: newUser.username });
    if (!accountItem) {
      res.json({
        status: -1,
        message:
          'cannot find student info associated with ID ' + newUser.username,
      });
      return;
    }
    if (
      await studentUser.findOne({
        username: accountItem._id,
      })
    ) {
      res.json({
        status: -1,
        message: 'Student ID already in use',
      });
      return;
    }
  } else {
    accountItem = await teacher.findOne({ teacher_id: newUser.username });
    if (!accountItem) {
      res.json({
        status: -1,
        message:
          'cannot find teacher info associated with ID ' + newUser.username,
      });
      return;
    }
    if (
      await teacherUser.findOne({
        username: accountItem._id,
      })
    ) {
      res.json({
        status: -1,
        message: 'Teacher ID already in use',
      });
      return;
    }
  }

  const { key, salt } = await hashPasswd(newUser.password);

  const newAccount = {
    username: accountItem._id,
    password: key.toString('hex'),
    salt: salt.toString('hex'),
  };
  const userItem = await (newUser.identity === 'teacher'
    ? teacherUser
    : studentUser
  ).create(newAccount);

  req.login(
    {
      ...accountItem._doc,
      username: newUser.username,
      type: newUser.identity,
      github_id: userItem.github_id,
      account_id: userItem._id,
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
    if (!accountItem) {
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
    if (!accountItem) {
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
    const { key, salt } = await hashPasswd(
      info.password,
      Buffer.from(userItem.salt, 'hex')
    );
    if (key.toString('hex') !== userItem.password) {
      res.json({
        status: -1,
        message: 'username or password incorrect',
      });
      return;
    }
  }

  req.login(
    {
      ...accountItem._doc,
      username: info.username,
      type: info.identity,
      github_id: userItem.github_id,
      account_id: userItem._id,
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
