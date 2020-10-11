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
			function (accessToken, refreshToken, profile, done) {
				const username = profile.username;
				const id = profile.id;
				User.findOne({ username }, function (err, user) {
					if (!user) {
						const newUser = new User({
							id,
							username,
						});

						newUser.save(function (err) {
							if (err) console.log(err);
							newUser.generateAuthToken();
							return done(err, user);
						});
					} else {
						return done(err, user);
					}
				});
			}
		)
	);

	passport.serializeUser((user, done) => done(null, user.id));
	passport.deserializeUser((id, done) => done(null, id));
}

module.exports = intialize;
