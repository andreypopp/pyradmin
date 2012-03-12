""" Collection"""

__all__ = ("Collection",)

class Collection(object):

    schema = NotImplemented
    session = NotImplemented
    cls = NotImplemented

    @property
    def q(self):
        return self.session.query(self.cls)
