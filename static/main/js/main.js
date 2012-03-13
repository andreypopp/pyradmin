$(function () {

var settings = pyradmin.settings;
var xhr = pyradmin.xhr;
var Schema = pyradmin.schema.Schema;
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
			var schema = Schema.parse(result.meta.schema);

			render(dataSlot, '/model.ejs', {
				model: schema,
				data: result.data
			});
		}
	});
};

showModel('');

});
