module.exports = app => {
	app.get("/profile", (req, res) => {
		res.render("profile", { user: req.user });
	});
};
