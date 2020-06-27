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
    case (num > 7):
      return '#94003a';
    case (num > 6):
      return "#a23648";
    case (num > 5): 
      return "#b05657";
    case (num > 4): 
      return "#be7366";
    case (num > 3): 
      return "#ca9077";
    case (num > 2): 
      return "#d6ac88";
    case (num > 1): 
      return "#e2c89a";
    case (num > 0): 
      return "#ffffc5";
    default:
      return "black";
  }
};


d3.json(url, (data) => {
  console.log(data);
  L.geoJSON(data, {
    onEachFeature: (feature, layer) => {
      layer.bindPopup(`
        <h3> ${feature.properties.place} </h3> 
        <hr>
        <p> ${new Date(feature.properties.time)} </p>
        <p> Magnitude: ${feature.properties.mag} </p>
        `
      );
    }, 
    pointToLayer: (feature, latlng) => {
      console.log(feature.properties.mag);
      return L.circle(latlng, 
        {radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.properties.mag),
        color: markerColor(feature.properties.mag),
      });
    },
  }).addTo(myMap);
});

// L.circle(earthquakes.features[i].geometry.coordinates, {
//   fillOpacity: 0.75,
//   color: "white",
//   fillColor: "purple",
//   // Setting our circle's radius equal to the output of our markerSize function
//   // This will make our marker's size proportionate to the magnitude of the EQ
//   radius: earthquakes.feature[i].properties.mag,
// })
//   .bindPopup(
//     `<h3> ${feature.properties.place} </h3>
//         <hr>
//         <p> ${new Date(feature.properties.time)} </p>
//         <p> Magnitude: ${feature.properties.mag} </p>`
//   )
//   .addTo(myMap);

// function createMap(earthquakes) {
//   // Define streetmap and darkmap layers

//   console.log(earthquakes.geometry);
//   // Loop through the cities array and create one marker for each city object
//   for (var i = 0; i < earthquakes.length; i++) {}

//   // Define a baseMaps object to hold our base layers

//   // Create overlay object to hold our overlay layer
//   var overlayMaps = {
//     Earthquakes: earthquakes,
//   };

//   // Create our map, giving it the streetmap and earthquakes layers to display on load

//   // Create a layer control
//   // Pass in our baseMaps and overlayMaps
//   // Add the layer control to the map
// }

// function createFeatures(earthquakeData) {
//   // Define a function we want to run once for each feature in the features array
//   // Give each feature a popup describing the place and time of the earthquake
//   function onEachFeature(feature, layer) {
//     layer;
//   }

//   // Create a GeoJSON layer containing the features array on the earthquakeData object
//   // Run the onEachFeature function once for each piece of data in the array
//   var earthquakes = L.geoJSON(earthquakeData, {
//     onEachFeature: onEachFeature,
//   });

//   // Sending our earthquakes layer to the createMap function
//   createMap(earthquakes);
//   console.log(earthquakes);
// }
