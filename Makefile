test develop install register build:
	python setup.py $@

bootstrap: develop
	populate_pyradmin ./development.ini

serve:
	pserve --reload --monitor-restart ./development.ini

shell:
	pshell ./development.ini

clean:
	find . -name '*.pyc' -delete
	python setup.py clean
