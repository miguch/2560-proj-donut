const express = require('express');
const app = express();
const { registerPassport, loginApi } = require('./modules/login');

app.use(express.json());

registerPassport(app);

app.get('/logoff',
  function(req, res) {
    req.session.destroy();
    res.redirect('/');
  }
);

app.use('/login', loginApi);

app.use('/user', (req, res, next) => {
  const user = {...req.user}
  if (user.photos?.length > 0) {
    user.avatar = user.photos[0].value
  }
  if (user.emails?.length > 0) {
    user.email = user.emails[0].value
  }
  res.json(user);
});

//define your routes here. don't forget about error handling
app.get('/', function (request, response) {
  response.json({
    message: 'Test',
  });
});

app.all('*', (req, res) => {
  res.status(404);
  res.send('not found');
});

// global error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('server error, please try again later');
});

// listen for requests :)
const listener = app.listen(
  parseInt(process.env.PORT || 3000) + 1,
  function () {
    console.log('Your app is listening on port ' + listener.address().port);
  }
);
