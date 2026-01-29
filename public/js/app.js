$(() => {
  $('#search')
    .find('input.button')
    .on('click', () => search());

  $('#search-query').on('keyup', () => search());

  function formatDate(value) {
    if (!value) {
      return '';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${date.getFullYear()}`;
  }

  async function search() {
    const query = $('#search-query').val();
    const result = $('#search-results');
    const entries = result.find('.entries');

    if (query.length <= 2) {
      result.hide();
      entries.empty();
      $('#map').show();
    } else {
      $('#map').hide();

      try {
        const pagefind = await import('/pagefind/pagefind.js');
        pagefind.init();

        const search = await pagefind.debouncedSearch(query, { filters: { type: 'post' } });

        entries.empty();

        if (search?.results?.length > 0) {
          const readyResults = await Promise.all(search.results.slice(0, 10).map((r) => r.data()));
          readyResults.forEach((post) => {
            const dateLabel = formatDate(post.meta?.date);
            const dateMarkup = dateLabel ? `<small><time>${dateLabel}</time> »</small>` : '';

            entries.append(
              `<article><h4>${dateMarkup} <a href="${post.url}">${post.meta.title}</a></h4></article>`,
            );
          });
        } else {
          entries.append('<p>Aucun article trouvé :-(</p>');
        }

        result.show();
      } catch (_error) {
        entries.empty();
        entries.append('<p>Aucun article trouvé :-(</p>');
        result.show();
      }
    }

    return false;
  }
});

/**
 * Displaying the map !
 */
if ('undefined' !== typeof geoJson) {
  $('#map').show();

  let mapId = 'map';
  if ($('#bigmap').length) {
    mapId = 'bigmap';
    $('#map').hide();
  }

  L.mapbox.accessToken =
    'pk.eyJ1IjoiajBrIiwiYSI6ImNrOGlzbDB3YzAybzczZ3FpcTJyaXFpdjYifQ._v6Om2_LkhJALoyKIRRa7g';

  const map = L.mapbox
    .map(mapId)
    .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));

  // disable drag and zoom handlers
  // map.dragging.disable();
  // map.touchZoom.disable();
  // map.doubleClickZoom.disable();
  map.scrollWheelZoom.disable();

  // disable tap handler, if present.
  // if (map.tap) map.tap.disable();

  // Add custom popups to each using our custom feature properties
  L.mapbox
    .featureLayer(geoJson)
    .addTo(map)
    .eachLayer((layer) => {
      // Create custom popup content
      const popupContent =
        '<a target="_blank" class="popup" href="' +
        layer.feature.properties.url +
        '">' +
        layer.feature.properties.title +
        '</a>';

      layer.bindPopup(popupContent, {
        closeButton: false,
        minWidth: 320,
      });
    });

  if ('undefined' !== typeof geoSetview) {
    // define view is more zoomed: 10
    map.setView(geoSetview, 'undefined' !== typeof geoSetzoom ? geoSetzoom : 10);
  } else if ('undefined' !== typeof geoTagSetview) {
    // tag view might be more global, zommed: 5
    map.setView(geoTagSetview, 'undefined' !== typeof geoSetzoom ? geoSetzoom : 5);
  } else if ('undefined' !== typeof geoDefaultSetview) {
    // default view is less zommed: 2
    map.setView(geoDefaultSetview, 2);
  } else {
    // no setview, so we don't show the map
    $('#map').hide();
  }
}
