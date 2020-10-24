const router = require("express").Router();
const passport = require("passport");

router.get("/login", (req, res) => {
	res.render("login", { user: req.user });
});

router.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/");
});

// Send request to authenticate with google.
// Upon successfully authenticating, google will provide a code
// back to the application
router.get(
	"/google",
	passport.authenticate("google", {
		scope: ["profile"],
	})
);

// passport.authenticate('google') exchanges code received from initial call
// to passport.authenticate('google') for information about the user.
// Callback function inside Google Strategy will fire before the callback of
// route handler below.
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
	res.redirect("/profile");
});

router.get("/facebook", passport.authenticate("facebook"));

router.get(
	"/facebook/redirect",
	passport.authenticate("facebook"),
	(req, res) => {
		res.redirect("/profile");
	}
);

router.get(
	"/github",
	passport.authenticate("github", {
		scope: ["profile"],
	})
);

router.get("/github/redirect", passport.authenticate("github"), (req, res) => {
	res.redirect("/profile");
});

module.exports = router;
