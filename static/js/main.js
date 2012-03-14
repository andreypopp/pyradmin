$(function () {

var query = pyradmin.query;

var Router = Backbone.Router.extend({

  routes: {
    ':model/':                'list',
    ':model/?:params':        'list',
    ':model/:id/':            'show'
  },

  list: function(modelId, params) {
    params = this.params(params);
    console.log('route "list":', modelId, params);
    var view = this.getView(modelId, function() {
      return new pyradmin.PaginatedListView({
        el: $('#main'),
        modelId: modelId
      }).render();
    });
  },

	show: function(modelId, id) {
		console.log('route "show":', modelId, id);
		var view = new pyradmin.ItemView({
			el: $('#main'),
			modelId: modelId,
		itemId: id
		});
		view.render();
	},

  initialize: function() {
    this.viewCache = {};
  },

  getView: function() {
    var view;
    var creator = _.last(arguments);
    var args = _.without(arguments, creator);
    var key = this.getViewKey(args);
    view = this.viewCache[key];
    if (view == null) {
      view = creator();
      this.viewCache[key] = view;
    }
    return view;
  },

  getViewKey: function(args) {
    return _.reduce(args, function(a, b) { return a + '/' + b; }, '');
  },

  params: function(params) {
    if (params == null) {
      return {};
    } else {
      return query.parseQuery(params);
    }
  },

  navigateQuery: function(q) {
    this.navigate(window.location.pathname + '?' + query.serializeQuery(q));
  },

  navigateRange: function(range) {
    var q = query.getQuery();
    q.page = range.pageInfo.page;
    this.navigateQuery(q);
  }

});

$(document).ready(function() {
	Backbone.history.start({pushState: true});
});

window.pyradmin = window.pyradmin || {};
window.pyradmin.router = new Router();

});
