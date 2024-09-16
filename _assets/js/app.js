//= require fastclick
//= require foundation
//= require foundation.clearing
//= require foundation.orbit
//= require foundation.topbar

$(function() {
  $('#search').find('input.button').on('click', function() {
    return search();
  });

  $('#search-query').on('keyup', function() {
    return search();
  });

  function search() {
    var query   = $('#search-query').val();
    var result  = $('#search-results');
    var entries = result.find('.entries');

    if (query.length <= 2) {
      result.hide();
      entries.empty();
      $('#map').show();
    } else {
      $('#map').hide();
      var client = $.algolia.Client('QKW967ZRAA', '6e89ccd38463d0bfa572994f678d66cd');
      var index = client.initIndex('blog_posts');

      index.search(query, { hitsPerPage: 10 }, function searchDone(err, content) {
        var results = content.hits;

        entries.empty();

        if (results && results.length > 0) {
          $.each(results, function(key, post) {
            var date = new Date(post.date),
                day = date.getDate().toString().length == 1 ? '0'+date.getDate() : date.getDate(),
                month = date.getMonth()+1,
                month = month.toString().length == 1 ? '0'+month : month;

            entries.append('<article>'+
            '  <h4>'+
            '    <small><time>'+day+'/'+month+'/'+date.getFullYear()+'</time> »</small>'+
            '    <a href="'+post.url+'">'+post.title+'</a>'+
            '  </h4>'+
            '</article>');
          });
        } else {
          entries.append('<p>Aucun article trouvé :-(</p>');
        }

        result.show();
      });
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
    $('#map').hide();
  }

  mapboxgl.accessToken = 'pk.eyJ1IjoiajBrIiwiYSI6ImNrOGlzbDB3YzAybzczZ3FpcTJyaXFpdjYifQ._v6Om2_LkhJALoyKIRRa7g';
  var map = new mapboxgl.Map({
    container: mapId,
    style: 'mapbox://styles/j0k/ciwts6fc100822pnyaro48h27?optimize=true'
  });

  // disable map zoom when using scroll
  map.scrollZoom.disable();

  map.on('load', function() {
    map.addSource('places', {
      'type': 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': geoJson,
      },
    })

    // Add a layer showing the places.
    map.addLayer({
      'id': 'places',
      'type': 'symbol',
      'source': 'places',
      'layout': {
        'icon-image': 'attraction-15',
        'icon-allow-overlap': true,
        'icon-size': 1.5
      }
    });

    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on('click', 'places', function(e) {
      var coordinates = e.features[0].geometry.coordinates.slice();

      // Create custom popup content
      var popupContent = '<a target="_blank" class="popup" href="' + e.features[0].properties.url + '">' + e.features[0].properties.title + '</a>';

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup({
          closeButton: false,
        })
        .setLngLat(coordinates)
        .setHTML(popupContent)
        .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'places', function() {
      map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'places', function() {
      map.getCanvas().style.cursor = '';
    });
  });

  if ("undefined" !== typeof geoSetview) {
    // define view is more zoomed: 10
    map.setCenter(geoSetview);
    map.setZoom(("undefined" !== typeof geoSetzoom) ? geoSetzoom : 9);
  } else if ("undefined" !== typeof geoTagSetview) {
    // tag view might be more global, zommed: 5
    map.setCenter(geoTagSetview);
    map.setZoom(("undefined" !== typeof geoSetzoom) ? geoSetzoom : 4);
  } else if ("undefined" !== typeof geoDefaultSetview) {
    // default view is less zommed: 1
    map.setCenter(geoDefaultSetview);
    map.setZoom(1);
  } else {
    // no setview, so we don't show the map
    $('#map').hide();
  }
}
