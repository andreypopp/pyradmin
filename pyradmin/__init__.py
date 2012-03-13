""" Package"""

__all__ = ("includeme",)

def add_pyradmin(config, cfg):
    config.add_view(
        views.List,
        context=cfg.Collection,
        request_method="GET")
    config.add_view(
        views.Create,
        context=cfg.Collection,
        request_method="POST")
    config.add_view(
        views.Show,
        context=cfg.Resource,
        request_method="GET")
    config.add_view(
        views.Update,
        context=cfg.Resource,
        request_method="PUT")
    config.add_view(
        views.Delete,
        context=cfg.Resource,
        request_method="DELETE")

def includeme(config):
    config.add_directive("add_pyradmin", add_pyradmin)
