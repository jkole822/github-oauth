if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}
require("./database/mongoose");

const express = require("express");
const path = require("path");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const session = require("express-session");
const methodOverride = require("method-override");

const User = require("./models/user");
const initializePassport = require("./passportConfig");
const auth = require("./middleware/auth");

initializePassport(passport);

const publicDirPath = path.join(__dirname, "./public");

app.use(express.static(publicDirPath));
app.use(express.urlencoded({ extended: false }));

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);
app.use(methodOverride("_method"));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", auth, (req, res) => {
	res.sendFile(publicDirPath + "/index.html");
});

// If user is authenticated, proceed with request.
app.get("/login", checkNotAuthenticated, (req, res) => {
	res.sendFile(publicDirPath + "/login.html");
});

// If user is authenticated, proceed with request.
app.get(
	"/auth/github",
	checkNotAuthenticated,
	passport.authenticate("github", {
		failureRedirect: "/login",
	})
);

// If user is authenticated, proceed with request.
app.get(
	"/auth/github/callback",
	checkNotAuthenticated,
	passport.authenticate("github", { failureRedirect: "/login" }),
	function (req, res) {
		res.redirect("/");
	}
);

app.delete("/logout", (req, res) => {
	req.logOut();
	res.redirect("/login");
});

function checkNotAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect("/");
	}
	next();
}

app.listen(3000);
