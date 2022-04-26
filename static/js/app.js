// Connect dropdown
var selection = d3.select("#selDataset");
var rawJson

// Page load
d3.json("samples.json").then(function(dataFromServer) {
    rawJson = dataFromServer;
    console.log(rawJson)
    
    // Use each element from "names" array in data to create new <option> tag
    rawJson.names.forEach(name => selection.append("option").property("value", name).text(name));
    // append -> create the html; create <option>

    // Initialize page data
    chartBuilder();

});


// Page initialization function
function chartBuilder() {
    var currentId = selection.property("value");
    var rawSamples = rawJson.samples;
    var currentSample = rawSamples.filter(person => person.id == currentId)[0]
    // .loc -> dataframe 
    // filter -> list (array)
    // [{}]
    var rawMetadata = rawJson.metadata;
    var currentMetadata = rawMetadata.filter(person => person.id == currentId)[0]

    var demographic = d3.select('#sample-metadata')
    demographic.html("");

    Object.entries(currentMetadata).forEach(([key, value])=> {
        demographic.append("p").html(`<b>${key.toUpperCase()} :</b> ${value}`)
    })
    


    var ageVar = currentMetadata.age;
    var bbVar = currentMetadata.bbtype;
    var ethnVar = currentMetadata.ethnicity;
    var genderVar = currentMetadata.gender;
    var idVar = currentMetadata.id;
    var locVar = currentMetadata.location;
    var wfreqVar = currentMetadata.wfreq;


    // demographics table
    d3.select("#age-td").text(ageVar);
    d3.select("#bbtype-td").text(bbVar);
    d3.select("#ethn-td").text(ethnVar);
    d3.select("#gender-td").text(genderVar);
    d3.select("#id-td").text(idVar);
    d3.select("#loc-td").text(locVar);
    d3.select("#wfreq-td").text(wfreqVar);


    // bar
    var barTrace = {
        y: currentSample.otu_ids.slice(0,10).map(id => `ID ${id}`),
        x: currentSample.sample_values.slice(0,10),
        type: "bar",
        orientation: "h",
        name: "OTU Bar Chart",
        text: currentSample.otu_labels.slice(0,10),
    }

    // layout
    var barLayout = {
        title: "10 Highest OTUs per Sample",
        xaxis:{title: "OTU ID No.", type: "category"},
        yaxis:{title: "Count in Sample"}
    }

    // data to plot
    var barData = [barTrace]

    var responsive = { "responsive":true};
    // Plot data
    Plotly.newPlot("bar", barData, barLayout, responsive)

    // Bubble
    var bubbleTrace = {
        x: currentSample.otu_ids,
        y: currentSample.sample_values,
        mode: 'markers',
        text: currentSample.otu_labels,
        marker: {
            size: currentSample.sample_values,
            color: currentSample.otu_ids,
            colorscale: 'Jet'
        },
        name: "Bacteria (Larger Bubble = Higher Count!)"
    };

    var bubbleData = [bubbleTrace];

    var bubbleLayout = {
        title: "10 Highest OTUs per Sample",
        showlegend: true,
        xaxis: {title:{text:"OTU ID No."}},
        yaxis: {title:{text:"Count in Sample"}},
    };

    Plotly.newPlot('bubble', bubbleData, bubbleLayout, responsive);

    // Gauge
    var gaugeData = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: currentMetadata.wfreq,
            title: { text: "Wash Frequency" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {axis: { range: [null, 10], tickwidth: 5},
                    bar: { color: "lightblue" }
                }
        }
    ];

    var gaugeLayout = { width: 600,
        height: 500,
        margin: { t: 0, b: 0 }
    };

    Plotly.newPlot('gauge', gaugeData, gaugeLayout, responsive);
}
