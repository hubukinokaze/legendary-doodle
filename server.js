const express = require('express');
const bodyParser = require('body-parser');
const crypto = require("crypto");

const app = express();
const Pusher = require('pusher');


// START HEROKU
const path = require('path');

// to serve our JavaScript, CSS and index.html
app.use(express.static('./dist/'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// END HEROKU

// CORS
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

const pusher = new Pusher({
  appId: '1289350',
  key: '154a62cc2ce29c96ffbc',
  secret: 'ddce1415d2fd500a1866',
  cluster: 'us3',
  useTLS: true
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/pusher/auth', function(req, res) {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const username = req.body.username;
  const presenceData = {
    user_id: crypto.randomBytes(16).toString("hex"),
    user_info: {
      username: username,
      channel: channel
    }
  };
  const auth = pusher.authenticate(socketId, channel, presenceData);
  res.send(auth);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening at http://localhost:', port));
