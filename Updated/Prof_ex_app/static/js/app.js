// app.js

// Use D3 to select the table
let table = d3.select("#earthquake_table");
let tbody = table.select("tbody");

// Make Table Interactive (but don't populate it yet)
let dt_table; // Declare dt_table here so it's accessible in all functions


// Event Listener for Country Select
d3.select("#country-select").on("change", function () {
  makeBarPlotData(); // Call function for bar plot
});

// Event Listener for Address Search (using "input" event for live updates)
d3.select("#address-search").on("input", function () {
  makeTableData(); // Call function for table data
});


// Helper Functions

function makeBarPlotData() {
  let country = d3.select("#country-select").property("value");
  let url1 = `/api/v1.0/bar_data/${country}`;

  d3.json(url1).then(function (data) {
    makeBarPlot(data);
  }).catch(function(error) {
    console.error("Error fetching bar data:", error);
    Plotly.newPlot('plot', [], {title: "Error loading data"}); // Clear the plot or show an error message
  });
}

function makeTableData() {
  let address_part = d3.select("#address-search").property("value");
  let url2 = `/api/v1.0/table_data/${address_part}`;

  d3.json(url2).then(function (data) {
    makeTable(data);
  }).catch(function(error) {
    console.error("Error fetching table data:", error);
    tbody.html("");
    if ($.fn.DataTable.isDataTable('#earthquake_table')) {
      dt_table.clear().destroy();
    }
    let row = tbody.append("tr");
    row.append("td").attr("colspan", 6).text("Error loading data.");
  });
}


function makeTable(data) {
  tbody.html(""); // Clear the table body

  if ($.fn.DataTable.isDataTable('#earthquake_table')) {
    dt_table.clear().destroy();
  }

  for (let i = 0; i < data.length; i++) {
    let row = data[i];
    let table_row = tbody.append("tr");
    table_row.append("td").text(row.sid);
    table_row.append("td").text(row.address);
    table_row.append("td").text(row.lng);
    table_row.append("td").text(row.lat);
    table_row.append("td").text(row.ct);
    table_row.append("td").text(row.avail);
  }

  dt_table = new DataTable('#earthquake_table', {
    order: [[0, 'desc']]
  });
}

function makeBarPlot(data) {
  let trace = {
    x: data.map(row => row.city),
    y: data.map(row => row.city_count),
    type: 'bar',
    marker: {
      color: 'firebrick'
    }
  };

  let traces = [trace];

  let layout = {
    title: {
      text: `Number of Stations by City`
    },
    yaxis: {
      title: {
        text: 'Number of Stations'
      }
    },
    xaxis: {
      title: {
        text: 'City Name'
      }
    },
    height: 600
  };

  Plotly.newPlot('plot', traces, layout);
}

// Initial Bar Plot (Optional - if you want a default plot on load)
makeBarPlotData();