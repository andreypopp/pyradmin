import colander

from pyramid.config import Configurator

from sqlalchemy import engine_from_config
from sqlalchemy import Column, Integer, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker

from pyradmin.resource import Config
from pyradmin import views

from zope.sqlalchemy import ZopeTransactionExtension

DBSession = scoped_session(sessionmaker(extension=ZopeTransactionExtension()))
Base = declarative_base()

class MyModel(Base):
    __tablename__ = 'models'
    id = Column(Integer, primary_key=True)
    name = Column(Text, unique=True)
    value = Column(Integer)

    def __init__(self, name, value):
        self.name = name
        self.value = value

class MyModelConfig(Config):

    session = DBSession
    cls = MyModel

    class Schema(colander.MappingSchema):

        id = colander.SchemaNode(colander.Integer(), primary_key=True)
        name = colander.SchemaNode(colander.String())

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    config = Configurator(
        settings=settings,
        root_factory=lambda request: MyModelConfig().collection)
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.include("pyradmin")
    config.add_pyradmin(MyModelConfig)
    return config.make_wsgi_app()
