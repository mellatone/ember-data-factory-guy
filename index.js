/*jshint node: true */
'use strict';
var fs = require('fs');
var path = require('path');
var mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');

module.exports = {
  name: 'ember-data-factory-guy',

  treeForVendor: function() {
    var files = [];

    var urijsPath = path.dirname(require.resolve('urijs'));
    files.push(new Funnel(urijsPath, {
      files: [
        'URI.js',
      ],
      destDir: 'urijs'
    }));

    return mergeTrees(files);
  },

  treeForApp(appTree) {
    var trees = [ appTree ];

    try {
      if (fs.statSync('tests/factories').isDirectory()) {
        var factoriesTree = new Funnel('tests/factories', {
          destDir: 'tests/factories'
        });
        trees.push(factoriesTree);
      }
    } catch (err) {
      // do nothing;
    }


    return mergeTrees(trees);
  },

  included: function(app) {
    this._super.included(app);
    this.app = app;

    // need to load mockjax in development and test environment since ember tests
    // can be run from browser in development mode
    if (app.tests) {
      app.import(path.join(app.bowerDirectory, 'jquery-mockjax', 'dist', 'jquery.mockjax.js'));
      app.import(path.join('vendor', 'urijs', 'URI.js'));
    }
  },

  treeFor: function(name) {
    if (this.app.tests) {
      return this._super.treeFor.apply(this, arguments);
    }
  }
};
