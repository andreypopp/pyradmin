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

var XHR = function (cb) {
	this.cb = cb;
};

XHR.prototype.send = function (url, data) {
	var self = this;

	var settings = {
		url: url,
		dataType: 'json',
		success: function () { self.jqSuccess.apply(self, arguments); },
		error: function () { self.jqError.apply(self, arguments); }
	};

	if (arguments.length > 1)
	{
		settings.data = data;
		settings.contentType = 'application/json';
	}

	$.ajax(settings);
};

XHR.prototype.jqSuccess = function (data, textStatus, request) {
	if (request.status == 200)
	{
		var result = {};

		var schemaInfoStr = request.getResponseHeader('X-Pyradmin-Schema');
		if (schemaInfoStr)
		{
			var schemaInfo;
			try
			{
				schemaInfo = JSON.parse(schemaInfoStr);
			}
			catch (exc)
			{
			}

			if (schemaInfo)
			{
				result.meta = {
					schema: schemaInfo
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

var send = function (url, data, cb) {
	var hasData = true;

	if (arguments.length < 3)
	{
		cb = data;
		hasData = false;
	}

	var xhr = new XHR(cb);

	if (hasData)
	{
		xhr.send(url, data);
	}
	else
	{
		xhr.send(url);
	}
};

window.pyradmin = window.pyradmin || {};
window.pyradmin.xhr = {
	send: send,
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
