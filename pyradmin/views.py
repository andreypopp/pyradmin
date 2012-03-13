""" Views"""

import json

from pyramid.response import Response

from pyradmin.schema import serialize

__all__ = ("List", "Create", "Update", "Delete", "Show")

class View(object):

    SCHEMA_HDR = "X-Pyradmin-Schema"

    need_schema = False

    def __init__(self, context, request):
        self.context = context
        self.request = request
        self.cfg = self.c = context.cfg

    def process(self):
        raise NotImplementedError()

    def __call__(self):
        data = self.process()
        data = json.dumps(data) if not data is None else ""
        response = Response(data, content_type="application/json")
        if self.need_schema:
            response.headers[self.SCHEMA_HDR] = json.dumps(
                serialize(self.c.schema))
        return response

class CollectionView(View):

    def __init__(self, collection, request):
        super(CollectionView, self).__init__(collection, request)
        self.collection = collection

class List(CollectionView):

    OFFSET_HDR = "X-Pyradmin-Offset"
    LIMIT_HDR = "X-Pyradmin-Limit"

    need_schema = True

    @property
    def offset(self):
        return self.request.headers.get(self.OFFSET_HDR, 0)

    @property
    def limit(self):
        return self.request.headers.get(self.LIMIT_HDR, 25)

    def process(self):
        return [self.c.serialize(item)
            for item in (self.collection.c.q
                .offset(self.offset)
                .limit(self.limit)
                .all())]

class Create(CollectionView):
    pass

class ResourceView(View):

    def __init__(self, resource, request):
        super(ResourceView, self).__init__(resource, request)
        self.resource = resource

class Show(ResourceView):

    need_schema = True

    def process(self):
        return self.resource.serialized_item

class Update(ResourceView):
    pass

class Delete(ResourceView):

    def process(self):
        pk_name = self.c.primary_key.name
        pk_val = getattr(self.resource.item, pk_name)
        (self.c.q
            .filter_by(**{pk_name: pk_val})
            .delete())
