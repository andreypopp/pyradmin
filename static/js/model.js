define(function(require, exports, module) {

	var Field = function (name) {
		this.name = name;
	};

	var Model = function () {
		this.fields = {};
		this.ord = {};
	};

	Model.prototype.getOrd = function (fieldName) {
		return this.ord[fieldName];
	};

	Model.prototype.fromInfo = function (info) {
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

	Model.prototype.getFields = function () {
		var fields = [];
		for (var i in this.fields)
		{
			var field = this.fields[i];
			fields[this.getOrd(field.name)] = field;
		}

		return fields;
	};

	Model.prototype.getKey = function (data) {
		var result = null;

		// TODO valid implementation
		if ('id' in data)
		{
			result = data.id;
		}

		return result;
	};

	Model.prototype.getRows = function (data) {
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

	Model.parse = function (info) {
		var model = new Model();
		model.fromInfo(info);
		return model;
	};

	return {
		Field: Field,
		Model: Model
	};

});
