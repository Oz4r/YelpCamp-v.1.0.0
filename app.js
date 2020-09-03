const dotenv         = require('dotenv').config();
const express        = require("express"),
	  app            = express(),
	  mongoose       = require("mongoose"),
	  bodyParser     = require("body-parser"),
	  Campground     = require("./models/campground"),
	  Comment        = require("./models/comment"),
	  passport       = require("passport"),
	  LocalStrategy  = require("passport-local"),
	  User           = require("./models/user"),
	  methodOverride = require("method-override"),
	  flash          = require("connect-flash");

const commentRoutes    = require("./routes/comments"),
	  campgroundRoutes = require("./routes/campgrounds"),
	  indexRoutes      = require("./routes/index");

app.use(methodOverride("_method"));
app.use(require("express-session")({
	secret: "Hamster and elderberries",
	resave:false,
	saveUninitialized:false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
mongoose.set('useUnifiedTopology', true);

// mongoose.connect("mongodb://localhost/YelpCamp", { useNewUrlParser: true });

mongoose.connect("mongoAtlas code",{
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log("Connected to MongoAtlas")
}).catch(err =>{
	console.log("ERROR:", err.message);
});

app.use(express.static(__dirname + "/public"));
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error    = req.flash("error");
	res.locals.success    = req.flash("success");
	next();
});


app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("YelpCamp Server Has Started!")
});