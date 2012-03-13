$(function () {

var render = pyradmin.templates.render;
var settings = pyradmin.settings;
var Range = pyradmin.Range;
var xhr = pyradmin.xhr;
var Model = pyradmin.model.Model;

var PaginatedListView = Backbone.View.extend({

  initialize: function(options) {
    this.list = new ListView({
    	collection: this.collection,
    	modelName: this.options.modelId
    });
    this.pagination = new PaginationControls();
  },

  render: function() {
    // TODO: move to template
    var list = this.make("div", {"class": "list"});
    var pagination = this.make("div", {"class": "pagination"});

    this.$el.append(list);
    this.$el.append(pagination);

    this.list.setElement(list);
    this.list.render();

    this.pagination.setElement(pagination);
    this.pagination.render();
    return this;
  }
});

var ListView = Backbone.View.extend({

	fetchItems: function (modelPath, cb) {
		var url = settings.paths.models + modelPath;
		var range = Range.fromQuery();

	},

  render: function() {
		var range = Range.fromQuery();
  	this.fetchItems(
  		settings.paths.models + '/' + this.options.modelId,
			range, null, 
			_.bind(function(err, result) {
				if (err)
				{
					console.log(err);
					alert('ooops');
				}
				else
				{
					var model = Model.parse(result.meta.model);
					render(this.$el, '/model.ejs', {
						fields: model,
						rows: result.data
					});
				}
		}, this));
    return this;
  }
});

var PaginationControls = Backbone.View.extend({
  events: {
    "click .previous":  "prev",
    "click .next":      "next",
  },

  render: function() {
    render(this.$el, '/pagination.ejs', {});
    return this;
  },

  prev: function() {
    console.log("prev");
  },

  next: function() {
    console.log("next");
  }
});

window.pyradmin = window.pyradmin || {};
window.pyradmin.ListView = ListView;
window.pyradmin.PaginatedListView = PaginatedListView;
window.pyradmin.PaginationControls = PaginationControls;

});
