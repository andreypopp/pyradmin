(function () {

var XHRError = function () {
};

var XHRInternalError = function () {
};

var TimeoutError = function () {
};

var ParseError = function () {
};

var Aborted = function () {
};

var ResponsedError = function (status) {
	this.status = status;
};

var BadRequest = function () {
};

var XHR = function () {
	this.cb = null;
	this.url = null;
	this.data = undefined;
	this.headers = {};
};

XHR.prototype.addHeader = function (k, v) {
	this.headers[k] = v;
};

XHR.prototype.send = function () {
	var self = this;

	var settings = {
		url: this.url,
		headers: this.headers,
		dataType: 'json',
		success: function () { self.jqSuccess.apply(self, arguments); },
		error: function () { self.jqError.apply(self, arguments); }
	};

	if (this.data !== undefined)
	{
		settings.data = this.data;
		settings.contentType = 'application/json';
	}


	$.ajax(settings);
};

XHR.prototype.jqSuccess = function (data, textStatus, request) {
	if (request.status == 200)
	{
		var result = {};

		var modelInfoStr = request.getResponseHeader('X-Pyradmin-Schema');
		if (modelInfoStr)
		{
			var modelInfo;
			try
			{
				modelInfo = JSON.parse(modelInfoStr);
			}
			catch (exc)
			{
			}

			if (modelInfo)
			{
				result.meta = {
					model: modelInfo
				};
			}
		}
		result.data = data;

		this.cb(null, result);
	}
	else
	{
		this.cb(new ResponsedError(request.status));
	}
};

XHR.prototype.jqError = function (request, textStatus, errorThrown) {
	if (textStatus == 'timeout')
	{
		this.cb(new TimeoutError());
	}
	else if (textStatus == 'abort')
	{
		this.cb(new Aborted());
	}
	else if (textStatus == 'parsererror')
	{
		this.cb(new ParseError());
	}
	else
	{
		this.cb(new XHRInternalError());
	}
};

var load = function (url, range, query, cb) {
	var xhr = new XHR();

	xhr.cb = cb;
	xhr.url = url;

	if (range)
	{
		if (range.offset)
		{
			xhr.addHeader('X-Pyradmin-Offset', range.offset);
		}

		if (range.limit != null)
		{
			xhr.addHeader('X-Pyradmin-Limit', range.limit);
		}
	}

	xhr.send();
};

window.pyradmin = window.pyradmin || {};
window.pyradmin.xhr = {
	load: load,
	XHR: XHR,
	XHRError: XHRError,
	XHRInternalError: XHRInternalError,
	TimeoutError: TimeoutError,
	ParseError: ParseError,
	Aborted: Aborted,
	ResponsedError: ResponsedError,
	BadRequest: BadRequest
};

})();
