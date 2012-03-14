$(function () {

var render = pyradmin.templates.render;
var settings = pyradmin.settings;
var Range = pyradmin.Range;
var xhr = pyradmin.xhr;
var Model = pyradmin.model.Model;
var form = pyradmin.form;

var ItemView = Backbone.View.extend({
	events: {
		'click .saveBtn': 'save',
		'click .cancelBtn': 'cancel'
	},

	initialize: function(options) {
		this.item = new ItemFieldsView({
			modelId: this.options.modelId,
			itemId: this.options.itemId
		});
	},

	render: function() {
		// TODO: move to template
		var item = this.make('div', {'class': 'item'});

		this.item.setElement(item);

		var self = this;
		this.item.render(function () {
			self.$el.html('');
			self.$el.append(item);
		});

		return this;
	},

	save: function () {
		var self = this;
		var url = settings.paths.models + '/' + this.options.modelId + '/' + this.options.itemId;
		var data = form.collectData(this.item.model, this.item.form);
		xhr.send('PUT', url, data, function (err, result) {
			if (err != null)
			{
				alert('error');
				self.render();
			}
		});
		return false;
	},

	cancel: function () {
		this.render();
		return false;
	}
});

var ItemFieldsView = Backbone.View.extend({

	fetchItem: function (cb) {
	    xhr.load(
	  		settings.paths.models + '/' + this.options.modelId + '/' + this.options.itemId,
				null, null, _.bind(cb, this));
	},

	render: function(cb) {
		this.fetchItem(function(err, result) {
			if (err)
			{
				console.log(err);
				alert('ooops');
			}
			else
			{
				this.model = Model.parse(result.meta.model);
				render(this.$el, '/item.ejs', {
					model: this.model,
					data: result.data
				});
				this.form = $(this.$el, 'form');
			}

			if (cb != null)
			{
				cb();
			}
		});
		return this;
	}
});

window.pyradmin = window.pyradmin || {};
window.pyradmin.ItemView = ItemView;
window.pyradmin.ItemFieldsView = ItemFieldsView;

});
