var mongodb = require("mongodb");

var MongoDB = mongodb.Db,
	 MongoServer = mongodb.Server;

bake.index = {};

// Init the database connection
bake.index.init = function(db, conf) {

	// Validate db
	if (typeof db !== "object")
		throw new Error("db must be an object");

	// Validate conf
	if (typeof conf === "string")
		conf = JSON.parse(conf);
	if (typeof conf !== "object")
		throw new Error("conf must be a valid configutation object");

	// Save configuration
	this.conf = conf;

	// Init db connection
	this.server = new MongoServer(host, port);
	var dbConnector = new Db(db.name, db.host, db.port);
	dbConnector.open(function (err, db) {
		// Throw errors
		if (err) throw err;

		console.log("Successfully established connection to the database.");

		// Store db object
		this.db = db;

		// Create the collection
		db.createCollection(this.conf.collection, function(err, c) {
			// Throw errors
			if (err) throw err;

			// Create index "date"
			c.createIndex({ date: -1 }, { unique: false }, function(err, index){
				// Throw errors
				if (err) throw err;
			});

			// Create index "__path"
			c.createIndex({ __path: 1 }, { unique: true },
					function(err, index) {
				// Throw errors
				if (err) throw err;
			});
		});
	});
};

// Add new data to the index
bake.index.add = function(data) {
	// If the db connection is not yet established, try again later
	if (this.db == undefined)
		Timers.setTimeout(this.add, 2000, data);

	// If data is an array apply this function to every element of the array
	else if (typeof data === "array")
		for (var i = 0; i < data.length; i++)
			this.add(data[i]);

	// If data is not an object, throw an error
	else if (typeof data !== "object")
		throw new Error("data must be an object");

	// Go through indexes and create a connection for each
	else {
		this.db.collection(this.conf.collection, function(err, c) {
			// Throw errors
			if (err) throw err;

			// Insert data
			c.insert(data);
		}
	}
};

bake.index.write = function() {

	// If the db connection is not yet established, try again later
	if (this.db == undefined)
		Timers.setTimeout(this.write, 2000);

};

module.exports = bake.index;
