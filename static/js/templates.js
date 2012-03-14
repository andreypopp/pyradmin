define(function(require, exports, module) {

	var settings = require('settings');

	var escape = function (str) {
		if (str == null)
		{
			return '';
		}

		return (str+'').replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	};

	var render = function (jqSelected, templatePath, data) {
		data.escape = escape;

		jqSelected.html(new EJS({
			url: settings.paths.templates+templatePath
		}).render(data));
	};

	return {
		render: render,
		escape: escape
	};

});
