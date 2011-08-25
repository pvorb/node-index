var mongodb = require("mongodb"),
    add = require("./Index.add"),
    write = require("./Index.write");

var MongoDB = mongodb.Db,
    MongoServer = mongodb.Server;

// Init the database connection
function Index(opt, cb) {

	var instance = this;

	// Save params
	instance.directories = opt.directories;
	instance.dbinf = opt.dbinf
	instance.index = opt.index;
	instance.properties = opt.properties;

	// Init db connection
	var server = new MongoServer(opt.dbinf.host, opt.dbinf.port);
	var dbConnector = new MongoDB(opt.dbinf.name, server);
	dbConnector.open(function (err, db) {
		// Throw errors
		if (err) throw err;

		console.log("Database connection established.");

		// Store db object
		instance.db = db;

		// Get db collection
		db.collection(opt.dbinf.collection, function(err, c) {
			// Throw errors
			if (err) throw err;

			// Drop it
			c.drop();

			console.log("Dropped collection '" + opt.dbinf.collection + "'.");

			// Create the collection
			db.createCollection(opt.dbinf.collection, function(err, c) {
				// Throw errors
				if (err) throw err;

				console.log("Created collection '" + opt.dbinf.collection + "'.");

				// Save collection pointer
				instance.collection = c;

				// Create index "date"
				c.createIndex({ date: -1 }, { unique: false }, function(err, index){
					// Throw errors
					if (err) throw err;

					// Call the callback when the index has been created
					cb(instance);
				});
			});
		});
	});

	return instance;
};

// Add methods `add` and `write`
Index.prototype.add = add;
Index.prototype.write = write;

module.exports.Index = Index;
