""" Utilities"""

__all__ = ("class_name",)

def class_name(obj=None, cls=None):
    if obj is not None:
        return obj.__class__.__name__.lower()
    return cls.__name__.lower()
