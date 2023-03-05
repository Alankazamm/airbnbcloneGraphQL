const mongoose = require("mongoose");

const MSchema = mongoose.Schema;

const hostSchema = MSchema({
	name: String,
	rating: Number,
	superHost: Boolean,
});

module.exports = mongoose.model("Host", hostSchema);