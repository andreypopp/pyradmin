define(function(require, exports, module) {

	var query = require('query');
	var settings = require('settings');

	var Range = function (offset, limit, pageInfo) {
		if (offset == null)
		{
			offset = 0;
		}

		this.offset = offset;
		this.limit = limit;
		this.pageInfo = pageInfo;
	};

	Range.prototype.next = function() {
		return Range.fromPage(this.pageInfo.page + 1, this.pageInfo.pageSize);
	}

	Range.prototype.prev = function() {
		if (this.pageInfo.page == 1) {
			return this;
		} else {
			return Range.fromPage(this.pageInfo.page - 1, this.pageInfo.pageSize);
		}
	}

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

	return {Range: Range};

});
