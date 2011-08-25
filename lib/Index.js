var mongodb = require("mongodb"),
    add = require("./Index.add"),
    write = require("./Index.write");

var MongoDB = mongodb.Db,
    MongoServer = mongodb.Server;

// Init the database connection
function Index(dbinf, conf, cb) {

	var instance = this;

	// Validate dbinf
	if (typeof dbinf !== "object")
		throw new Error("dbinf must be an object");

	// Save connection information
	instance.dbinf = dbinf;

	// Validate conf
	if (typeof conf === "string")
		conf = JSON.parse(conf);
	if (typeof conf !== "object")
		throw new Error("conf must be a valid configutation object");

	// Save configuration
	instance.conf = conf;

	// Init db connection
	var server = new MongoServer(dbinf.host, dbinf.port);
	var dbConnector = new MongoDB(dbinf.name, server);
	dbConnector.open(function (err, db) {
		// Throw errors
		if (err) throw err;

		console.log("Database connection established.");

		// Store db object
		instance.db = db;

		// Get db collection
		db.collection(dbinf.collection, function(err, c) {
			// Throw errors
			if (err) throw err;

			// Drop it
			c.drop();

			console.log("Dropped collection '" + dbinf.collection + "'.");

			// Create the collection
			db.createCollection(dbinf.collection, function(err, c) {
				// Throw errors
				if (err) throw err;

				console.log("Created collection '" + dbinf.collection + "'.");

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
