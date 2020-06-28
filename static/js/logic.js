createMarkers();

const markerSize = (num) => num * 30000;

const markerColor = (num) => {
  switch (true) {
    case num > 7:
      return "#94003a";
    case num > 6:
      return "#a23648";
    case num > 5:
      return "#b05657";
    case num > 4:
      return "#be7366";
    case num > 3:
      return "#ca9077";
    case num > 2:
      return "#d6ac88";
    case num > 1:
      return "#e2c89a";
    case num > 0:
      return "#ffffc5";
    default:
      return "black";
  }
};

function createMarkers() {
  url =
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

  d3.json(url, (data) => {
    eqMag = [];

    for (var i = 0; i < data.length; i++) {
      eqMag.push(data.features[i].properties.mag);
    }
    // console.log(eqMag);

    var eqData = L.geoJSON(data, {
      onEachFeature: (feature, layer) => {
        layer.bindPopup(`
        <h3> ${feature.properties.place} </h3> 
        <hr>
        <p> ${new Date(feature.properties.time)} </p>
        <p> Magnitude: ${feature.properties.mag} </p>
        `);
      },
      pointToLayer: (feature, latlng) => {
        // console.log(
        //   `${feature.properties.place}: ${markerSize(
        //     feature.properties.mag
        //   )}, mag: ${feature.properties.mag}`
        // );
        return L.circle(latlng, {
          radius: markerSize(feature.properties.mag),
          fillColor: markerColor(feature.properties.mag),
          color: markerColor(feature.properties.mag),
        });
      },
    });

    eqLayer = eqData;

    createTectonics();
  });
}

function createTectonics() {
  url =
    "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

  d3.json(url, function (data) {
    // console.log(data);
    tectonicData = L.geoJSON(data);

    createMap();
  });
}

function createMap() {
  var streetmap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © \
        <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> \
        <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY,
    }
  );

  var darkmap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © \
        <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> \
        <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      maxZoom: 18,
      id: "dark-v10",
      accessToken: API_KEY,
    }
  );

  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
  };

  var overlayMaps = {
    "Earth Quakes": eqLayer,
    "Tectonic Plates": tectonicData,
  };

  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [darkmap, eqLayer],
  });

  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend");

    div.innerHTML += `\
    <h4> Earthquake <br> Magnitude </h4> \
    <i style= "background: #94003a"></i> 7+ \
    <br>
    <i style= "background: #a23648"></i> 6 - 7  \
    <br>
    <i style= "background: #b05657"></i> 5 - 6 \
    <br>
    <i style= "background: #be7366"></i> 4 - 5 \
    <br>
    <i style= "background: #ca9077"></i> 3 - 4 \
    <br>
    <i style= "background: #d6ac88"></i> 2 - 3 \
    <br>
    <i style= "background: #e2c89a"></i> 1 - 2 \
    <br>
    <i style= "background: #ffffc5"></i> 0 - 1 \
    <br>
    `;
    return div;
  }

  legend.addTo(myMap);

  console.log(myMap)

  eqLayer.on('tileload', function(e) {
    legend.removeLayer(myMap);;
  });

  // streetmap.on('tileload', function(e) {
  //   myMap.removeLayer(legend);
  // });

  

  L.control.layers(baseMaps, overlayMaps).addTo(myMap);
}
