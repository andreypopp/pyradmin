define(function(require, exports, module) {

	var Range = require('range').Range;
	var main = require('main');
	var render = require('templates').render;
	var settings = require('settings');
	var xhr = require('xhr');
	var Model = require('model').Model;

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
					var model = Model.parse(result.meta.model);
					render(this.$el, '/list.ejs', {
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
