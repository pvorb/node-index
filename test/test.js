var Index = require('../');
var async = require('async');

var db = {
  host: 'localhost',
  port: 27017,
  name: 'index',
  collection: 'index'
};

var opt = {
  root: 'pub',

  db: db,

  indexes: [
    {
      pattern: '^/\\d/[^\\/]+$',
      path: {
        first: 'index.html',
        pattern: 'index-{{page}}.html'
      },
      template: 'index.tpl',
      limit: 2,
      sort: [['date', 'desc']],
      properties: {
        title: 'Blog',
      }
    },
    {
      pattern: '^/\\d/[^\\/]+$',
      path: 'feed.xml',
      template: 'atom.tpl',
      limit: 8,
      sort: [['date', 'desc']],
      properties: {
        title: 'Feed',
        id: 'some uuid or another unique string'
      }
    }
  ],
  tags: {
    directory: 'pub/tag',
    template: 'tag.tpl',
    sort: [['date', 'desc']],
    index: {
      path: 'index.html',
      template: 'tag-index.tpl'
    }
  }
};

new Index(opt, function(err, index) {
  if (err)
    throw err;

  var olderdate = new Date();

  // Normal data
  async.series([

    index.add({
      _id: '/1/normal1.html',
      date: (new Date()).toISOString(),
      tags: ['normal']
    }),

    // Without date
    index.add({
      _id: '/2/nodate.html',
      tags: ['date']
    }),

    // With older date
    index.add({
      _id: '/3/olderdate.html',
      date: olderdate.toISOString(),
      tags: ['normal', 'date']
    }),

    // Normal data
    index.add({
      _id: '/4/normal2.html',
      date: (new Date()).toISOString(),
      tags: ['normal']
    }),

    // write indexes
    index.write(function () {}),

    // write tags
    index.writeTags(function () {})

  ], function (err) {
    if (err)
      throw err;
  });
});
