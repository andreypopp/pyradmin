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
	this.name = info.name;
	var fields = info.fields;

	var i = 0;
	for (var k in fields)
	{
		var fieldInfo = fields[k];
		var fieldName = fieldInfo.name;

		this.ord[fieldName] = i++;
		this.fields[fieldName] = new Field(fieldName);
	}
};

Schema.prototype.getFields = function () {
	var fields = [];
	for (var i in this.fields)
	{
		var field = this.fields[i];
		fields[this.getOrd(field.name)] = field;
	}

	return fields;
};

Schema.prototype.getRows = function (data) {
	var rows = [];
	for (var i in data)
	{
		var obj = data[i];
		var row = [];
		for (var k in obj)
		{
			row[this.getOrd(k)] = obj[k];
		}
		rows.push(row);
	}

	return rows;
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
