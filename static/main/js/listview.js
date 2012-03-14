$(function () {

var render = pyradmin.templates.render;
var settings = pyradmin.settings;
var Range = pyradmin.Range;
var xhr = pyradmin.xhr;
var Model = pyradmin.model.Model;

var PaginatedListView = Backbone.View.extend({

  initialize: function(options) {
    this.list = new ListView({
    	modelId: this.options.modelId
    });
    this.pagination = new PaginationControls();
  },

  render: function() {
    render(this.$el, '/paginatedlist.ejs', {});

    this.list.setElement(this.$('.list'));
    this.list.render();
    this.pagination.setElement(this.$('.pagination'));
    this.pagination.render();

    this.pagination.on("change", _.bind(this.navigate, this));

    return this;
  },

  navigate: function(range) {
    this.list.setRange(range);
  }
});

var ListView = Backbone.View.extend({

	fetchItems: function (range, cb) {
		xhr.load(
			settings.paths.models + '/' + this.options.modelId,
			range, null, _.bind(cb, this));
	},

	setRange: function(range) {
			this.fetchItems(range, function(err, result) {
      if (err) {
        console.log(err);
        alert('ooops!');
      } else {
        var model = Model.parse(result.meta.model);
        render(this.$el, '/model.ejs', {
          model: model,
          data: result.data
        });
      }
		});
  },

  render: function() {
		this.setRange(Range.fromQuery());
    return this;
  }
});

var PaginationControls = Backbone.View.extend({
  events: {
    'click .previous':  'prev',
    'click .next':      'next'
  },

  initialize: function() {
    this.range = Range.fromQuery();
  },

  render: function() {
    render(this.$el, '/pagination.ejs', {});
    return this;
  },

  prev: function() {
    this.range = this.range.prev();
    pyradmin.router.navigateRange(this.range);
    this.trigger("change", this.range);
  },

  next: function() {
    this.range = this.range.next();
    pyradmin.router.navigateRange(this.range);
    this.trigger("change", this.range);
  }
});

window.pyradmin = window.pyradmin || {};
window.pyradmin.ListView = ListView;
window.pyradmin.PaginatedListView = PaginatedListView;
window.pyradmin.PaginationControls = PaginationControls;

});
