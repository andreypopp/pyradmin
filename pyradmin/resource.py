""" Resource management"""

__all__ = ("Manager", "Collection", "Resource")

class Resource(object):

    def __init__(self, cfg, item):
        self.cfg = self.c = cfg
        self.item = item
        self.q = self.c.q

    @property
    def serialized_item(self):
        return self.manager.serialize(self.item)

class Collection(object):

    def __init__(self, cfg):
        self.cfg = self.c = cfg
        self.q = self.c.q

    def __iter__(self):
        return iter(self.q())

    def __getitem__(self, id):
        item = self.c.q.get(id)
        if not item:
            raise KeyError(id)
        return self.manager.Resource(self.cfg, item)

class Config(object):

    cls = NotImplemented
    session = NotImplemented

    Schema = NotImplemented
    Collection = Collection
    Resource = Resource

    @property
    def schema(self):
        schema = self.Schema()
        schema.name = self.__class__.__name__.lower()
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

    @property
    def collection(self):
        return self.Collection(self)
