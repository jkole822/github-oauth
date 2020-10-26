const express = require("express");
const Data = require("../models/data");
const router = new express.Router();

const authCheck = (req, res, next) => {
	if (!req.user) {
		res.redirect("/auth/login");
	} else {
		next();
	}
};

// POST New Data Object Associated with User
router.post("/data", authCheck, async (req, res) => {
	const data = new Data({
		...req.body,
		owner: req.user._id,
	});

	try {
		await data.save();
		res.status(201).send(data);
	} catch (e) {
		res.status(400).send(e);
	}
});

// GET Multiple Data Objects Filtered by Query String
router.get("/data", authCheck, async (req, res) => {
	const sort = {};

	if (req.query.sortBy) {
		const parts = req.query.sortBy.split(":");
		sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
	}

	try {
		await req.user
			.populate({
				path: "data",
				options: {
					limit: parseInt(req.query.limit),
					skip: parseInt(req.query.skip),
					sort,
				},
			})
			.execPopulate();
		res.send(req.user.data);
	} catch (e) {
		res.status(500).send();
	}
});

// GET Specific Data Object
router.get("/data/:id", authCheck, async (req, res) => {
	const _id = req.params.id;

	try {
		const data = await Data.findOne({ _id, owner: req.user._id });

		if (!data) {
			return res.status(404).send();
		}

		res.send(data);
	} catch (e) {
		res.status(500).send();
	}
});

// Update Specific Data Object
router.patch("/data/:id", authCheck, async (req, res) => {
	const _id = req.params.id;
	const change = req.body;
	const owner = req.user._id;

	const updates = Object.keys(change);
	const allowedUpdates = ["information"];
	// Overkill for one property but retained for multiple properties to be added later.
	const isValidOperation = updates.every(update =>
		allowedUpdates.includes(update)
	);

	if (!isValidOperation) {
		return res.status(400).send({ error: "Invalid updates" });
	}

	try {
		const data = await Data.findOne({ _id, owner });

		if (!data) {
			return res.status(404).send();
		}

		updates.forEach(update => (data[update] = change[update]));
		await data.save();
		res.send(data);
	} catch (e) {
		res.status(500).send();
	}
});

// Delete Specific Data Object
router.delete("/data/:id", authCheck, async (req, res) => {
	const _id = req.params.id;
	const owner = req.user._id;

	try {
		const data = await Data.findOneAndDelete({ _id, owner });

		if (!data) {
			return res.status(404).send();
		}

		res.send(data);
	} catch (e) {
		res.status(500).send();
	}
});

module.exports = router;
