ELASTIC_SEARCH_HOST = "http://localhost:9200"
ELASTIC_SEARCH_INDEX = "wna"

QUERY_ROUTE = {
    "query" : {
        "reactor" : {
            "auth" : False,
            "role" : None,
            "filters" : [],
            "dao" : "service.dao.ReactorDAO"
        }
    }
}

QUERY_FILTERS = {}