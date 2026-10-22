var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('./app_api/models/mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./app_api/routes/index');

var app = express();
app.disable('etag');

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Allow Angular admin app to access the API
app.use('/api', function(req, res, next) {
  res.header(
    'Access-Control-Allow-Origin',
    'http://localhost:4200'
  );

  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );

  res.header(
    'Cache-Control',
    'no-store'
  );

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

app.use('/api', apiRouter);

app.use('/api', function(err, req, res, next) {
  const status = err.status || (err.name === 'ValidationError' || err.code === 11000 ? 400 : 500);
  const message = status === 500 ? 'Internal server error' : err.code === 11000 ? 'Trip code already exists' : err.message;
  res.status(status).json({ message });
});

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error =
    req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
