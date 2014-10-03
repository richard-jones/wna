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
        result += "<strong>process:</strong> " + record["process"] + " <strong>owner:</strong> " + record["owner"] + " <strong>operator:</strong> " + record["operator"] + "<br>"
        if (record["grid_connection"]) {
            result += "<strong>grid connection:</strong> " + record["grid_connection"]
        }
        result += "</div>"

        result += "<div class='span2'>"
        result += "<strong style='font-size: 160%'>" + record["capacity_net"] + " MWe</strong>"
        result += "</div></div>"
        result += options.resultwrap_end;
        return result;
    }

    function customPager(options) {
        /*****************************************
         * overrides must provide the following classes and ids
         *
         * class: facetview_decrement - anchor to move the page back
         * class: facetview_increment - anchor to move the page forward
         * class: facetview_inactive_link - for links which should not have any effect (helpful for styling bootstrap lists without adding click features)
         *
         * should (not must) respect the config
         *
         * options.from - record number results start from (may be a string)
         * options.page_size - number of results per page
         * options.data.found - the total number of records in the search result set
         */

        // ensure our starting points are integers, then we can do maths on them
        var from = parseInt(options.from)
        var size = parseInt(options.page_size)

        // calculate the human readable values we want
        var to = from + size
        from = from + 1 // zero indexed
        if (options.data.found < to) { to = options.data.found }
        var total = options.data.found

        // forward and back-links, taking into account start and end boundaries
        var backlink = '<a class="facetview_decrement">&laquo; back</a>'
        if (from < size) { backlink = "<a class='facetview_decrement facetview_inactive_link'>..</a>" }

        var nextlink = '<a class="facetview_increment">next &raquo;</a>'
        if (options.data.found <= to) { nextlink = "<a class='facetview_increment facetview_inactive_link'>..</a>" }

        var meta = '<div class="row-fluid"><div class="span8">'

        // usual page navigation
        meta += '<div class="pagination"><ul>'
        meta += '<li class="prev">' + backlink + '</li>'
        meta += '<li class="active"><a>' + from + ' &ndash; ' + to + ' of ' + total + '</a></li>'
        meta += '<li class="next">' + nextlink + '</li>'
        meta += "</ul></div>"

        meta += '</div><div class="span4">'

        // highlight of total number of reactors and total MWe
        var mwe = undefined

        meta += "<strong>" + total + "</strong> reactors selected, totalling"

        meta += "</div></div>"
        return meta
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
    facets.push({'field': 'current_status.exact', 'display': 'Current Status', "open" : true})

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
            {'display':'Model','field':'model'}
        ],
        render_result_record : discoveryRecordView,
        active_filters : {
            "current_status.exact" : ["Operational"]
        }//,
        //exclude_predefined_filters_from_facets: false
        // render_results_metadata : customPager
    });

});

