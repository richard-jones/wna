jQuery(document).ready(function($) {
    var query_endpoint = current_scheme + "//" + current_domain + "/query/reactor/_search"

    function initialize() {
        var myLatlng = new google.maps.LatLng(17,0);
        var mapOptions = {
            zoom: 2,
            center: myLatlng,
            mapTypeId: google.maps.MapTypeId.HYBRID
        }
        var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
        return map
    }
    var gm = initialize();

    function querySuccess(data) {
        for (var item = 0; item < data.hits.hits.length; item++) {
            var res = data.hits.hits[item]
            if (res._source.location) {
                var myLatlng = new google.maps.LatLng(res._source.location.lat, res._source.location.lon);
                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: gm,
                    title: res._source.name
                });
            }
        }
    }

    var query = {
        "query" : { "match_all" : {} },
        "size" : 700,
        "_source" : ["location", "name"]
    }

    doElasticSearchQuery({
        success: querySuccess,
        complete: function() {},
        search_url: query_endpoint,
        queryobj: query,
        datatype: "jsonp"
    })
});
