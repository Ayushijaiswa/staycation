

  

   const MAPTILER_KEY =mapApiKey;
  const map = new maplibregl.Map({
      style:`https://api.maptiler.com/maps/basic-v2/style.json?key=${MAPTILER_KEY}`,
      center:coordinates,
      zoom: 7,
      pitch: 45,
      bearing: -17.6,
      container: 'map',
      antialias: true
  });

  // The 'building' layer in the streets vector source contains building-height
  // data from OpenStreetMap.
  map.on('load', () => {
      // Insert the layer beneath any symbol layer.
      const layers = map.getStyle().layers;

      let labelLayerId;
      for (let i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
              labelLayerId = layers[i].id;
              break;
          }
      }

      map.addSource('openmaptiles', {
          url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${MAPTILER_KEY}`,
          type: 'vector',
      });

      map.addLayer(
          {
              'id': '3d-buildings',
              'source': 'openmaptiles',
              'source-layer': 'building',
              'type': 'fill-extrusion',
              'minzoom': 15,
              'paint': {
                  'fill-extrusion-color': [
                      'interpolate',
                      ['linear'],
                      ['get', 'render_height'], 0, 'lightgray', 200, 'royalblue', 400, 'lightblue'
                  ],
                  'fill-extrusion-height': [
                      'interpolate',
                      ['linear'],
                      ['zoom'],
                      15,
                      0,
                      16,
                      ['get', 'render_height']
                  ],
                  'fill-extrusion-base': ['case',
                      ['>=', ['get', 'zoom'], 16],
                      ['get', 'render_min_height'], 0
                  ]
              }
          },
          labelLayerId
      );
  });

   console.log(coordinates)

  let marker = new maplibregl.Marker()
  .setLngLat(coordinates)
  .setPopup(new maplibregl.Popup({offset:25,className:"my-class"})
  .setHTML("<h5>Location will be provided after landing</h4>"))
  .addTo(map); // add the marker to the map