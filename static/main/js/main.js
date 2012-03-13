$(function () {

var Router = Backbone.Router.extend({
  routes: {
    ':model/':       'list',
    ':model/:id/':   'show'
  },

  list: function(modelId) {
    console.log('route "list":', modelId);
    var view = new pyradmin.PaginatedListView({
    	el: $('#main'),
    	modelId: model
		});
    view.render();
  },

  show: function(model, id) {
    console.log('route "show":', model, id);
  }

});

$(document).ready(function() {
  Backbone.history.start({pushState: true});
});

window.pyradmin = window.pyradmin || {};
window.pyradmin.router = new Router();

});
