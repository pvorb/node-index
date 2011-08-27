var mongodb = require("mongodb");

var MongoDB = mongodb.Db,
    MongoServer = mongodb.Server;

// Init the database connection
function Index(opt, callback) {

	var instance = this;

	// Save params
	instance.opt = opt;

	// Init db connection
	var server = new MongoServer(opt.host, opt.port);
	var dbConnector = new MongoDB(opt.name, server);
	dbConnector.open(function (err, db) {
		// Throw errors
		if (err) throw err;

		console.log("Database connection established.");

		// Store db object
		instance.db = db;

		// Get db collection
		db.collection(opt.collection, function(err, c) {
			// Throw errors
			if (err) throw err;

			// Drop it
			c.drop();

			console.log("Dropped collection '" + opt.collection + "'.");

			// Create the collection
			db.createCollection(opt.collection, function(err, c) {
				// Throw errors
				if (err) throw err;

				console.log("Created collection '" + opt.collection + "'.");

				// Save collection pointer
				instance.collection = c;

				// Create index "date"
				c.createIndex({ date: -1 }, { unique: false }, function(err, index){
					// Throw errors
					if (err) throw err;

					// Call the callback when the index has been created
					callback(instance);
				});
			});
		});
	});

	return instance;
};

module.exports = Index;
