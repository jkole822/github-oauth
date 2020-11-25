const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const passport = require("passport");

mongoose.connect(process.env.MONGODB_URL);

require("./models/user");
require("./services/passport/facebook");
require("./services/passport/github");
require("./services/passport/google");

app.set("view engine", "ejs");

// Session stores user information for 30 minutes
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
	cookieSession({
		keys: [process.env.SESSION_SECRET],
		maxAge: 1000 * 60 * 30,
	})
);

app.use(passport.initialize());
app.use(passport.session());

require("./routes/auth-routes")(app);
require("./routes/profile-routes")(app);

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
