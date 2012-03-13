(function () {

var getRows = function (schema, data) {
	var rows = [];
	for (var i in data)
	{
		var obj = data[i];
		var row = [];
		for (var k in obj)
		{
			row[schema.getOrd(k)] = obj[k];
		}
		rows.push(row);
	}

	return rows;
};

window.pyradmin = window.pyradmin || {};
window.pyradmin.data = {
	getRows: getRows
};

})();
