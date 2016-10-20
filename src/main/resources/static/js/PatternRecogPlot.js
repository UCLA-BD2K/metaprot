/**
 * Creates and edits line chart for Pattern Recognition
 *
 * Construct by "new PatternRecogPlot(data)"
 *
 * @param resultData an appropriately formed array of values.
 * @type {Function}
 *
 * resultData currently expected in [[{'dataPoints':[{'abundanceRatio':1.0,'timePoint':0},{'abundanceRatio':1.25714285714286,'timePoint':1} ... 'metaboliteName':'C14:1_p180'}, format
 */

var PatternRecogPlot = (function(resultData, regressionLinesInput) {

    var results = resultData;
    var regressionLines = regressionLinesInput;
    var len = results[0][0].dataPoints.length - 1;
    var xVals = [0];
    var xMax = results[0][0].dataPoints[len].timePoint;

    var vis;

    var WIDTH = 500;
    var HEIGHT = 400;
    var MARGINS = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 50
        };

    var xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([0, xMax]);
    var yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0, 1.5]);

    var yRef = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]);
    var xAxis;

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    var zoomable = true;

    //Initialize Chart axes and labels.
    function InitChart(svgID) {
        for(var i = 1; i <= len; i++){
            xVals.push(results[0][0].dataPoints[i].timePoint);
        }

        xAxis = d3.svg.axis()
            .scale(xScale)
            .tickValues(xVals);


        console.log("initruns");

        vis = d3.select('#' + svgID),
            WIDTH,
            HEIGHT,
            MARGINS,
            xScale,
            yScale,
            xAxis,
            yAxis;

        vis.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
            .call(xAxis);

        vis.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + (MARGINS.left) + ",0)")
            .call(yAxis);

        vis.append("line")
            .attr("class", "refLine1")
            .attr("x1", xScale(0))
            .attr("x2", xScale(xMax))
            .attr("y1", yScale(0.75))
            .attr("y2", yScale(0.75))
            .attr("stroke", "red")
            .style("stroke-dasharray", ("3, 3"))
            .call(yRef);

        vis.append("line")
            .attr("class", "refLine2")
            .attr("x1", xScale(0))
            .attr("x2", xScale(xMax))
            .attr("y1", yScale(1.25))
            .attr("y2", yScale(1.25))
            .attr("stroke", "red")
            .style("stroke-dasharray", ("3, 3"))
            .call(yRef);

        vis.append("rect")
            .attr("class", "zoom y box")
            .attr("width", MARGINS.left)
            .attr("height", HEIGHT - MARGINS.top - MARGINS.bottom)
            .attr("transform", "translate(" + 0 + "," + MARGINS.top + ")")
            .style("visibility", "hidden")
            .attr("pointer-events", "all")
            .call(yzoom);

        // now add titles to the axes
        vis.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (MARGINS.left/3) +","+(HEIGHT/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .text("Abundance Ratio");

        vis.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (WIDTH/2) +","+(HEIGHT + MARGINS.bottom/2)+")")  // centre below axis
            .text("Time Points");

    }

    var yzoom = d3.behavior.zoom()
        .y(yScale)
        .scaleExtent([0.1, 1])
        .on("zoom", zoomable ? draw : null);

    function update() {
        var circle = vis.selectAll(".d3-node");

        circle.attr("cy", function(d) {
                return Y(d);
            });

        var paths = vis.selectAll(".d3-path")
            .attr('d', function (d) {
                return lineGen(d);
            });

        vis.selectAll(".refLine1")
            .attr("y1", yScale(0.75))
            .attr("y2", yScale(0.75));

        vis.selectAll(".refLine2")
            .attr("y1", yScale(1.25))
            .attr("y2", yScale(1.25));
    }

    // Y value to scale

    function Y(d) {
        return yScale(d.abundanceRatio);
    }

    function draw() {
        vis.select('g.y.axis').call(yAxis);
        update();
    };

    var lineGen = d3.svg.line()
        .interpolate("linear")
        .x(function(d) {
            return xScale(d.timePoint);
        })
        .y(function(d) {
            return yScale(d.abundanceRatio);
        });

    var CSS_COLOR_NAMES = ["Aqua","Aquamarine","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","ForestGreen","Fuchsia","Gainsboro","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Yellow","YellowGreen"];
    var CSS_COLOR_RESERVED_REGRESSION_LINE = "Red";

    function updateChart(metaToUpdate) {
        for (var k = 0; k < metaToUpdate.length; k++) {
            var data = results[metaToUpdate[k].i][metaToUpdate[k].j].dataPoints;
            var metaName = results[metaToUpdate[k].i][metaToUpdate[k].j].metaboliteName;
            if (metaToUpdate[k].update) {
                addLine(data, metaName, CSS_COLOR_NAMES[metaToUpdate[k].i]);
            }
            else {
                vis.selectAll('#' + sanitizeForHtml(metaName)).remove();
            }
        }
    }

    var colorTracker = 0;

    function updateChartStrain(metaToUpdate) {
        for (var k = 0; k < metaToUpdate.length; k++) {
            var data = results[metaToUpdate[k].i][metaToUpdate[k].j].dataPoints;
            var metaName = results[metaToUpdate[k].i][metaToUpdate[k].j].metaboliteName;
            if (metaToUpdate[k].update) {
                addLine(data, metaName, CSS_COLOR_NAMES[colorTracker]);
            }
            else {
                vis.selectAll('#' + sanitizeForHtml(metaName)).remove();
            }
        }

        if(colorTracker != CSS_COLOR_NAMES.length - 1)
            colorTracker++;
        else
            colorTracker = 0;
    }

    function addLine(data, metaName, color) {
        vis.append("path")
            .data([data])
            .attr('d', lineGen(data))
            .attr('stroke', color)
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            .attr('id', sanitizeForHtml(metaName))
            .attr('class', 'd3-path');

        vis.selectAll("d3-node")
            .data(data)
            .enter()
            .append("circle")               // tag name
            .attr("class", function(d) {    // classname "d3-node {metabolite-name}"
                return sanitizeForHtml(metaName) + " d3-node";
            })
            .attr('id', sanitizeForHtml(metaName))
            .attr("cx", function(d) {
                return xScale(d.timePoint);
            })
            .attr("cy", function(d) {
                return yScale(d.abundanceRatio);
            })
            .attr("r", 2);
    }

    // updates internal dataset
    var updateDataSet =  function(data) {
        results = data;
        len = results[0][0].dataPoints.length - 1;
        xMax = results[0][0].dataPoints[len].timePoint; // ?
    };

    var updateRegressionLines = function(regressionLinesNew) {
        regressionLines = regressionLinesNew;
    };

    // draws a regression line, removing any existing one if they exist
    // data is an array of abundance ratio values (as the time points can be inferred
    // thus, this function must be called after the plot is initialized already (InitChart)
    var drawRegressionLine = function(clusterNumber) {

        if (clusterNumber < 0 || !regressionLines ||
                clusterNumber >= regressionLines.length) {

            console.log("There was a problem with drawing the regression line");
            return;
        }

        // get correct regression line for this cluster
        var regressionLine = regressionLines[clusterNumber];

        var formattedData = [];
        for (var i = 0; i < xVals.length; i++) {
            formattedData.push({"timePoint": xVals[i], "abundanceRatio": regressionLine[i]});
        }

        vis.selectAll("#regression-line, .d3-node.regression-line").remove();
        addLine(formattedData, "regression-line", CSS_COLOR_RESERVED_REGRESSION_LINE);
    };

    /**
     * Returns the dataUrl for the current plot, as a download-ready string
     * to place in an anchor tag.
     */
    var getDataUrl = function() {
        // get svg DOM element
        var currSvg = document.getElementById("visualisation");
        if (!currSvg) {
            console.log("Error in finding DOM element to generate the dataUrl");
            return null;
        }

        // get the XML source of the svg using XMLSerializer
        var serializer = new XMLSerializer();
        var source = serializer.serializeToString(currSvg);

        return "data:image/svg+xml;utf8," + source;
    };
    
    return {
        updateChart:updateChart,
        updateChartStrain:updateChartStrain,
        InitChart:InitChart,
        updateDataSet:updateDataSet,
        updateRegressionLines:updateRegressionLines,
        drawRegressionLine:drawRegressionLine,
        getDataUrl:getDataUrl
    };
});
