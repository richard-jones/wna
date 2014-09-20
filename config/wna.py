ELASTIC_SEARCH_HOST = "http://localhost:9200"
ELASTIC_SEARCH_INDEX = "wna"

from esprit import mappings
ELASTIC_SEARCH_MAPPINGS = {
    "reactor" : mappings.for_type(
        "reactor",
            mappings.properties(mappings.type_mapping("location", "geo_point")),
            mappings.dynamic_templates(
            [
                mappings.EXACT,
            ]
        )
    )
}

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

