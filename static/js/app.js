// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let metadataresult = metadata.filter(row => row.id === parseInt(sample))[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    let metadata_keys = Object.keys(metadataresult); // retrieves all the keys from the metadata_result object and stores them in an array called metadata_keys.
    for (let i = 0; i < metadata_keys.length; i++) {
      // get key/value pair
      let key = metadata_keys[i]; 
      let value = metadataresult[key];

      // add to html
      panel.append("p").text(`${key}: ${value}`);
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    samplesresult = samples.filter(obj => obj.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = samplesresult.otu_ids;
    let otu_labels = samplesresult.otu_labels;
    let sample_values = samplesresult.sample_values;

    // Build a Bubble Chart
    let trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "firebrick"
      }
    };

    // Data trace array
    let bubbletraces = [trace1];

    // Apply a title to the layout
    let bublelayout = {
        title: {
            text: `Bacteria Cultures Per Sample`
        },
        yaxis: {
            title: {
                text: 'Number of Bacteria'
            }
        },
        xaxis: {
            title: {
                text: 'OTU ID'
            }
        },
        height: 600
    };

    // Render the bubble chart
    Plotly.newPlot('bubble', bubbletraces, bublelayout);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
      let tenotuvalues = sample_values.slice(0, 10).reverse();
      let tenotuids = otu_ids.slice(0, 10).reverse();
      let tenlabels = otu_labels.slice(0, 10).reverse();
  
      let trace2 = {
      x: tenotuvalues,
      y: tenotuids.map(id => `OTU ${id}`),
      text: tenlabels,
      name: "OTU",
      type: "bar",
      orientation: "h",
      marker: {
        color: "green" 
    }
  };
  
  // Data Array
  let bartraces = [trace2];
  
  // Layout object
  let barlayout = {
    title: "Top 10 Bacteria Cultures Found",
    margin: {
      l: 100,
      r: 100,
      t: 100,
      b: 100
    }
  };

  // Render the Bar Chart
  Plotly.newPlot("bar", bartraces, barlayout);
});
}


// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    console.log(names);

    for (let i = 0; i < names.length; i++) {
      let name = names[i];

      // Create option
      dropdown.append("option").text(name); //.property("value", name);
    }


    // Get the first sample from the list
    let first_sample = names[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(first_sample);
    buildCharts(first_sample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
