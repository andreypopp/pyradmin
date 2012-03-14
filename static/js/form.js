(function () {

var collectData = function (model, form) {
	var result = {};

	for (var k in model.fields)
	{
		var el = form.find('[name="field_'+k+'"]');
		result[k] = el.val();
	}

	return result;
};

window.pyradmin = window.pyradmin || {};
window.pyradmin.form = {
	collectData: collectData
};

})();