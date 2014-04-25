//= require foundation

$(function() {
  $('#search input.button').on('click', function() {
    return search();
  });

  $('#search-query').on('keyup', function() {
    return search();
  });

  function search() {
    var query   = $('#search-query').val();
    var result  = $('#search-results');
    var entries = $('#search-results .entries');

    if (query.length <= 2) {
      result.hide();
      entries.empty();
      $('#map').show();
    } else {
      $('#map').hide();
      // retrieve matching result with content
      var results = $.map(idx.search(query), function(result) {
        return $.grep(docs, function(entry) {
          return entry.id === result.ref;
        })[0];
      });

      entries.empty();

      if (results && results.length > 0) {
        $.each(results, function(key, post) {
          entries.append('<article>'+
          '  <h4>'+
          '    <small><time>'+post.date+'</time></small>'+
          '    <a href="'+post.id+'">'+post.title+'</a>'+
          '  </h4>'+
          '</article>');
        });
      } else {
        entries.append('<p>Aucun article trouvé :-(</p>');
      }

      result.show();
    }

    return false;
  }
});

/**
 * Displaying the map !
 */
if ("undefined" !== typeof geoJson) {
  $('#map').show();

  var mapId = 'map';
  if ($('#bigmap').length) {
    mapId = 'bigmap';
  }

  var map = L.mapbox.map(mapId, 'j0k.g65a64bm', {
    tileLayer: {
      detectRetina: true
    }
  });

  // disable drag and zoom handlers
  // map.dragging.disable();
  // map.touchZoom.disable();
  // map.doubleClickZoom.disable();
  map.scrollWheelZoom.disable();

  // disable tap handler, if present.
  // if (map.tap) map.tap.disable();

  // Add custom popups to each using our custom feature properties
  map.markerLayer.on('layeradd', function(e) {
    var marker = e.layer,
    feature = marker.feature;

    // Create custom popup content
    var popupContent = '<a target="_blank" class="popup" href="' + feature.properties.url + '">' + feature.properties.title + '</a>';

    marker.bindPopup(popupContent,{
      closeButton: false,
      minWidth: 320
    });
  });

  map.markerLayer.setGeoJSON(geoJson);

  if ("undefined" !== typeof geoSetview) {
    // define view is more zoomed: 10
    var zoom = ("undefined" !== typeof geoSetzoom) ? geoSetzoom : 10;

    map.setView(geoSetview, zoom);
  } else if ("undefined" !== typeof geoTagSetview) {
    // tag view might be more global, zommed: 5
    map.setView(geoTagSetview, 5);
  } else if ("undefined" !== typeof geoDefaultSetview) {
    // default view is less zommed: 2
    map.setView(geoDefaultSetview, 2);
  } else {
    // no setview, so we don't show the map
    $('#map').hide();
  }
}
