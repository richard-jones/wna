jQuery(document).ready(function($) {

    /****************************************************************
     * Application Reportview Theme
     *****************************
     */
    var query_endpoint = current_scheme + "//" + current_domain + "/query/reactor/_search"

    $('#reportview-capacity').report({
        type: "horizontal_multibar",
        data_series : [
            {
                key: "Capacity",
                values: [
                    {"label" : "Capacity Thermal", "value" : thermal},
                    {"label" : "Capacity Gross", "value" : gross},
                    {"label" : "Capacity Net", "value" : net}
                ]
            }
        ]
    });

});
