test develop install register clean build:
	python setup.py $@

bootstrap: develop
	populate_pyradmin ./development.ini

serve:
	pserve ./development.ini

shell:
	pshell --reload --monitor-restart ./development.ini
