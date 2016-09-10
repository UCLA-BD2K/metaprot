/**
 * Created by Abineet on 9/6/2016.
 */

var PatternRecogPlot = (function(resultData) {

    var results = resultData;
    var plottedData =[];
    len = results[0][0].dataPoints.length - 1;
    xMax = results[0][0].dataPoints[len].timePoint;

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

    var xAxis = d3.svg.axis()
        .scale(xScale);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    var zoomable = true;

    function InitChart() {

        // results of the task
        //results = [[{'dataPoints':[{'abundanceRatio':1.0,'timePoint':0},{'abundanceRatio':1.25714285714286,'timePoint':1},{'abundanceRatio':0.785714285714286,'timePoint':3},{'abundanceRatio':0.814285714285714,'timePoint':5},{'abundanceRatio':1.1,'timePoint':7},{'abundanceRatio':1.24285714285714,'timePoint':14}],'metaboliteName':'C14:1_p180'},{'dataPoints':[{'abundanceRatio':1.0,'timePoint':0},{'abundanceRatio':1.21452894438138,'timePoint':1},{'abundanceRatio':0.922814982973893,'timePoint':3},{'abundanceRatio':1.03972758229285,'timePoint':5},{'abundanceRatio':1.30533484676504,'timePoint':7},{'abundanceRatio':1.44154370034052,'timePoint':14}],'metaboliteName':'PC aa C32:0_p180'}], [{'dataPoints':[{'abundanceRatio':1.0,'timePoint':0},{'abundanceRatio':1.34718646561236,'timePoint':1},{'abundanceRatio':1.04817947774917,'timePoint':3},{'abundanceRatio':1.03788157410813,'timePoint':5},{'abundanceRatio':1.10481794777492,'timePoint':7},{'abundanceRatio':1.0728208900331,'timePoint':14}],'metaboliteName':'PC ae C36:3_Lipid'},{'dataPoints':[{'abundanceRatio':1.0,'timePoint':0},{'abundanceRatio':1.34267330842673,'timePoint':1},{'abundanceRatio':0.964508094645081,'timePoint':3},{'abundanceRatio':0.92071398920714,'timePoint':5},{'abundanceRatio':1.10751349107513,'timePoint':7},{'abundanceRatio':1.32710668327107,'timePoint':14}],'metaboliteName':'PC ae C38:6_Lipid'}]];


        console.log("initruns");

        vis = d3.select("#visualisation"),
            WIDTH,
            HEIGHT,
            MARGINS,
            xScale,
            yScale,
            xAxis,

            yAxis;
        vis.append("svg:g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
            .call(xAxis);

        vis.append("svg:g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + (MARGINS.left) + ",0)")
            .call(yAxis);

        vis.append("svg:rect")
            .attr("class", "zoom y box")
            .attr("width", MARGINS.left)
            .attr("height", HEIGHT - MARGINS.top - MARGINS.bottom)
            .attr("transform", "translate(" + 0 + "," + MARGINS.top + ")")
            .style("visibility", "hidden")
            .attr("pointer-events", "all")
            .call(yzoom);

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
            })


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

    var CSS_COLOR_NAMES = ["Aqua","Aquamarine","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","ForestGreen","Fuchsia","Gainsboro","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Yellow","YellowGreen"];

    function updateChart(metaToUpdate) {
        for (var k = 0; k < metaToUpdate.length; k++) {
            var data = results[metaToUpdate[k].i][metaToUpdate[k].j].dataPoints;
            var metaName = results[metaToUpdate[k].i][metaToUpdate[k].j].metaboliteName;
            if(metaToUpdate[k].update) {
                vis.append("path")
                    .data([data])
                    .attr('d', lineGen(data))
                    .attr('stroke', CSS_COLOR_NAMES[metaToUpdate[k].i])
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
                    .attr("r", 2)
            }
            else{
                vis.selectAll(sanitizeForHtml('#'+ metaName)).remove();
            }
        }
    }
    
    return {
        updateChart : updateChart,
        InitChart : InitChart
    };
    
    InitChart();

});
