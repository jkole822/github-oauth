require("dotenv").config();
require("./database/mongoose");

const express = require("express");
const app = express();
const passport = require("passport");
const cookieSession = require("cookie-session");

const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-routes");
const passportGoogle = require("./config/passport-google");
const passportFacebook = require("./config/passport-facebook");
const passportGithub = require("./config/passport-github");

app.set("view engine", "ejs");

// Session stores user information for 30 minutes
app.use(
	cookieSession({
		keys: [process.env.SESSION_SECRET],
		maxAge: 1000 * 60 * 30,
	})
);

app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

passportGoogle(passport);
passportFacebook(passport);
passportGithub(passport);

app.get("/", (req, res) => {
	res.render("home", { user: req.user });
});

app.listen(3000, () => {
	console.log("App listening on port 3000");
});
