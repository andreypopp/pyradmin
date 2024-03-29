""" Views"""

import json
import pkg_resources

from colander import Invalid
from pyramid import httpexceptions
from pyramid.response import Response

from pyradmin.schema import serialize as serialize_schema

__all__ = ("List", "Create", "Update", "Delete", "Show")

def main(request):
    page = pkg_resources.resource_stream("pyradmin", "static/index.html")
    return Response(page.read())

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
                serialize_schema(self.schema))
        return response

    def __getattr__(self, name):
        return getattr(self.c, name)

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
        return [self.serialize(item)
            for item in (self.q
                .offset(self.offset)
                .limit(self.limit)
                .all())]

class Create(CollectionView):

    def process(self):
        data = decode_data(self.request)
        schema = self.schema
        try:
            item = self.create_item(schema, data)
        except Invalid as e:
            raise httpexceptions.HTTPBadRequest(e)
        return self.primary_key_for(item)

class ResourceView(View):

    def __init__(self, resource, request):
        super(ResourceView, self).__init__(resource, request)
        self.resource = resource

class Show(ResourceView):

    need_schema = True

    def process(self):
        return self.resource.serialized_item

class Update(ResourceView):

    def process(self):
        data = decode_data(self.request)
        schema = self.schema
        try:
            self.update_item(self.resource.item, schema, data)
        except Invalid as e:
            raise httpexceptions.HTTPBadRequest(e)

class Delete(ResourceView):

    def process(self):
        self.delete_item(self.resource.item)

def decode_data(request):
    try:
        return json.loads(request.body)
    except json.JSONDecodeError:
        raise httpexceptions.HTTPBadRequest("can't decode JSON data")
