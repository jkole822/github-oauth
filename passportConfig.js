const User = require("./models/user");
const GitHubStrategy = require("passport-github2").Strategy;

function intialize(passport) {
	passport.use(
		new GitHubStrategy(
			{
				clientID: process.env.GITHUB_CLIENT_ID,
				clientSecret: process.env.GITHUB_CLIENT_SECRET,
				callbackURL: "http://localhost:3000/auth/github/callback",
			},
			async function (accessToken, refreshToken, profile, done) {
				const id = profile.id;
				const username = profile.username;

				try {
					let user = await User.findOne({ id });

					if (!user) {
						user = new User({
							id,
							username,
						});

						await user.save();
						user.generateAuthToken();
						return done(null, user);
					}

					return done(null, user);
				} catch (e) {
					console.log(e);
				}
			}
		)
	);

	passport.serializeUser((user, done) => done(null, user.id));
	passport.deserializeUser((id, done) => done(null, id));
}

module.exports = intialize;
