""" Schema"""

import colander

from pyradmin.util import class_name

__all__ = ("serialize",)

def serialize(schema):
    """ Serialize colander ``schema``"""
    r = {"type": class_name(schema.typ), "name": schema.name}
    if schema.children:
        r["fields"] = [serialize(n) for n in schema.children]
    return r

class Object(colander.SchemaType):

    def serialize(self, node, appstruct):

        if appstruct is colander.null:
            appstruct = node.appstruct

        error = None
        result = {}

        for num, subnode in enumerate(node.children):
            name = subnode.name
            subval = getattr(appstruct, name, colander.null)
            try:
                result[name] = subnode.serialize(subval)
            except colander.Invalid as e:
                if error is None:
                    error = colander.Invalid(node)
                error.add(e, num)

        if error is not None:
            raise error

        return result

    def deserialize(self, node, cstruct):
        if cstruct is colander.null:
            return colander.null

        error = None
        result = node.appstruct

        for num, subnode in enumerate(node.children):
            name = subnode.name
            subval = cstruct.pop(name, colander.null)
            try:
                setattr(result, name, subnode.deserialize(subval))
            except colander.Invalid as e:
                if error is None:
                    error = colander.Invalid(node)
                error.add(e, num)

        if error is not None:
            raise error

        return result

    def flatten(self, node, appstruct, prefix='', listitem=False):
        result = {}
        if listitem:
            selfprefix = prefix
        else:
            if node.name:
                selfprefix = '%s%s.' % (prefix, node.name)
            else:
                selfprefix = prefix

        for subnode in node.children:
            name = subnode.name
            substruct = getattr(appstruct, name, colander.null)
            result.update(
                subnode.typ.flatten(subnode, substruct, prefix=selfprefix))
        return result

    def set_value(self, node, appstruct, path, value):
        if '.' in path:
            next_name, rest = path.split('.', 1)
            next_node = node[next_name]
            next_appstruct = getattr(appstruct, next_name)
            setattr(appstruct, next_name, next_node.typ.set_value(
                next_node, next_appstruct, rest, value))
        else:
            setattr(appstruct, path, value)
        return appstruct

    def get_value(self, node, appstruct, path):
        if '.' in path:
            name, rest = path.split('.', 1)
            next_node = node[name]
            return next_node.typ.get_value(
                next_node, getattr(appstruct, name), rest)
        return getattr(appstruct, path)

ObjectSchema = colander._SchemaMeta("ObjectSchema", (object,),
        dict(schema_type=Object,
            node_type=colander.SchemaNode,
            __new__=colander._Schema__new__))
