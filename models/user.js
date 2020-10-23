const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
		unique: true,
	},
	username: {
		type: String,
		required: true,
	},
	thumbnail: String,
});

const User = mongoose.model("user", userSchema);

module.exports = User;
