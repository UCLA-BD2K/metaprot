
var generateBoxPlot = function(data) {
    var width = 650;
    var height = 400;
    var padding = 30;
    var barWidth = 30;
    var margin = {top: 10, left: 25}

    var groupCounts = {};
    var globalCounts = [];

    // group data by time points
    for (var i = 0; i < data[0].dataValue.length; i++) {
        var key = data[0].dataValue[i];
        groupCounts[key] = [];
        for (var j = 1; j < data.length; j++) {
            var entry = Number(data[j].dataValue[i])
            groupCounts[key].push(entry);
            globalCounts.push(entry);
        }
    }
    console.log(data);
    console.log(groupCounts);

    // Sort group counts so quantile methods work
    for(var key in groupCounts) {
      var groupCount = groupCounts[key];
      groupCounts[key] = groupCount.sort(sortNumber);
    }


  // Prepare the data for the box plots
  var boxPlotData = [];
  for (var [key, groupCount] of Object.entries(groupCounts)) {

    var record = {};
    var sortedData = groupCount.sort(d3.ascending)

    record["key"] = key;
    record["outliers"] = []
    record["counts"] = groupCount;
    record["quartile"] = boxQuartiles(groupCount);

    var q1Val = record["quartile"][0];
    var q3Val = record["quartile"][2];
    var iqr = q3Val - q1Val;

    var index = 0;
    var lowerWhisker = Infinity;
    var upperWhisker = -Infinity;

    //search for the lower whisker, the mininmum value within q1Val - 1.5*iqr
    while (index < sortedData.length && lowerWhisker == Infinity) {

        if (sortedData[index] >= (q1Val - 1.5*iqr))
          lowerWhisker = sortedData[index];
        else
          record["outliers"].push(sortedData[index]);
        index++;
    }

    index = sortedData.length-1; // reset index to end of array

    //search for the upper whisker, the maximum value within q1Val + 1.5*iqr
    while (index >= 0 && upperWhisker == -Infinity) {

      if (sortedData[index] <= (q3Val + 1.5*iqr))
          upperWhisker = sortedData[index];
      else
          record["outliers"].push(sortedData[index]);
      index--;
    }


    record["whiskers"] = [lowerWhisker, upperWhisker];
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

  // Setup the svg and group we will draw the box plot in
  var svg = d3.select("#boxplot").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var axisG = svg.append("g")//.attr("transform", "translate(25,0)");
  var axisBottomG = svg.append("g").attr("transform", "translate(0,"+height+")");

  // Setup the group the box plot elements will render in
  var g = svg.append("g")
  //  .attr("transform", "translate(20,5)");

  // Draw the box plot vertical lines
  var topVerticalLines = g.selectAll(".verticalLines")
    .data(boxPlotData)
    .enter()
    .append("line")
    .attr("x1", function(datum) {
        return xScale(datum.key);
      }
    )
    .attr("y1", function(datum) {
        var whisker = datum.whiskers[0];
        return yScale(whisker);
      }
    )
    .attr("x2", function(datum) {
        return xScale(datum.key);
      }
    )
    .attr("y2", function(datum) {
        var whisker = datum.whiskers[1];
        var quartiles = datum.quartile;
        return yScale(quartiles[0]);
      }
    )
    .attr("stroke", "#000")
    .attr("stroke-width", 1)
    .attr("fill", "none");

    // Draw the box plot vertical lines
    var bottomVerticalLines = g.selectAll(".verticalLines")
      .data(boxPlotData)
      .enter()
      .append("line")
      .attr("x1", function(datum) {
          return xScale(datum.key);
        }
      )
      .attr("y1", function(datum) {
          var whisker = datum.whiskers[1];
          return yScale(whisker);
        }
      )
      .attr("x2", function(datum) {
          return xScale(datum.key);
        }
      )
      .attr("y2", function(datum) {
          var whisker = datum.whiskers[1];
          var quartiles = datum.quartile;
          return yScale(quartiles[2]);
        }
      )
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("fill", "none");

  // Draw the boxes of the box plot, filled in white and on top of vertical lines
  var rects = g.selectAll("rect")
    .data(boxPlotData)
    .enter()
    .append("rect")
    .attr("width", barWidth)
    .attr("height", function(datum) {
        var quartiles = datum.quartile;
        var height = yScale(quartiles[0]) - yScale(quartiles[2]);
        return height;
      }
    )
    .attr("x", function(datum) {
        return xScale(datum.key) - barWidth/2 ;
      }
    )
    .attr("y", function(datum) {
        return yScale(datum.quartile[2]);
      }
    )
    .attr("fill", "none")
    .attr("stroke", "gray")
    .attr("stroke-width", 1);

  // Now render all the horizontal lines at once - the whiskers and the median
  var horizontalLineConfigs = [
    // Top whisker
    {
      x1: function(datum) { return xScale(datum.key) - barWidth/2 },
      y1: function(datum) { return yScale(datum.whiskers[0]) },
      x2: function(datum) { return xScale(datum.key) + barWidth/2 },
      y2: function(datum) { return yScale(datum.whiskers[0]) }
    },
    // Median line
    {
      x1: function(datum) { return xScale(datum.key) - barWidth/2 },
      y1: function(datum) { return yScale(datum.quartile[1]) },
      x2: function(datum) { return xScale(datum.key) + barWidth/2 },
      y2: function(datum) { return yScale(datum.quartile[1]) }
    },
    // Bottom whisker
    {
      x1: function(datum) { return xScale(datum.key) - barWidth/2  },
      y1: function(datum) { return yScale(datum.whiskers[1]) },
      x2: function(datum) { return xScale(datum.key) + barWidth/2 },
      y2: function(datum) { return yScale(datum.whiskers[1]) }
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
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
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

  for (var i = 1; i < data.length; i++) {
      var strain = [];
      for (var j = 0; j < data[0].dataValue.length; j++) {
          strain.push({
              x: Number(data[0].dataValue[j]),
              y: Number(data[i].dataValue[j]),
              id: data[i].id
          });
      }
      dataset.push(strain);
      legend.push(data[i].id);
  }

  // Setup a color scale for each strain
    var colorScaleStrain = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(legend);



  for (var i = 0; i < dataset.length; i++) {
        // draw path
        // define the line
        var valueline = d3.line()
            .x(function(d) { return xScale(d.x); })
            .y(function(d) { return yScale(d.y); });

        g.append("path")
            .data([dataset[i]])
            .attr("class", "line-"+legend[i])
            .style("stroke", function(d) { return colorScaleStrain(d[0].id); })
            .style("stroke-width", 1)
            .attr("fill", "none")
            .attr("d", valueline)
            .attr("data-legend", function(d) { return d[0].id; })
            .on("mouseover", function (d) {
                highlightData(d[0].id, true);
            })
            .on("mouseout", function (d) {
                highlightData(d[0].id, false);
            });


        // draw dots
        g.selectAll(".circle-"+legend[i])
            .data(dataset[i])
            .enter()
            .append("circle")
            .attr("class","circle-"+legend[i])
            .attr("r", 3.5)
            .attr("cx", function(d) { return xScale(d.x); })
            .attr("cy", function(d) { return yScale(d.y); })
            .style("fill", function(d) { return colorScaleStrain(d.id); });
  }

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



