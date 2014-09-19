jQuery(document).ready(function($) {

    /****************************************************************
     * WNA FacetView theme
     ***************************
     */

    function discoveryRecordView(options, record) {
        var result = options.resultwrap_start;

        result += "<div class='row-fluid' style='margin-top: 10px; margin-bottom: 10px'>"

        result += "<div class='span10'>"
        result += "<strong style='font-size: 150%'>" + record["name"] + ", " + record["country"] + "</strong><br>"
        result += record["reactor_type"] + ", " + record["current_status"] + "<br>"
        result += "<strong>process:</strong> " + record["process"] + " <strong>owner:</strong> " + record["owner"] + " <strong>operator:</strong> " + record["operator"]
        result += "</div>"

        result += "<div class='span2'>"
        result += "<strong style='font-size: 130%'>" + record["capacity_gross"] + "</strong><br>"
        result += "Capacity Gross"
        result += "</div></div>"
        result += options.resultwrap_end;
        return result;
    }

    var facets = []
    facets.push({'field': 'start_year', 'display': 'Start Year'})
    facets.push({'field': 'process.exact', 'display': 'Process'})
    facets.push({'field': 'owner.exact', 'display': 'Owner'})
    facets.push({'field': 'vendor.exact', 'display': 'Vendor'})
    facets.push({'field': 'operator.exact', 'display': 'Operator'})
    facets.push({'field': 'reactor_type.exact', 'display': 'Reactor Type'})
    facets.push({'field': 'country.exact', 'display': 'Country'})
    facets.push({'field': 'current_status.exact', 'display': 'Current Status'})
    facets.push({'field': 'model.exact', 'display': 'Model'})
    // capacity_net, range
    // capacity_gross, range
    // capacity_thermal, range
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

