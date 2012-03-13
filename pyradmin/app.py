import colander

from pyramid.config import Configurator

from sqlalchemy import engine_from_config
from sqlalchemy import Column, Integer, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker

from pyradmin import views
from pyradmin.models import DBSession, MyModel
from pyradmin.collection import Collection

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


class MyModelCollection(Collection):

    session = DBSession
    cls = MyModel
    class schema(colander.MappingSchema):

        id = colander.SchemaNode(colander.Integer())
        name = colander.SchemaNode(colander.String())

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    config = Configurator(
        settings=settings,
        root_factory=lambda request: MyModelCollection())
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.include("pyradmin")
    config.add_view(views.List, context=MyModelCollection,
            request_method="GET",
            renderer="json")
    config.add_view(views.Meta, context=MyModelCollection,
            request_method="OPTIONS",
            renderer="json")
    config.scan()
    return config.make_wsgi_app()
