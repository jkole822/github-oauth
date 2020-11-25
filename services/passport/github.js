const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const mongoose = require("mongoose");

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id).then(user => done(null, user));
});

passport.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			callbackURL: "/auth/github/redirect",
		},
		async (accessToken, refreshToken, profile, done) => {
			const id = profile.id;
			const username = profile.username;

			const existingUser = await User.findOne({ id });

			if (existingUser) {
				return done(null, existingUser);
			}

			const user = await new User({
				id,
				username,
			}).save();

			done(null, user);
		}
	)
);
