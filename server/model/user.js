const mongoose = require("mongoose");

const MSchema = mongoose.Schema;

const userSchema = MSchema({
	name: String,
	email: String,
	password: String,
	city: String,
});

module.exports = mongoose.model("User", userSchema);
