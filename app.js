var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const session = require("express-session");
const passport = require("passport");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const configurePassport = require("./config/passport");


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var hotelsRouter = require('./routes/hotels');
var roomsRouter = require('./routes/rooms');
const authRouter = require("./routes/auth");

const db = require('./models');

const sessionStore = new SequelizeStore({
  db: db.sequelize,
});

configurePassport(passport, db);

var app = express();

app.use(
  '/bootstrap',
  express.static(path.join(__dirname, 'node_modules/bootstrap/dist'))
);


db.sequelize.sync({ force: false });
sessionStore.sync();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is missing from .env");
}

app.use(
  session({
    name: "hotel.sid",
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user || null;
  next();
});

app.use("/", authRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/hotels', hotelsRouter);
app.use('/rooms', roomsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
