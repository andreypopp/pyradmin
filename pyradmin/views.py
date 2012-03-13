""" Views"""

import json

from pyramid.response import Response

__all__ = ("List", "Create", "Update", "Delete", "Show")

class View(object):

    SCHEMA_HDR = "X-Pyradmin-Schema"

    schema = NotImplemented
    session = NotImplemented
    cls = NotImplemented

    _need_schema = False

    def process(self):
        raise NotImplementedError()

    def __call__(self):
        data = self.process()
        response = Response(
            json.dumps(data),
            content_type="application/json")
        if self._need_schema:
            response.headers[self.SCHEMA_HDR] = json.dumps(
                [n.name for n in self.schema.nodes])
        return response

class CollectionView(View):

    def __init__(self, collection, request):
        self.collection = collection
        self.request = request

    @property
    def schema(self):
        return self.collection.schema

    @property
    def session(self):
        return self.collection.session

    @property
    def cls(self):
        return self.collection.cls

class List(CollectionView):

    OFFSET_HDR = "X-Pyradmin-Offset"
    LIMIT_HDR = "X-Pyradmin-Limit"

    _need_schema = True

    @property
    def offset(self):
        return self.request.headers.get(self.OFFSET_HDR, 0)

    @property
    def limit(self):
        return self.request.headers.get(self.LIMIT_HDR, 25)

    def process(self):
        return [self.collection.serialize(item)
            for item in (self.collection.q
                .offset(self.offset)
                .limit(self.limit)
                .all())]

class Create(CollectionView):
    pass

class ResourceView(View):

    def __init__(self, resource, request):
        self.resource = resource
        self.request = request

    @property
    def collection(self):
        return self.resource.collection

    @property
    def query(self):
        return self.resource.collection.q

    @property
    def item(self):
        return self.resource.item

    @property
    def schema(self):
        return self.resource.schema

    @property
    def session(self):
        return self.resource.session

    @property
    def cls(self):
        return self.resource.cls

class Show(ResourceView):

    _need_schema = True

    def process(self):
        return self.resource.serialized_item

class Update(ResourceView):
    pass

class Delete(ResourceView):

    def process(self):
        pk_name = self.collection.primary_key.name
        pk_val = getattr(self.item, pk_name)
        (self.query
            .filter_by(**{pk_name: pk_val})
            .delete())
