var fs = require("fs"),
    ejs = require("ejs"),
    Index = require("./Index");

// Write the tag files
Index.prototype.writeTags = function(opt, callback) {

	var tplDir = opt.directories.templates;
	var tagDir = opt.directories.tags;
	var tagConf = opt.tags;
	var prop = opt.properties;
	var c = this.collection;
	var tags = Object.keys(this.tags);

	if (!callback)
		callback = function(){};

	fs.readFile(tplDir + "/" + tagConf.template, "utf8", function(err, data) {
		if (err) throw err;

		var todo = tags.length;
		var opt = { sort: tagConf.sort };

		// For every tag
		tags.forEach(function(tag) {

			// Add the title of the tag to the properties
			prop.title = tag;

			// Find docs with this tag
			c.find({ tags: tag }).toArray(function(err, docs) {
				if (err) throw err;

				// Add docs
				prop.__docs = docs;

				// Render with ejs
				var tagFile = ejs.render(data, { locals: prop });
				var tagFilename = tagDir + "/" + tag + ".html";

				// Write the file
				fs.writeFile(tagFilename, tagFile, function(err) {
					if (err) throw err;

					console.log("  " + tagFilename + " written.");

					if (!--todo)
						callback();
				});
			});
		});
	});
};
