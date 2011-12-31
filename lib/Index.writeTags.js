var fs = require("fs"),
    ejs = require("ejs"),
    clone = require("clone"),
    esc = require("esc"),
    Index = require("./Index"),
    parseDate = require("./parse-dates");

// Write the tag files
Index.prototype.writeTags = function(opt, callback) {

  var tplDir = opt.directories.templates;
  var tagDir = opt.directories.tags;
  var tagConf = opt.tags;
  var prop = opt.properties;
  var c = this.collection;
  var tags = Object.keys(this.tags);

  // one more because of tag index
  var todo = tags.length + 1;

  // Read tag template
  fs.readFile(tplDir + "/" + tagConf.template, "utf8", function(err, tpl) {
    if (err) throw err;

    var opt = { sort: tagConf.sort };

    // For every tag
    tags.forEach(function(tag) {

      // make local copy
      var p = clone(prop);

      // Add function `esc`
      p.esc = esc;

      // Add the title of the tag to the properties
      p.title = tag;

      // Find docs with this tag
      c.find({ tags: tag }).toArray(function(err, docs) {
        if (err) throw err;

        // Parse dates
        docs = parseDate(docs);

        // Add docs
        p.__docs = docs;

        // Render with ejs
        var tagFile = ejs.render(tpl, { locals: p });

        // New filename
        var tagFilename = tagDir + "/" + tag + ".html";

        // Write the file
        fs.writeFile(tagFilename, tagFile, function(err) {
          if (err) throw err;

          console.log("  " + tagFilename + " written.");

          if (!--todo)
            if (callback)
              callback();
        });
      });
    });
  });

  // Read index template
  fs.readFile(tplDir + "/" + tagConf.index.template, "utf8",
      function(err, tpl) {
    if (err) throw err;

    prop.__tags = tags;

    var indexFile = ejs.render(tpl, { locals: prop });
    var indexFilename = tagDir + "/" + tagConf.index.path;
    fs.writeFile(indexFilename, indexFile, function(err) {
      if (err) throw err;

      console.log("  " + indexFilename + " written.");

      if (!--todo)
        if (callback)
          callback();
    });
  });
};
