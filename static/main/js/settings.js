(function () {

var settings = {
	pageSize: 20,

	paths: {
    root: '/',
		stat: '/static',
		api: '/',
		models: '/api',
		templates: '/static/main/templates'
	}
};

window.pyradmin = window.pyradmin || {};
window.pyradmin.settings = settings;

})();
