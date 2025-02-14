function createMap() {
    // Delete Map
    let map_container = d3.select("#map_container");
    map_container.html(""); // empties it
    map_container.append("div").attr("id", "map"); //recreate it
  
  
    // Step 1: CREATE THE BASE LAYERS
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  

    // Assemble the API query URL.
    let url = "/api/v1.0/map_data";
    console.log(url);
  
    d3.json(url).then(function (data) {
      // Step 2: CREATE THE DATA/OVERLAY LAYERS
      console.log(data);
  
      // Initialize the Cluster Group
      let heatArray = [];
      let markers = L.markerClusterGroup();
  
      // Loop and create marker
      for (let i = 0; i < data.length; i++){
        let row = data[i];
        if(location){
        let marker = L.marker([row.Latitude, row.Longitude]).bindPopup(`<h1>${row["Charger Type"]}</h1>`);
        markers.addLayer(marker);
      
  
          // Heatmap point
          heatArray.push(row.Latitude, row.Longitude);
        }
      }
  
      // Create Heatmap Layer
      let heatLayer = L.heatLayer(heatArray, {
        radius: 25,
        blur: 10
      });
  
        // Step 3: CREATE THE LAYER CONTROL
        let baseMaps = {
          Street: street,
          Topography: topo
        };
  
        let overlayMaps = {
          HeatMap: heatLayer,
          Ev_charging_stations: markers
        };
  

  
        // Step 4: INITIALIZE THE MAP
        let myMap = L.map("map", {
          center: [40.7128, -74.0059],
          zoom: 7,
          layers: [street, markers]
        });
  
        // Step 5: Add the Layer Control, Legend, Annotations as needed
        L.control.layers(baseMaps, overlayMaps).addTo(myMap);
      });
  }
  
  function init() {
    // let complaint_type = d3.select("#complaint_type").property("value");
    createMap();
  }
  
  // on page load
  init();
