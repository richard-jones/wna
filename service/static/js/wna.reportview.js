jQuery(document).ready(function($) {

    /****************************************************************
     * Application Reportview Theme
     *****************************
     */
    var query_endpoint = current_scheme + "//" + current_domain + "/query/reactor/_search"

    $('#reportview-start-years').report({
        type: "multibar",
        search_url: query_endpoint,
        debug: false,
        facets: [
            {
                "field" : "start_year",
                "size" : 100,
                "display" : "Start Year",
                "order" : "term"
            }
        ]
    });

});
