var fs = require("fs"),
    ejs = require("ejs");

var end = function(db) {
	db.close(function() {
		console.log("Database connection closed.");
	});
};

// Index.write
module.exports = function() {

	// Shorthand
	var dir = this.directories;
	var prop = this.properties;
	var ind = this.index;
	var db = this.db;
	var c = this.collection;

	var todo = 0;

	// Count all objects in the collection
	c.count(function(err, count) {
		if (count == 0) return;

		// Walk index definitions
		ind.forEach(function(index) {

			// Increase `todo`
			todo += count;

			// Read the template file
			fs.readFile(dir.templates + "/" + index.template, "utf8",
					function(err, template) {
				if (err) throw err;

				var query = {};
				// Set id pattern
				if (index.pattern)
					query._id = index.pattern;

				// Set sorting option
				var opt = {
					sort: index.sort
				}

				// If limit is set, set it
				if (index.limit)
					opt.limit = index.limit;

				// If `index.path` is an object (we're making multiple files)
				if (typeof index.path === "string") {

					// Find all docs
					c.find(query, opt).toArray(function(err, docs) {
						if (err) throw err;

						// Extend properties by `docs`
						var p = prop;
						p.__docs = docs;

						// Render template
						var data = ejs.render(template, {locals: p });

						var filename = dir.indexing + "/" + index.path;

						// Write the file
						fs.writeFile(filename, data,
								function(err) {
							if (err) throw err;

							// Log on success
							console.log("  " + filename + " written.");
						});

						// decrease `todo`
						todo -= docs.length;
						if (!todo) end(db);
					});
				} else {
					// offset
					var skip = 0;
					var page = 1;

					// As long as there are docs left
					while (skip < count) {

						// find all docs (paginated)
						c.find(query, opt).toArray(function(err, docs) {
							if (err) throw err;

							var p = prop;
							p.__docs = docs;
							p.__page = page;

							var data = ejs.render(template, { locals: p });

							// indexing dir
							var filename = dir.indexing + "/";

							// TODO write to the correct files
							// If it's the first page
							if (page == 1)
								filename += index.path.first;
							else
								filename +=
										index.path.pattern.replace("{{page}}", page);

							// Write the file
							fs.writeFile(filename, data, function(err) {
								if (err) throw err;

								console.log("  " + filename + " written.");
							});

							// decrease `todo`
							todo -= docs.length;
							if (!todo) end(db);
						});

						// increase offset
						skip += index.limit;
						// increase page
						page++;

					}
				}
			});
		});
	});
};
