module.exports = function() {

	// Shorthand
	var index = this.conf;
	// Counter for later callbacks
	var count = 0;

	for (var i in index) {
		count++;

		console.log(index[i]);
	}

	this.db.close(function() {
		console.log("Database connection closed.");
	});
};
