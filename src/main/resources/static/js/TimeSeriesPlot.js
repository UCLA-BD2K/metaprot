
// global variables to hold result data received from server
var globalData;
var globalSig;


var initTimeSeriesData = function(data, sig) {
    globalData = data;
    globalSig = sig;
}

// generates Time Series Viewer plot, based on metabolite user selects
var generateTimeSeriesViewer = function(metabolite) {
    var width = 650;
    var height = 400;
    var padding = 30;
    var barWidth = 30;
    var margin = {top: 10, left: 10}

    var data = globalData.filter(function(data) {
        return data.metaboliteName == metabolite;
    });
    var sig = globalSig.filter(function(data) {
        return data.metaboliteName == metabolite;
    })[0].significanceValues;

    // prepend header row to retain timepoints
    data.unshift(globalData[0])
    // timepoint 0 NOT significant by default
    sig.unshift("FALSE");

    // organize data to draw boxplots
    var groupCounts = {};   // group concentrations by timepoints
    var globalCounts = [];  // used to find min/max value
    var sigValues = {};     // group significance (true/false) by timepoints

    // group data by timepoints
    for (var i = 0; i < data[0].values.length; i++) {
        var timepoint = data[0].values[i];
        groupCounts[timepoint] = [];
        sigValues[timepoint] = sig[i];
        for (var j = 1; j < data.length; j++) {
            var entry = Number(data[j].values[i])
            groupCounts[timepoint].push(entry);
            globalCounts.push(entry);
        }
    }

    // Sort group counts so quantile methods work
    for(var key in groupCounts) {
      var groupCount = groupCounts[key];
      groupCounts[key] = groupCount.sort(sortNumber);
    }

    // Prepare the data for the box plots
    var boxPlotData = [];   // each element will be a boxplot for a timepoint
    var outliers = {};      // keep track of outliers to help when plotting individual points later
    for (var [key, groupCount] of Object.entries(groupCounts)) {

        var record = {};

        record["key"] = key;
        record["color"] = sigValues[key] == "TRUE" ? "black" : "gray";
        record["strokeWidth"] = sigValues[key] == "TRUE" ? 2 : 1;
        record["quartile"] = boxQuartiles(groupCount);

        outliers[key] = [];

        var q1Val = record["quartile"][0];
        var q3Val = record["quartile"][2];
        var iqr = q3Val - q1Val;

        var index = 0;
        var lowerWhisker = Infinity;
        var upperWhisker = -Infinity;

        //search for the lower whisker, the mininmum value within q1Val - 1.5*iqr
        while (index < groupCount.length && lowerWhisker == Infinity) {

            if (groupCount[index] >= (q1Val - 1.5*iqr))
                lowerWhisker = groupCount[index];
            else
                outliers[key].push(groupCount[index]);
            index++;
        }

        index = groupCount.length-1; // reset index to end of array

        //search for the upper whisker, the maximum value within q1Val + 1.5*iqr
        while (index >= 0 && upperWhisker == -Infinity) {

            if (groupCount[index] <= (q3Val + 1.5*iqr))
                upperWhisker = groupCount[index];
            else
                outliers[key].push(groupCount[index]);
            index--;
        }


        record["whiskers"] = [lowerWhisker, upperWhisker];
        record["counts"] = groupCount;
        boxPlotData.push(record);
    }

    // Compute a global x scale for the keys in boxPlotData
    var timepoints = Object.keys(groupCounts).map(function(x) { return Number(x); });
    var xMin = d3.min(timepoints);
    var xMax = d3.max(timepoints);
    console.log(timepoints)
    console.log(xMin + " " + xMax);
    var xScale = d3.scaleLinear()
        .domain([xMin, xMax+1])
        .range([padding, width-padding]);

    // Compute a global y scale based on the global counts
    var yMin = d3.min(globalCounts);
    var yMax = d3.max(globalCounts);
    var yScale = d3.scaleLinear()
        .domain([yMin, yMax])
        .range([height-padding, padding]);

    // Remove exiting plot(s) and setup the svg and group we will draw the box plot in
    var plotDiv = d3.select("#plot");
    plotDiv.selectAll("svg").remove();
    var svg = plotDiv.append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // plot axes
    var axisG = svg.append("g")
    var axisBottomG = svg.append("g").attr("transform", "translate(0,"+(height-padding)+")");

    // Setup the group the box plot elements will render in
    var g = svg.append("g");

    // Draw the box plot vertical lines
    var topVerticalLines = g.selectAll(".verticalLines")
        .data(boxPlotData)
        .enter()
        .append("line")
        .attr("x1", function(d) { return xScale(d.key); })
        .attr("y1", function(d) { return yScale(d.whiskers[0]); })
        .attr("x2", function(d) { return xScale(d.key); })
        .attr("y2", function(d) { return yScale(d.quartile[0]); })
        .attr("stroke", function(d) { return d.color;})
        .attr("stroke-width",  function(d) { return d.strokeWidth;})
        .attr("fill", "none");


    // Draw the box plot vertical lines
    var bottomVerticalLines = g.selectAll(".verticalLines")
    .data(boxPlotData)
    .enter()
    .append("line")
    .attr("x1", function(d) { return xScale(d.key); })
    .attr("y1", function(d) { return yScale(d.whiskers[1]); })
    .attr("x2", function(d) { return xScale(d.key); })
    .attr("y2", function(d) { return yScale(d.quartile[2]); })
    .attr("stroke", function(d) { return d.color; })
    .attr("stroke-width", function(d) { return d.strokeWidth;})
    .attr("fill", "none");

    // Draw the boxes of the box plot, filled in white and on top of vertical lines
    var rects = g.selectAll("rect")
        .data(boxPlotData)
        .enter()
        .append("rect")
        .attr("width", barWidth)
        .attr("height", function(d) {
            var quartiles = d.quartile;
            var height = yScale(quartiles[0]) - yScale(quartiles[2]);
            return height;
          }
        )
        .attr("x", function(d) {
            return xScale(d.key) - barWidth/2 ;
          }
        )
        .attr("y", function(d) {
            return yScale(d.quartile[2]);
          }
        )
        .attr("fill", "none")
        .attr("stroke", function(d) { return d.color; })
        .attr("stroke-width", function(d) { return d.strokeWidth;})

    // Now render all the horizontal lines at once - the whiskers and the median
    var horizontalLineConfigs = [
        // Top whisker
        {
          x1: function(d) { return xScale(d.key) - barWidth/2 },
          y1: function(d) { return yScale(d.whiskers[0]) },
          x2: function(d) { return xScale(d.key) + barWidth/2 },
          y2: function(d) { return yScale(d.whiskers[0]) }
        },
        // Median line
        {
          x1: function(d) { return xScale(d.key) - barWidth/2 },
          y1: function(d) { return yScale(d.quartile[1]) },
          x2: function(d) { return xScale(d.key) + barWidth/2 },
          y2: function(d) { return yScale(d.quartile[1]) }
        },
        // Bottom whisker
        {
          x1: function(d) { return xScale(d.key) - barWidth/2  },
          y1: function(d) { return yScale(d.whiskers[1]) },
          x2: function(d) { return xScale(d.key) + barWidth/2 },
          y2: function(d) { return yScale(d.whiskers[1]) }
        }
    ];

    for(var i=0; i < horizontalLineConfigs.length; i++) {
    var lineConfig = horizontalLineConfigs[i];

    // Draw the whiskers at the min for this series
    var horizontalLine = g.selectAll(".whiskers")
      .data(boxPlotData)
      .enter()
      .append("line")
      .attr("x1", lineConfig.x1)
      .attr("y1", lineConfig.y1)
      .attr("x2", lineConfig.x2)
      .attr("y2", lineConfig.y2)
      .attr("stroke", function(d) { return d.color; })
      .attr("stroke-width", function(d) { return d.strokeWidth;})
      .attr("fill", "none");
    }

    // Setup a scale on the left
    var axisLeft = d3.axisLeft(yScale);
        axisG.append("g")
        .call(axisLeft);

    // Setup a series axis on the top
    var axisBottom = d3.axisBottom(xScale).tickValues(timepoints);
        axisBottomG.append("g")
        .call(axisBottom);



    var dataset = [];
    var legend = [];
    console.log(boxPlotData);
    for (var i = 1; i < data.length; i++) {
      var strain = [];
      for (var j = 0; j < data[0].values.length; j++) {
          dataset.push({
              x: Number(data[0].values[j]),
              y: Number(data[i].values[j]),
              id: data[i].strain,
              outlier: outliers[data[0].values[j]].includes(Number(data[i].values[j]))
          });
      }
      legend.push(data[i].strain);
    }
    console.log(outliers);

    console.log(dataset);
    // Setup a color scale for each strain
    var colorScaleStrain = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(legend);

    g.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", function(d) { return "circle-" + d.id; })
        .attr("r", 3.5)
        .attr("cx", function(d) { return xScale(d.x); })
        .attr("cy", function(d) { return yScale(d.y); })
        .style("fill", function(d) { return d.outlier ? "gray" : colorScaleStrain(d.id); });

    var strainAvgs = d3.nest()
        .key(function(d) { return d.id; })
        .key(function(d) { return d.x; })
        .rollup(function(v) { return { avg: d3.mean(v, function(d) { return d.y})}})
        .entries(dataset);


    var pathData = [];

    var valueline = d3.line()
            .x(function(d) { return xScale(Number(d.key)); })
            .y(function(d) { return yScale(Number(d.value.avg)); });


    g.selectAll("path")
        .data(strainAvgs)
        .enter()
        .append("path")
        .attr("class", function(d) { return "line-" + d.key })
        .style("stroke", function(d) { return colorScaleStrain(d.key); })
        .style("stroke-width", 1)
        .attr("fill", "none")
        .attr("d", function(d) { return valueline(d.values)})
        .attr("data-legend", function(d) { return d.key; })
        .on("mouseover", function (d) {
            highlightData(d.key, true);
        })
        .on("mouseout", function (d) {
            highlightData(d.key, false);
        });

    // draw legend
    var legendRectSize = 18;
    var legendSpacing = 5;
    var legend = svg.selectAll('.legend')
        .data(colorScaleStrain.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing;
            var offset =  height * colorScaleStrain.domain().length / 2;
            var horz = width;
            var vert = i * height+ padding;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', colorScaleStrain)
        .style('stroke', colorScaleStrain)
        .on("mouseover", function (d) {
            highlightData(d, true);
        })
        .on("mouseout", function (d) {
            highlightData(d, false);
        });

    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .attr('class', function(d) { return 'legend-'+d; })
        .text(function(d) { return d; })
        .on("mouseover", function (d) {
            highlightData(d, true);
        })
        .on("mouseout", function (d) {
            highlightData(d, false);
        })




 }

function highlightData(id, highlighted) {
    if (highlighted) {
        d3.selectAll(".line-"+id).style("stroke-width", 5);
        d3.selectAll(".legend-"+id).style("font-weight", "bold");
    }
    else {
        d3.selectAll(".line-"+id).style("stroke-width", 1);
        d3.selectAll(".legend-"+id).style("font-weight", "normal");
    }
}


function boxQuartiles(d) {
    return [
        d3.quantile(d, .25),
        d3.quantile(d, .5),
        d3.quantile(d, .75)
    ];
}

// Perform a numeric sort on an array
function sortNumber(a,b) {
    return a - b;
}



