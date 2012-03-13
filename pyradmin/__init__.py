""" Package"""

__all__ = ("includeme",)

def add_pyradmin(config, collection_cls):
    config.add_view(
        views.List,
        context=collection_cls,
        request_method="GET")
    config.add_view(
        views.Create,
        context=collection_cls,
        request_method="POST")
    config.add_view(
        views.Show,
        context=collection_cls.Resource,
        request_method="GET")
    config.add_view(
        views.Update,
        context=collection_cls.Resource,
        request_method="PUT")
    config.add_view(
        views.Delete,
        context=collection_cls.Resource,
        request_method="DELETE")

def includeme(config):
    config.add_directive("add_pyradmin", add_pyradmin)
