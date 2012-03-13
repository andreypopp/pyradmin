""" Collection"""

__all__ = ("Collection", "Resource")

class Resource(object):

    def __init__(self, collection, item):
        self.collection = collection
        self.item = item

    @property
    def serialized_item(self):
        return self.collection.serialize(self.item)

    @property
    def schema(self):
        return self.collection.schema

    @property
    def cls(self):
        return self.collection.cls

    @property
    def session(self):
        return self.collection.session

class Collection(object):

    cls = NotImplemented
    schema = NotImplemented
    session = NotImplemented

    Resource = Resource

    @property
    def primary_key(self):
        for n in self.schema.nodes:
            if n.primary_key:
                return n

    @property
    def q(self):
        return self.session.query(self.cls)

    def serialize(self, item):
        return {n.name: getattr(item, n.name) for n in self.schema.nodes}

    def __iter__(self):
        return iter(self.q())

    def __getitem__(self, id):
        item = self.q.get(id)
        if not item:
            raise KeyError(id)
        return self.Resource(self, item)
