const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
	{
		id: {
			type: String,
			required: true,
			unique: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
		},
		tokens: [
			{
				token: {
					type: String,
					required: true,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

// Set up virtual relationship; Tasks are not stored in user. Allows Mongoose to relate User to Tasks.
// userSchema.virtual('tasks', {
// 	ref: 'Task',
// 	localField: '_id',
// 	foreignField: 'owner',
// });

// user.toObject() allows for manipulation of the individual user object
// userSchema.methods.toJSON = function () {
// 	const user = this;
// 	const userObject = user.toObject();

// 	delete userObject.tokens;

//     return userObject;
// };

// Methods: for individual instance of user
userSchema.methods.generateAuthToken = async function () {
	const user = this;
	const token = jwt.sign({ _id: user.id.toString() }, process.env.JWT_SECRET);

	user.tokens = user.tokens.concat({ token });
	await user.save();

	return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
