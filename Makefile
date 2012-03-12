bootstrap:
	python setup.py develop
	populate_pyradmin ./development.ini

serve:
	pserve ./development.ini
