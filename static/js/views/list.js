define(function(require, exports, module) {

	var settings = require('settings');
	var range = require('range');
	var templates = require('templates');
	var xhr = require('xhr');
	var model = require('model');
	var main = require('main');

	var PaginatedListView = Backbone.View.extend({

		initialize: function(options) {
			this.list = new ListView({modelId: this.options.modelId});
			this.pagination = new PaginationControls();
		},

		render: function() {
			this.list.render();
			this.pagination.render();
			this.pagination.on("change", _.bind(this.navigate, this));

			this.$el.append(this.list.$el);
			this.$el.append(this.pagination.$el);
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
					var m = model.Model.parse(result.meta.model);
					templates.render(this.$el, '/list.ejs', {
						model: m,
						data: result.data
					});
				}
			});
		},

		render: function() {
			this.setRange(range.Range.fromQuery());
			return this;
		}
	});

	var PaginationControls = Backbone.View.extend({
		events: {
			'click .previous':  'prev',
			'click .next':      'next'
		},

		initialize: function() {
			this.range = range.Range.fromQuery();
		},

		render: function() {
			templates.render(this.$el, '/pagination.ejs', {});
			return this;
		},

		prev: function() {
			this.range = this.range.prev();
			main.router.navigateRange(this.range);
			this.trigger("change", this.range);
		},

		next: function() {
			this.range = this.range.next();
			main.router.navigateRange(this.range);
			this.trigger("change", this.range);
		}
	});

	return {PaginatedListView: PaginatedListView};

});
