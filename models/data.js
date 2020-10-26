const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
	{
		information: {
			type: String,
			required: true,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
	},
	{ timestamps: true }
);

const Data = mongoose.model("data", dataSchema);

module.exports = Data;
