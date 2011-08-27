var Index = require("../");

var dbinf = {
		host: "localhost",
		port: 27017,
		name: "index",
		collection: "pages"
};

var opt = {
	directories: {
		output: "pub",
		templates: "tpl"
	},
	indexes: [
		{
			title: "Blog",
			pattern: /\/\d\/[^\/]+/,
			path: {
				first: "index.html",
				pattern: "index-{{page}}.html"
			},
			template: "index.tpl",
			limit: 2,
			sort: [["date", "desc"]]
		},
		{
			title: "Blog",
			path: "feed.xml",
			template: "atom.tpl",
			limit: 8,
			sort: [["date", "desc"]]
		}
	],
	properties: {
		siteTitle: "My Site"
	}
};

new Index(dbinf, function(index) {

	var olderdate = new Date();

	// Normal data
	index.add({
		_id: "/1/normal1.html",
		date: (new Date()).toISOString()
	});

	// Without date
	index.add({
		_id: "/2/nodate.html",
	});

	// With older date
	index.add({
		_id: "/3/olderdate.html",
		date: olderdate.toISOString()
	});

	// Normal data
	index.add({
		_id: "/4/normal2.html",
		date: (new Date()).toISOString()
	});

	index.write(opt);
});
