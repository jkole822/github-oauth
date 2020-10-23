const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/user");

function intialize(passport) {
	passport.use(
		new GitHubStrategy(
			{
				clientID: process.env.GITHUB_CLIENT_ID,
				clientSecret: process.env.GITHUB_CLIENT_SECRET,
				callbackURL: "/auth/github/redirect",
			},
			async function (accessToken, refreshToken, profile, done) {
				const id = profile.id;
				const username = profile.username;
				const thumbnail = profile._json.avatar_url;

				try {
					let user = await User.findOne({ id });

					if (!user) {
						user = new User({
							id,
							username,
							thumbnail,
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
