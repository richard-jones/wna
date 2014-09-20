jQuery(document).ready(function($) {

    /****************************************************************
     * WNA FacetView theme
     ***************************
     */

    function discoveryRecordView(options, record) {
        var result = options.resultwrap_start;

        result += "<div class='row-fluid' style='margin-top: 10px; margin-bottom: 10px'>"

        result += "<div class='span10'>"
        result += "<strong style='font-size: 150%'><a href='/reactor/" + record["id"] + "'>" + record["name"] + ", " + record["country"] + "</a></strong><br>"
        result += record["reactor_type"] + ", " + record["current_status"] + "<br><br>"
        result += "<strong>process:</strong> " + record["process"] + " <strong>owner:</strong> " + record["owner"] + " <strong>operator:</strong> " + record["operator"]
        result += "</div>"

        result += "<div class='span2'>"
        result += "<strong style='font-size: 160%'>" + record["capacity_gross"] + " MWe</strong><br>"
        result += "Capacity Gross"
        result += "</div></div>"
        result += options.resultwrap_end;
        return result;
    }

    var facets = []
    facets.push({
        'field': 'start_year',
        'display': 'Start Year',
        "type": "range",
        "range" : [
            {"from" : 1950, "to" : 1960, "display" : "1950s"},
            {"from" : 1960, "to" : 1970, "display" : "1960s"},
            {"from" : 1970, "to" : 1980, "display" : "1970s"},
            {"from" : 1980, "to" : 1990, "display" : "1980s"},
            {"from" : 1990, "to" : 2000, "display" : "1990s"},
            {"from" : 2000, "to" : 2010, "display" : "2000s"},
            {"from" : 2010, "to" : 2020, "display" : "2010s"}
        ]
    })
    facets.push({'field': 'country.exact', 'display': 'Country'})
    facets.push({'field': 'current_status.exact', 'display': 'Current Status'})

    facets.push({'field': 'process.exact', 'display': 'Process'})
    facets.push({'field': 'owner.exact', 'display': 'Owner'})
    facets.push({'field': 'vendor.exact', 'display': 'Vendor'})
    facets.push({'field': 'operator.exact', 'display': 'Operator'})
    facets.push({'field': 'reactor_type.exact', 'display': 'Reactor Type'})
    facets.push({'field': 'model.exact', 'display': 'Model'})

    facets.push({
        'field': 'capacity_net',
        'display': 'Capacity Net (MWe)',
        "type": "range",
        "range" : [
            {"to" : 300, "display" : "up to 300"},
            {"from" : 300, "to" : 600, "display" : "300 - 600"},
            {"from" : 600, "to" : 900, "display" : "600 - 900"},
            {"from" : 900, "to" : 1200, "display" : "900 - 1200"},
            {"from" : 1200, "display" : "1200+"}
        ]
    })

    facets.push({
        'field': 'capacity_gross',
        'display': 'Capacity Gross (MWe)',
        "type": "range",
        "range" : [
            {"to" : 300, "display" : "up to 300"},
            {"from" : 300, "to" : 600, "display" : "300 - 600"},
            {"from" : 600, "to" : 900, "display" : "600 - 900"},
            {"from" : 900, "to" : 1200, "display" : "900 - 1200"},
            {"from" : 1200, "display" : "1200+"}
        ]
    })

    facets.push({
        'field': 'capacity_thermal',
        'display': 'Capacity Thermal (MWe)',
        "type": "range",
        "range" : [
            {"to" : 1000, "display" : "up to 1000"},
            {"from" : 1000, "to" : 2000, "display" : "1000 - 2000"},
            {"from" : 2000, "to" : 3000, "display" : "2000 - 3000"},
            {"from" : 3000, "to" : 4000, "display" : "3000 - 4000"},
            {"from" : 4000, "display" : "4000+"}
        ]
    })

    // output_life, range
    // net_capacity_(wna), range
    // capacity_factor_life, range

    $('#search_reactors').facetview({
        debug: false,
        search_url : current_scheme + "//" + current_domain + "/query/reactor/_search",
        page_size : 25,
        facets : facets,
        search_sortby : [
            {'display':'Start Year','field':'start_year.exact'},
            {'display':'Name','field':'name.exact'}
        ],
        searchbox_fieldselect : [
            {'display':'Title','field':'title'},
            {'display':'Process','field':'process'},
            {'display':'Owner','field':'owner'},
            {'display':'Vendor','field':'vendor'},
            {'display':'Operator','field':'operator'},
            {'display':'Model','field':'model'},
        ],
        render_result_record : discoveryRecordView

    });

});

