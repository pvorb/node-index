var fs = require("fs"),
    ejs = require("ejs"),
    Index = require("./Index");

var end = function(db) {
	db.close(function() {
		console.log("Database connection closed.");
	});
};

// Index.write
Index.prototype.write = function(opt) {

	// Shorthand
	var dir = opt.directories;
	var prop = opt.properties;
	var ind = opt.indexes;

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

			// Set page to 1
			var page = 1;

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

						var filename = dir.output + "/" + index.path;

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
					opt.skip = 0;

					// as long as there are docs left, make another page
					while (opt.skip < count) {
						// find all docs (paginated)
						c.find(query, opt).toArray(function(err, docs) {
							if (err) throw err;

							var p = prop;
							p.__docs = docs;
							p.__page = page;

							var data = ejs.render(template, { locals: p });

							// indexing dir
							var filename = dir.output + "/";

							// the first page has a different file name than the others
							if (page == 1)
								filename += index.path.first;
							else
								filename +=
										index.path.pattern.replace("{{page}}", page);

							// Write the file
							fs.writeFile(filename, data, function(err) {
								if (err) throw err;

								// Log on success
								console.log("  " + filename + " written.");
							});

							// decrease `todo`
							todo -= docs.length;
							if (!todo) end(db);

							// increase page
							page++;
						});

						// increase offset
						opt.skip += index.limit;
					}
				}
			});
		});
	});
};
