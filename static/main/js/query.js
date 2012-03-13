(function () {

var parseQuery = function (query) {
	var result = {};

	if (query)
	{
		if (query[0] == '?')
		{
			query = query.substr(1);
		}

		var pairs = query.split("&");
		for (var i = 0; i < pairs.length; i++)
		{
			var kv = pairs[i].split("=");
			var k = unescape(kv[0]);
			var v = unescape(kv[1]);
			result[k] = v;
		}
	}

	return result;
};

var getQuery = function () {
	return parseQuery(window.location.search);
};


window.pyradmin = window.pyradmin || {};
window.pyradmin.query = {
	parseQuery: parseQuery,
	getQuery: getQuery
};

})();