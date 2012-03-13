$(function () {

var settings = pyradmin.settings;
var Range = pyradmin.Range;
var xhr = pyradmin.xhr;
var Model = pyradmin.model.Model;
var render = pyradmin.templates.render;

var dataSlot = $('#data').first();

var showModel = function (modelPath) {
	var url = settings.paths.models + modelPath;
	var range = Range.fromQuery();

	xhr.load(url, range, null, function (err, result) {
		if (err)
		{
			console.log(err);
			alert('ooops');
		}
		else
		{
			var model = Model.parse(result.meta.model);

			render(dataSlot, '/model.ejs', {
				model: model,
				data: result.data
			});
		}
	});
};

showModel('');

});
