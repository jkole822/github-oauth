const passport = require("passport");

module.exports = app => {
	app.get("/", (req, res) => {
		res.render("home", { user: req.user });
	});

	app.get("/auth/login", (req, res) => {
		res.render("login", { user: req.user });
	});

	app.get("/auth/logout", (req, res) => {
		req.logout();
		res.redirect("/");
	});

	// Send request to authenticate with google.
	// Upon successfully authenticating, google will provide a code
	// back to the application
	app.get(
		"/auth/google",
		passport.authenticate("google", {
			scope: ["profile"],
		})
	);

	// passport.authenticate('google') exchanges code received from initial call
	// to passport.authenticate('google') for information about the user.
	// Callback function inside Google Strategy will fire before the callback of
	// route handler below.
	app.get(
		"/auth/google/redirect",
		passport.authenticate("google"),
		(req, res) => {
			res.redirect("/profile");
		}
	);

	app.get("/auth/facebook", passport.authenticate("facebook"));

	app.get(
		"/auth/facebook/redirect",
		passport.authenticate("facebook"),
		(req, res) => {
			res.redirect("/profile");
		}
	);

	app.get(
		"/auth/github",
		passport.authenticate("github", {
			scope: ["profile"],
		})
	);

	app.get(
		"/auth/github/redirect",
		passport.authenticate("github"),
		(req, res) => {
			res.redirect("/profile");
		}
	);
};
