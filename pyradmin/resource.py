""" Resource configuration"""

from pyradmin.util import class_name

__all__ = ("Manager", "Collection", "Resource")

class Resource(object):

    def __init__(self, cfg, item):
        self.cfg = self.c = cfg
        self.item = item

    @property
    def serialized_item(self):
        return self.c.serialize(self.item)

class Collection(object):

    def __init__(self, cfg):
        self.cfg = self.c = cfg
        self.q = self.c.q

    def __iter__(self):
        return iter(self.q)

    def __getitem__(self, id):
        item = self.c.q.get(id)
        if not item:
            raise KeyError(id)
        return self.c.Resource(self.cfg, item)

class Config(object):

    cls = NotImplemented
    session = NotImplemented

    Schema = NotImplemented
    Collection = Collection
    Resource = Resource

    @property
    def schema(self):
        schema = self.Schema()
        schema.name = class_name(cls=self.cls)
        return schema

    def serialize(self, item):
        return dict((n.name, getattr(item, n.name))
                for n in self.schema.children)

    @property
    def q(self):
        return self.session.query(self.cls)

    @property
    def primary_key(self):
        for n in self.schema.nodes:
            if n.primary_key:
                return n

    def primary_key_for(self, item):
        return getattr(item, self.primary_key.name)

    @property
    def collection(self):
        return self.Collection(self)

    def create_item(self, schema, data):
        schema.appstruct = self.cls()
        item = schema.deserialize(data)
        self.session.add(item)
        return item

    def update_item(self, item, schema, data):
        schema.appstruct = item
        item = schema.deserialize(data)
        return item

    def delete_item(self, item):
        self.session.delete(item)
