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

    function normaliseOwnerOperator(options, context) {
        var ds = options.data_series

        function intersect(a, b) {
            var t;
            if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
            return a.filter(function (e) {
                if (b.indexOf(e) !== -1) return true;
            });
        }

        // we want to re-write the series so that the only things in the list
        // are things that are in both lists

        // first read the values out into objects we can compare
        var owners = []
        var owner_map = {}
        var operators = []
        var op_map = {}
        for (var i = 0; i < ds.length; i++) {
            var vs = ds[i].values
            for (var j = 0; j < vs.length; j++) {
                var label = vs[j].label
                var value = vs[j].value
                if (ds[i].key === "Owner") {
                    owners.push(label)
                    owner_map[label] = value
                } else if (ds[i].key === "Operator") {
                    operators.push(label)
                    op_map[label] = value
                }
            }
        }

        // now assemble a list of owner/operators that appears in both lists
        var all = intersect(owners, operators)

        // re-write the data series
        var nds = []
        var owner_series = {"key" : "Owner", "values" : []}
        var op_series = {"key" : "Operator", "values" : []}
        for (var i = 0; i < all.length; i++) {
            if (i > 10) {
                break
            }
            var label = all[i]
            owner_series.values.push({"label" : label, "value" : owner_map[label]})
            op_series.values.push({"label" : label, "value" : op_map[label]})
        }

        nds.push(owner_series)
        nds.push(op_series)
        options.data_series = nds
    }
    /*
    $('#reportview-owner-operator').report({
        type: "horizontal_multibar",
        search_url: query_endpoint,
        debug: false,
        horizontal_multibar_controls: false,
        horizontal_multibar_margin_left: 300,
        facets: [
            {
                "field" : "owner.exact",
                "size" : 100,
                "display" : "Owner"
            },
            {
                "field" : "operator.exact",
                "size" : 100,
                "display" : "Operator"
            }
        ],
        pre_render_callback: normaliseOwnerOperator
    });
    */

    $('#reportview-top-countries').report({
        type: "pie",
        search_url: query_endpoint,
        debug: false,
        pie_label_threshold: 0.06,
        facets: [
            {
                "field" : "country.exact",
                "size" : 10,
                "display" : "Coutries with Reactors"
            }
        ]
    });

    $('#reportview-top-models').report({
        type: "pie",
        search_url: query_endpoint,
        debug: false,
        pie_label_threshold: 0.06,
        facets: [
            {
                "field" : "process.exact",
                "size" : 10,
                "display" : "Process"
            }
        ]
    });

    $('#reportview-top-operators').report({
        type: "horizontal_multibar",
        search_url: query_endpoint,
        debug: false,
        facets: [
            {
                "field" : "operator.exact",
                "size" : 10,
                "display" : "Operator"
            }
        ],
        horizontal_multibar_margin_left: 300
    });

});
