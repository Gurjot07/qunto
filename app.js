let createError = require("http-errors");
let express = require("express");
let mongoose = require("mongoose"); // orm for mongodb say wrapper
let path = require("path");
let session = require("express-session")
let cookieParser = require("cookie-parser");
let logger = require("morgan"); // to log url hit address jihda coloured jha aunda console ch etc
let ejs = require("ejs"); // template engine
let flash = require("connect-flash"); // to send messages on redirect
let moment = require("moment"); // time manipulation liabrary fromnow() used

let app = express();

// required routes to different files and added below like this app.use("/", indexRouter);
let indexRouter = require("./routes/index");
let usersRouter = require("./routes/users");
let questionsRouter = require("./routes/questions");
let searchRouter = require("./routes/search");

mongoose.connect("mongodb://localhost/qunto", { useNewUrlParser: true });
let db = mongoose.connection;
db.on("error", err => {
  console.log(err);
});
db.once("open", () => {
  console.log("database connected");
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(require("body-parser").json());
app.use(
 session({
    secret: "session secret key",
    resave: true,
    saveUninitialized: true
  })
);
app.use(flash());
//setting locals to check user is auth is not in view engine
app.use(function(req, res, next) {
  res.locals.userji = req.session.user;
  // res.locals.authenticated = ! req.user.anonymous;
  next();
});
app.locals.fromNow = function(date) {
  return moment(moment(Number(date)).format()).fromNow();
};

// here is routing added
app.use("/", indexRouter);
app.use("/", usersRouter);
app.use("/search", searchRouter);
app.use("/questions", questionsRouter);

let port = 3000
app.listen(port,()=>{ console.log("server is running on",port);
})
module.exports = app;
