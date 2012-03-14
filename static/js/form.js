define(function(require, exports, module) {

	var collectData = function (model, form) {
		var result = {};

		for (var k in model.fields)
		{
			var el = form.find('[name="field_'+k+'"]');
			result[k] = el.val();
		}

		return result;
	};

	return {
		collectData: collectData
	};

});
