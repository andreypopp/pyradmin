""" Schema"""

__all__ = ("serialize",)

def serialize(schema):
    r = {
        "typ": schema.typ.__class__.__name__.lower(),
        "name": schema.name,
    }
    if schema.children:
        r["children"] = [serialize(n) for n in schema.children]
    return r
