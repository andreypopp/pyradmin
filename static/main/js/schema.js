(function () {

var Field = function (name) {
	this.name = name;
};

var Schema = function () {
	this.fields = {};
	this.ord = {};
};

Schema.prototype.getOrd = function (fieldName) {
	return this.ord[fieldName];
};

Schema.prototype.fromInfo = function (info) {
	var i = 0;
	for (var k in info)
	{
		var fieldInfo = info[k];
		var fieldName = fieldInfo.name;

		this.ord[fieldName] = i++;
		this.fields[fieldName] = new Field(fieldName);
	}
};

Schema.parse = function (info) {
	var schema = new Schema();
	schema.fromInfo(info);
	return schema;
};

window.pyradmin = window.pyradmin || {};
window.pyradmin.schema = {
	Field: Field,
	Schema: Schema
};

})();
