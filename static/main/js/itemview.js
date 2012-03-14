$(function () {

var render = pyradmin.templates.render;
var settings = pyradmin.settings;
var Range = pyradmin.Range;
var xhr = pyradmin.xhr;
var Model = pyradmin.model.Model;

var ItemView = Backbone.View.extend({

	initialize: function(options) {
		this.item = new ItemFieldsView({
			modelId: this.options.modelId,
			itemId: this.options.itemId
		});
	},

	render: function() {
		// TODO: move to template
		var item = this.make('div', {'class': 'item'});

		this.$el.append(item);

		this.item.setElement(item);
		this.item.render();

		return this;
	}
});

var ItemFieldsView = Backbone.View.extend({

	fetchItem: function (cb) {
	    xhr.load(
	  		settings.paths.models + '/' + this.options.modelId + '/' + this.options.itemId,
				null, null, _.bind(cb, this));
	},

	render: function() {
		this.fetchItem(function(err, result) {
			if (err)
			{
				console.log(err);
				alert('ooops');
			}
			else
			{
				var model = Model.parse(result.meta.model);
				render(this.$el, '/item.ejs', {
					model: model,
					data: result.data
				});
			}
		});
		return this;
	}
});

window.pyradmin = window.pyradmin || {};
window.pyradmin.ItemView = ItemView;
window.pyradmin.ItemFieldsView = ItemFieldsView;

});
