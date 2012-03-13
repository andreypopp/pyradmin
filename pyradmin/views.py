""" Views"""

__all__ = ("Meta", "List")

class View(object):

    @property
    def schema(self):
        return self.context.schema

    def __init__(self, context, request):
        self.context = context
        self.request = request

class Meta(View):

    def __call__(self):
        return [n.name for n in self.schema.nodes]

class List(View):

    def __call__(self):
        offset = self.request.GET.get("offset", 0)
        limit = self.request.GET.get("limit", 25)
        return [[getattr(item, node.name) for node in self.schema.nodes]
        for item in self.context.q.offset(offset).limit(limit)]
