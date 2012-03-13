$(function () {

var settings = pyradmin.settings;
var xhr = pyradmin.xhr;
var Schema = pyradmin.schema.Schema;
var getRows = pyradmin.data.getRows;

var dataSlot = $('#data').first();

var loadData = function (url) {
	xhr.send(url, function (err, result) {
		if (err)
		{
			console.log(err);
			alert('ooops');
		}
		else
		{
			var schema = Schema.parse(result.meta.schema);
			var rows = getRows(schema, result.data);

			dataSlot.html(new EJS({url: settings.paths.templates+'/list.ejs'}).render({
				rows: rows
			}));
		}
	});
};

loadData('/');

});
