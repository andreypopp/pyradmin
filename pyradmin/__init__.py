""" Package"""

__all__ = ("includeme",)

def add_pyradmin(config, cfg):
    from pyradmin.interfaces import IConfig
    cfg = cfg()
    config.add_view(
        views.List,
        context=cfg.Collection,
        request_method="GET",
        route_name="pyradmin_root")
    config.add_view(
        views.Create,
        context=cfg.Collection,
        request_method="POST",
        route_name="pyradmin_root")
    config.add_view(
        views.Show,
        context=cfg.Resource,
        request_method="GET",
        route_name="pyradmin_root")
    config.add_view(
        views.Update,
        context=cfg.Resource,
        request_method="PUT",
        route_name="pyradmin_root")
    config.add_view(
        views.Delete,
        context=cfg.Resource,
        request_method="DELETE",
        route_name="pyradmin_root")
    config.registry.registerUtility(cfg, IConfig, name=cfg.name)

def set_pyradmin_root(config, root):
    from pyradmin.resource import Root
    if root.endswith("/"):
        root = root[:-1]
    config.add_route("pyradmin_root",
        pattern=root + "/*traverse",
        factory="pyradmin.resource:Root")

def includeme(config):
    config.add_directive("add_pyradmin", add_pyradmin)
    config.add_directive("set_pyradmin_root", set_pyradmin_root)
