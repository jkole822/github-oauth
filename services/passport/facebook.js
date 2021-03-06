const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const mongoose = require("mongoose");

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
	done(null, user._id);
});

passport.deserializeUser((id, done) => {
	User.findById(id).then(user => done(null, user));
});

passport.use(
	new FacebookStrategy(
		{
			clientID: process.env.FACEBOOK_CLIENT_ID,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
			callbackURL: "/auth/facebook/redirect",
		},
		async (accessToken, refreshToken, profile, done) => {
			const id = profile.id;
			const username = profile.displayName;

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
