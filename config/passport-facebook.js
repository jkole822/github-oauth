const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/user");

function intialize(passport) {
	passport.use(
		new FacebookStrategy(
			{
				clientID: process.env.FACEBOOK_CLIENT_ID,
				clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
				callbackURL: "/auth/facebook/redirect",
			},
			async function (accessToken, refreshToken, profile, done) {
				const id = profile.id;
				const username = profile.displayName;

				try {
					let user = await User.findOne({ id });

					if (!user) {
						user = new User({
							id,
							username,
						});

						await user.save();
						return done(null, user);
					}

					return done(null, user);
				} catch (e) {
					console.log(e);
				}
			}
		)
	);

	passport.serializeUser((user, done) => done(null, user._id));
	passport.deserializeUser(async (_id, done) => {
		const user = await User.findById(_id);
		done(null, user);
	});
}

module.exports = intialize;
