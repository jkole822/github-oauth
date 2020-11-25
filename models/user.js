const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	id: String,
	username: String,
});

mongoose.model("users", userSchema);
