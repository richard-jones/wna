jQuery(document).ready(function($) {

    /****************************************************************
     * WNA FacetView theme
     ***************************
     */

    function highlightView(options) {
        /*****************************************
         * overrides must provide the following classes and ids
         *
         * id: facetview - main div in which the facetview functionality goes
         * id: facetview_filters - div where the facet filters will be displayed
         * id: facetview_rightcol - the main window for result display (doesn't have to be on the right)
         * class: facetview_search_options_container - where the search bar and main controls will go
         * id : facetview_selectedfilters - where we summarise the filters which have been selected
         * class: facetview_metadata - where we want paging to go
         * id: facetview_results - the table id for where the results actually go
         * id: facetview_searching - where the loading notification can go
         *
         * Should respect the following configs
         *
         * options.debug - is this a debug enabled facetview.  If so, put a debug textarea somewhere
         */

        // the facet view object to be appended to the page
        var thefacetview = '<div id="facetview"><div class="row-fluid"><div class="span12">';

        thefacetview += '<div class="row-fluid" style="margin-top: 50px"> \
                            <div class="span1">&nbsp;</div> \
                            <div class="span10"> \
                                <div id="map-canvas" style="width: 100%; height: 600px; max-width: none !important" class="google-maps"></div> \
                            </div> \
                        </div>'

        // debug window near the bottom
        if (options.debug) {
            thefacetview += '<div class="facetview_debug" style="display:none"><textarea style="width: 95%; height: 300px"></textarea></div>'
        }

        // close off all the big containers and return
        thefacetview += '</div></div></div>';
        return thefacetview
    }

    function highlight(options, context) {
        $("#reactor_count").html(options.data.found)
        $("#capacity").html(options.data.facets.capacity_net.total)
        $("#smallest_capacity").html(options.data.facets.capacity_net.min)
        $("#largest_capacity").html(options.data.facets.capacity_net.max)
        $("#stat_display").show()

        function initialize(lat, lng, zoom) {
            var myLatlng = new google.maps.LatLng(lat,lng);
            var mapOptions = {
                zoom: zoom,
                center: myLatlng,
                mapTypeId: google.maps.MapTypeId.HYBRID
            }
            var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
            return map
        }

        function midPoint(a) {
            // figure out a mid-point
            var b = a.sort(function(a, b){return parseFloat(a)-parseFloat(b)})
            var l = b[0]
            var u = b[b.length - 1]
            var m = (parseFloat(l) + parseFloat(u)) / 2.0
            return m
        }

        // create the map points, and also record the lat and lon values
        var lats = []
        var lons = []
        var markers = []
        for (var item = 0; item < options.data.records.length; item++) {
            var res = options.data.records[item]
            if (res.location) {
                var myLatlng = new google.maps.LatLng(res.location.lat, res.location.lon);
                lats.push(res.location.lat)
                lons.push(res.location.lon)
                var marker = new google.maps.Marker({
                    position: myLatlng,
                    title: res.name
                });
                markers.push(marker)
            }
        }

        var mlat = midPoint(lats)
        var mlon = midPoint(lons)

        var gm = initialize(mlat, mlon, 5);

        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(gm)
        }
    }

    var facets2 = []
    facets2.push({'field': 'operator.exact', 'display': 'Operator', "hidden" : true})
    facets2.push({'field': 'current_status.exact', 'display': 'Current Status', "hidden" : true})
    facets2.push({"field" : 'capacity_net', 'display' : 'Capacity Net', 'hidden' : true, "type" : "statistical"})

    $('#operator_highlight').facetview({
        debug: false,
        search_url : current_scheme + "//" + current_domain + "/query/reactor/_search",
        page_size : 700,
        // fields: ["name", "location"],
        facets: facets2,
        predefined_filters: {
            "operator.exact" : [operator],
            "current_status.exact" : ["Operational"]
        },
        pushstate: false,
        render_the_facetview: highlightView,
        pre_render_callback: highlight
    });

    function discoveryRecordView(options, record) {
        var result = options.resultwrap_start;

        result += "<div class='row-fluid' style='margin-top: 10px; margin-bottom: 10px'>"

        result += "<div class='span8'>"
        result += "<strong style='font-size: 150%'><a href='/reactor/" + record["id"] + "'>" + record["name"] + "</a></strong><br>"
        result += record["reactor_type"]
        result += "</div>"

        result += "<div class='span4'>"
        result += "<strong style='font-size: 160%'>" + record["capacity_net"] + " MWe</strong>"
        result += "</div></div>"
        result += options.resultwrap_end;
        return result;
    }

    var facets = []
    facets.push({'field': 'operator.exact', 'display': 'Operator', "hidden" : true})
    facets.push({'field': 'current_status.exact', 'display': 'Current Status', "hidden" : true})

    $('#operator_reactors').facetview({
        debug: false,
        search_url : current_scheme + "//" + current_domain + "/query/reactor/_search",
        page_size : 10,
        facets: facets,
        sort: [{"name.exact" : {"order" : "asc"}}],
        render_result_record : discoveryRecordView,
        render_search_options : function() {return ""},
        predefined_filters: {
            "operator.exact" : [operator],
            "current_status.exact" : ["Operational"]
        },
        pushstate: false
    });

    $('#reportview-operator-start-years').report({
        debug: false,
        type: "multibar",
        search_url: current_scheme + "//" + current_domain + "/query/reactor/_search",
        facets: [
            {
                "field" : "start_year",
                "size" : 100,
                "display" : "Start Year",
                "order" : "term"
            }
        ],
        fixed_filters : [
            {"term" : {"operator.exact" :  operator}},
            {"term" : {"current_status.exact" : "Operational"}}
        ]
    });
});

