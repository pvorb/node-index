var Index = require('../');

var db = {
  host: 'localhost',
  port: 27017,
  name: 'test',
  collection: 'test'
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

var globals = {
  siteTitle: 'My Site'
};

new Index(opt, function(err, index) {
  if (err)
    throw err;

  // set globals
  index.properties = globals;
  var olderdate = new Date();

  var todo = 4;

  function cb(err, res) {
    if (err)
      throw err;
    else {
      if (!--todo) {
        // write indexes
        index.writeIndex(function (err) {
          if (err) throw err;
        }),

        // write tags
        index.writeTags(function (err) {
          if (err) throw err;
        });
      }
    }
  }

  // Normal data
  index.add({
    _id: '/1/normal1.html',
    date: (new Date()).toISOString(),
    tags: ['normal']
  }, cb);

  // Without date
  index.add({
    _id: '/2/nodate.html',
    tags: ['date']
  }, cb);

  // Update record
  index.add({
    _id: '/2/nodate.html',
    title: 'some title'
  }, cb);

  // With older date
  index.add({
    _id: '/3/olderdate.html',
    date: olderdate.toISOString(),
    tags: ['normal', 'date']
  }, cb);

  // Normal data
  index.add({
    _id: '/4/normal2.html',
    date: (new Date()).toISOString(),
    tags: ['normal']
  }, cb);
});
