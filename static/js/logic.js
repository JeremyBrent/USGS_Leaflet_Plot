var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5,
});

var streetmap = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
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
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY,
  }
).addTo(myMap);

// var baseMaps = {
//   "Street Map": streetmap,
//   "Dark Map": darkmap,
// };

url =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

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

d3.json(url, (data) => {
  console.log(data);

  eqMag = [];

  for (var i = 0; i < data.length; i++) {
    eqMag.push(data.features[i].properties.mag);
  }
  console.log(eqMag);

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
      // console.log(feature.properties.mag);
      return L.circle(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.properties.mag),
        color: markerColor(feature.properties.mag),
      });
    },
  }).addTo(myMap);

  // console.log(eqData);
  // var legend = L.control({ position: "bottomright" });
  // legend.onAdd = function (map) {
  //   // console.log(map)
  //   var div = L.DomUtil.create("div", "info legend");
  //   var limits = [...Array(d3.max(feature.properties.mag) + 1).keys()];
  //   // console.log(limits)
  //   var colors = eqData.options.colors;
  //   var labels = [];

  //   // Add min & max
  //   div.innerHTML =
  //     '<div class="labels"><div class="min">' +
  //     limits[0] +
  //     '</div> \
  //   <div class="max">' +
  //     limits[limits.length - 1] +
  //     "</div></div>";

  //   limits.forEach(function (limit, index) {
  //     labels.push('<li style="background-color: ' + colors[index] + '"></li>');
  //   });

  //   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  //   return div;
  // };
  // legend.addTo(myMap);
});

