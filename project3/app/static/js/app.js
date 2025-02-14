// Use D3 to select the table

// Use D3 to create a bootstrap striped table
// https://getbootstrap.com/docs/5.3/content/tables/#striped-rows

// Use D3 to select the table body

// BONUS: Dynamic table
// Loop through an array of grades and build the entire table body from scratch


// Use D3 to select the table
let table = d3.select("#ev_charging_stations_table");
let tbody = table.select("tbody");

// Make Table Interactive
let dt_table = new DataTable('#ev_charging_stations_table');

// Event Listener
d3.select("#filter-btn").on("click", function () {
  doWork();
});

// On Page Load
doWork();

// Helper Functions
function doWork() {
  // Fetch the JSON data and console log it
  d3.json("/api/v1.0/bar_data").then(function (data) {
    // Make Plot
    makeBarPlot(data);
});

    d3.json("/api/v1.0/table_data").then(function (data2) {
    // Make Plot
    console.log(data2)
    makeTable(data2);
});
}

function makeTable(data) {
  // Clear Table
  tbody.html("");
  dt_table.clear().destroy();

  // Create Table

  for (let i = 0; i < data.length; i++) {
    let row = data[i];


    // Create Table Row
    let table_row = tbody.append("tr");

    // Append Cells
    table_row.append("td").text(row.Latitude);
    table_row.append("td").text(row.Longitude);
    table_row.append("td").text(row["Charger Type"]);
    table_row.append("td").text(row.NumberOfStations);

  }


  // Make Table Interactive (again)
  
  dt_table = new DataTable('#ev_charging_stations_table', {
    order: [[4, 'desc']] // Sort by column 4 desc
  });

}

function makeBarPlot(data) {
  // Create Trace
  let trace = {
    y: data.map(row => row.station_count),
    x: data.map(row => row["Installation Year"]),
    type: 'bar',
    marker: {
      color: 'firebrick'
    },
  }

  // Data trace array
  let traces = [trace];

  // Apply a title to the layout
  let layout = {
    title: {
      text: `Charging Stations Installed Per Year`
    },
    yaxis: {
      title: {
        text: 'Station Count'
      }
    },
    xaxis: {
      title: {
        text: 'Installation Year'
      }
    },
    height: 600
  }

  // Render the plot to the div tag with id "plot"
  Plotly.newPlot('plot', traces, layout);
}