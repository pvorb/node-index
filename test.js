var isodate = require("isodate"),
    Index = require("./");

var dbinf = {
	host: "localhost",
	port: 27017,
	name: "index",
	collection: "pages"
};

var conf = {
	index: {
		filename: {
			first: "index.html",
			pattern: "index/{num}.html"
		},
		template: "index.tpl",
		limit: 8
	},
	feed: {
		filename: "feed.xml",
		template: "atom.tpl",
		limit: 8
	}
};

new Index(dbinf, conf, function(index) {
	// Normal data
	index.add({
		__path: "/hello/world.html",
		date: (new Date()).toISO8061()
	});

	// Without date
	index.add({
		__path: "/hello/world2.html",
	});

	// Without __path
	//	index.add

	index.write();
});
