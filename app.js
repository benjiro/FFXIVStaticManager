var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config/settings');
var mongoose = require('mongoose');
var app = module.exports = express();
var router = express.Router();
var routes = {};

routes.user = require('./routes/user');
routes.loot = require('./routes/loot');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  next();
});

mongoose.connect(config.db);

app.post('/loot', routes.user.verify, routes.loot.create);
app.get('/loot', routes.loot.all);
app.get('/loot/:id', routes.loot.find);
app.put('/loot/:id', routes.user.verify, routes.loot.update);
app.delete('/loot/:id', routes.user.verify, routes.loot.delete);

app.post('/user', routes.user.create);
app.get('/user/:id', routes.user.findById);
app.get('/user', routes.user.all);
app.get('/me', routes.user.verify, routes.user.me);
app.post('/auth', routes.user.authenticate);
app.put('/user/:id', routes.user.verify, routes.user.update);
app.delete('/user/:id', routes.user.verify, routes.user.delete);
