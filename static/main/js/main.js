$(function () {

var settings = pyradmin.settings;
var xhr = pyradmin.xhr;
var Model = pyradmin.model.Model;
var render = pyradmin.templates.render;

var dataSlot = $('#data').first();

var showModel = function (modelPath) {
	var url = settings.paths.models + modelPath;
	xhr.send(url, function (err, result) {
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
