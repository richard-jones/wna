jQuery(document).ready(function($) {

    /****************************************************************
     * WNA FacetView theme
     ***************************
     */

    function columns(params) {
        var vals = params.values
        var cols = params.cols

        var rows = Math.ceil(vals.length / cols)
        var span = Math.floor(12 / cols)

        var frag = '<div class="row-fluid">'

        for (var i = 0; i < cols; i++) {
            frag += '<div class="span' + span + '">'
            for (var j = 0; j < rows; j++) {
                var idx = (i * rows) + j
                if (idx < vals.length) {
                    frag += vals[idx] + "<br>"
                }
            }
            frag += '</div>'
        }

        frag += '</div>'
        return frag
    }

    function facetListPanel(options) {
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
        var thefacetview = '<div id="facetview">';

        // provde the facets a place to go
        thefacetview += '<div class="row-fluid"><div class="span12"><div id="facetview_filters"></div></div></div>'

        // insert loading notification
        thefacetview += '<div class="row-fluid"><div class="span12"><div class="facetview_searching" style="display:none"></div></div></div>'

        // debug window near the bottom
        if (options.debug) {
            thefacetview += '<div class="row-fluid"><div class="span12"><div class="facetview_debug" style="display:none"><textarea style="width: 95%; height: 150px"></textarea></div></div></div>'
        }

        // close off the big container and return
        thefacetview += '</div>';
        return thefacetview
    }

    function customFacetList(options) {
        /*****************************************
         * overrides must provide the following classes and ids
         *
         * none - no requirements for specific classes and ids
         *
         * should (not must) respect the following config
         *
         * options.render_terms_facet - renders a term facet into the list
         * options.render_range_facet - renders a range facet into the list
         * options.render_geo_facet - renders a geo distance facet into the list
         */
        if (options.facets.length > 0) {
            var filters = options.facets;
            var thefilters = '';
            for (var idx = 0; idx < filters.length; idx++) {
                var facet = filters[idx]
                // if the facet is hidden do not include it in this list
                if (facet.hidden) {
                    continue;
                }

                thefilters += '<div class="row-fluid" style="border-bottom: 1px solid #cccccc; padding: 20px"><div class="span12">'
                var type = facet.type ? facet.type : "terms"
                if (type === "terms") {
                    thefilters += options.render_terms_facet(facet, options)
                } else if (type === "range") {
                    thefilters += options.render_range_facet(facet, options)
                } else if (type === "geo_distance") {
                    thefilters += options.render_geo_facet(facet, options)
                }
                thefilters += "</div></div>"
            };
            return thefilters
        };
        return ""
    }

    function customRenderTermsFacet(facet, options) {
        /*****************************************
         * overrides must provide the following classes and ids
         *
         * id: facetview_filter_<safe filtername> - table for the specific filter
         * class: facetview_morefacetvals - for increasing the size of the facet
         * id: facetview_facetvals_<safe filtername> - id of anchor for changing facet vals
         * class: facetview_sort - for changing the facet ordering
         * id: facetview_sort_<safe filtername> - id of anchor for changing sorting
         * class: facetview_or - for changing the default operator
         * id: facetview_or_<safe filtername> - id of anchor for changing AND/OR operator
         *
         * each anchor must also have href="<filtername>"
         */

        // full template for the facet - we'll then go on and do some find and replace
        var filterTmpl = '<div id="facetview_filter_{{FILTER_NAME}}"><h1 style="padding-bottom: 10px">{{FILTER_DISPLAY}}</h1></div>'

        /*
        var filterTmpl = '<table id="facetview_filter_{{FILTER_NAME}}" class="facetview_filters table table-bordered table-condensed table-striped" data-href="{{FILTER_EXACT}}"> \
            <tr><td><a class="facetview_filtershow" title="filter by {{FILTER_DISPLAY}}" \
            style="color:#333; font-weight:bold;" href="{{FILTER_EXACT}}"><i class="icon-plus"></i> {{FILTER_DISPLAY}} \
            </a> \
            <div class="btn-group facetview_filteroptions" style="display:none; margin-top:5px;"> \
                <a class="btn btn-small facetview_morefacetvals" id="facetview_facetvals_{{FILTER_NAME}}" title="filter list size" href="{{FILTER_EXACT}}">0</a> \
                <a class="btn btn-small facetview_sort" id="facetview_sort_{{FILTER_NAME}}" title="filter value order" href="{{FILTER_EXACT}}"></a> \
                <a class="btn btn-small facetview_or" id="facetview_or_{{FILTER_NAME}}" href="{{FILTER_EXACT}}">OR</a> \
            </div> \
            </td></tr> \
            </table>';
        */

        // put the name of the field into FILTER_NAME and FILTER_EXACT
        filterTmpl = filterTmpl.replace(/{{FILTER_NAME}}/g, safeId(facet['field'])).replace(/{{FILTER_EXACT}}/g, facet['field']);

        // set the display name of the facet in FILTER_DISPLAY
        if ('display' in facet) {
            filterTmpl = filterTmpl.replace(/{{FILTER_DISPLAY}}/g, facet['display']);
        } else {
            filterTmpl = filterTmpl.replace(/{{FILTER_DISPLAY}}/g, facet['field']);
        };

        return filterTmpl
    }

    function customRenderTermsFacetValues(options, facet) {
        /*****************************************
         * overrides must provide the following classes and ids
         *
         * class: facetview_filtervalue - wrapper element for any value included in the list
         * class: facetview_filterselected - for any anchors around selected filters
         * class: facetview_clear - for any link which should remove a filter (must also provide data-field and data-value)
         * class: facetview_filterchoice - tags the anchor wrapped around the name of the (unselected) field
         *
         * should (not must) respect the following config
         *
         * options.selected_filters_in_facet - whether to show selected filters in the facet pull-down (if that's your idiom)
         * options.render_facet_result - function which renders the individual facets
         * facet.value_function - the value function to be applied to all displayed values
         */
        var selected_filters = options.active_filters[facet.field]
        var frag = ""

        // first render the active filters
        if (options.selected_filters_in_facet) {
            if (selected_filters) {
                for (var i=0; i < selected_filters.length; i=i+1) {
                    var value = selected_filters[i]
                    if (facet.value_function) {
                        value = facet.value_function(value)
                    }
                    var sf = '<tr class="facetview_filtervalue" style="display:none;"><td>'
                    sf += "<strong>" + value + "</strong> "
                    sf += '<a class="facetview_filterselected facetview_clear" data-field="' + facet.field + '" data-value="' + value + '" href="' + value + '"><i class="icon-black icon-remove" style="margin-top:1px;"></i></a>'
                    sf += "</td></tr>"
                    frag += sf
                }
            }
        }

        // is there a pre-defined filter on this facet?
        var predefined = facet.field in options.predefined_filters ? options.predefined_filters[facet.field] : []

        // then render the remaining selectable facets
        var terms_to_render = []
        for (var i=0; i < facet["values"].length; i=i+1) {
            var f = facet["values"][i]
            if (options.exclude_predefined_filters_from_facets && $.inArray(f.term, predefined) > -1) { // note that the datatypes have to match
                continue
            }
            if ($.inArray(f.term.toString(), selected_filters) === -1) { // the toString helps us with non-string filters (e.g integers)
                terms_to_render.push(options.render_terms_facet_result(options, facet, f, selected_filters))
            }
        }

        var col_count = facet.field === "country.exact" ? 5 : 3
        frag += columns({values : terms_to_render, cols: col_count})
        return frag
    }

    function customRenderTermsFacetResult(options, facet, result, selected_filters) {
        /*****************************************
         * overrides must provide the following classes and ids
         *
         * class: facetview_filtervalue - tags the top level element as being a facet result
         * class: facetview_filterchoice - tags the anchor wrapped around the name of the field
         *
         * should (not must) respect the following configuration:
         *
         * facet.value_function - the value function to be applied to all displayed values
         */

        var display = result.term
        if (facet.value_function) {
            display = facet.value_function(display)
        }
        var url_root = facet.field === "country.exact" ? "/country/" : "/operator/"
        var append = '<a href="' + url_root + encodeURIComponent(result.term) + '">' + display + ' (' + result.count + ')</a>'

        /*
        var append = '<tr class="facetview_filtervalue" style="display:none;"><td><a class="facetview_filterchoice' +
                    '" data-field="' + facet['field'] + '" data-value="' + result.term + '" href="' + result.term +
                    '"><span class="facetview_filterchoice_text">' + display + '</span>' +
                    '<span class="facetview_filterchoice_count"> (' + result.count + ')</span></a></td></tr>';
        */
        return append
    }

    var facets = []
    facets.push({'field': 'country.exact', 'display': 'Country', "size" : 700, "order" : "term"})
    facets.push({'field': 'operator.exact', 'display': 'Operator', "size" : 700, "order" : "term"})
    facets.push({'field': 'current_status.exact', 'display': 'Current Status', "hidden" : true})

    $('#list_entities').facetview({
        debug: false,
        search_url : current_scheme + "//" + current_domain + "/query/reactor/_search",
        page_size : 0,
        facets : facets,
        predefined_filters: {
            "current_status.exact" : ["Operational"]
        },
        pushstate: false,
        render_the_facetview: facetListPanel,
        render_facet_list: customFacetList,
        render_terms_facet :  customRenderTermsFacet,
        render_terms_facet_values : customRenderTermsFacetValues,
        render_terms_facet_result: customRenderTermsFacetResult
    });

});

