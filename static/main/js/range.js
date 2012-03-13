(function () {

var query = pyradmin.query;
var settings = pyradmin.settings;


var Range = function (offset, limit, pageInfo) {
	if (offset == null)
	{
		offset = 0;
	}

	this.offset = offset;
	this.limit = limit;
	this.pageInfo = pageInfo;
};

Range.fromPage = function (page, pageSize) {
	if (page == null)
	{
		page = 1;
	}

	if (pageSize == null)
	{
		pageSize = settings.pageSize;
	}

	var offset = (page - 1) * pageSize;
	var limit = pageSize;

	return new Range(offset, limit, {
		page: page,
		pageSize: pageSize
	});
};

Range.fromQuery = function (pageSize) {
	var page = null;
	var pageStr = query.getQuery()['page'];
	if (pageStr)
	{
		try
		{
			page = parseInt(pageStr, 10);
		}
		catch(exc)
		{
		}
	}

	return Range.fromPage(page, pageSize);
};

window.pyradmin = window.pyradmin || {};
window.pyradmin.Range = Range;

})();