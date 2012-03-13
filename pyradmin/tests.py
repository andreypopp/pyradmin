""" Tests"""

import unittest

from pyramid.request import Request

__all__ = ()

def req(method="GET"):
    r = Request.blank("/")
    r.method = method
    return r

class ListTests(unittest.TestCase):

    def test_list(self):
        from pyradmin.views import List
        r = req()
        r.headers[List.LIMIT_HDR] = 100
        r.headers[List.OFFSET_HDR] = 0
