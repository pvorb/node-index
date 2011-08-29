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
		tags: "pub/tag",
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
	tags: {
		template: "tag.tpl",
		sort: [["date", "desc"]],
		index: {
			path: "index.html",
			template: "tag-index.tpl"
		}
	},
	properties: {
		siteTitle: "My Site"
	}
};

new Index(dbinf, function(index) {

	var olderdate = new Date();

	// Normal data
	index.add({
		_id: "/1/normal1.html",
		date: (new Date()).toISOString(),
		tags: ["normal"]
	});

	// Without date
	index.add({
		_id: "/2/nodate.html",
		tags: ["date"]
	});

	// With older date
	index.add({
		_id: "/3/olderdate.html",
		date: olderdate.toISOString(),
		tags: ["normal", "date"]
	});

	// Normal data
	index.add({
		_id: "/4/normal2.html",
		date: (new Date()).toISOString(),
		tags: ["normal"]
	});

	index.write(opt);
	index.writeTags(opt);
});
