import esprit
from portality.core import app

class ReactorDAO(esprit.dao.DomainObject):
    __type__ = 'reactor'
    __conn__ = esprit.raw.Connection(app.config.get('ELASTIC_SEARCH_HOST'), app.config.get('ELASTIC_SEARCH_INDEX'))
