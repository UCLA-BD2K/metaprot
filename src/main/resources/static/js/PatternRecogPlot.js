/**
 * Created by Abineet on 9/6/2016.
 */

var PatternRecogPlot = (function(resultData) {

    var results = resultData;
    var len;
    var xMax;

    var vis;

    function InitChart() {

        // results of the task
        //results = [[{'dataPoints':[{'abundanceRatio':1.0,'timePoint':0},{'abundanceRatio':1.25714285714286,'timePoint':1},{'abundanceRatio':0.785714285714286,'timePoint':3},{'abundanceRatio':0.814285714285714,'timePoint':5},{'abundanceRatio':1.1,'timePoint':7},{'abundanceRatio':1.24285714285714,'timePoint':14}],'metaboliteName':'C14:1_p180'},{'dataPoints':[{'abundanceRatio':1.0,'timePoint':0},{'abundanceRatio':1.21452894438138,'timePoint':1},{'abundanceRatio':0.922814982973893,'timePoint':3},{'abundanceRatio':1.03972758229285,'timePoint':5},{'abundanceRatio':1.30533484676504,'timePoint':7},{'abundanceRatio':1.44154370034052,'timePoint':14}],'metaboliteName':'PC aa C32:0_p180'}], [{'dataPoints':[{'abundanceRatio':1.0,'timePoint':0},{'abundanceRatio':1.34718646561236,'timePoint':1},{'abundanceRatio':1.04817947774917,'timePoint':3},{'abundanceRatio':1.03788157410813,'timePoint':5},{'abundanceRatio':1.10481794777492,'timePoint':7},{'abundanceRatio':1.0728208900331,'timePoint':14}],'metaboliteName':'PC ae C36:3_Lipid'},{'dataPoints':[{'abundanceRatio':1.0,'timePoint':0},{'abundanceRatio':1.34267330842673,'timePoint':1},{'abundanceRatio':0.964508094645081,'timePoint':3},{'abundanceRatio':0.92071398920714,'timePoint':5},{'abundanceRatio':1.10751349107513,'timePoint':7},{'abundanceRatio':1.32710668327107,'timePoint':14}],'metaboliteName':'PC ae C38:6_Lipid'}]];


        len = results[0][0].dataPoints.length - 1;
        xMax = results[0][0].dataPoints[len].timePoint;

        console.log("initruns");

        vis = d3.select("#visualisation"),
            WIDTH = 500,
            HEIGHT = 400,
            MARGINS = {
                top: 20,
                right: 20,
                bottom: 20,
                left: 50
            },


            xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([0, xMax]),

            yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0, 1.5]),

            xAxis = d3.svg.axis()
                .scale(xScale),

            yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left");

        vis.append("svg:g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
            .call(xAxis);

        vis.append("svg:g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + (MARGINS.left) + ",0)")
            .call(yAxis);

    }

    var lineGen = d3.svg.line()
        .x(function(d) {
            return xScale(d.timePoint);
        })
        .y(function(d) {
            return yScale(d.abundanceRatio);
        });

    var CSS_COLOR_NAMES = ["Aqua","Aquamarine","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","ForestGreen","Fuchsia","Gainsboro","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Yellow","YellowGreen"];

    function updateChart(metaToUpdate) {
        for (var k = 0; k < metaToUpdate.length; k++) {
            var data = results[metaToUpdate[k].i][metaToUpdate[k].j].dataPoints;
            var metaName = results[metaToUpdate[k].i][metaToUpdate[k].j].metaboliteName;
            if(metaToUpdate[k].update) {
                vis.append('svg:path')
                    .attr('d', lineGen(data))
                    .attr('stroke', CSS_COLOR_NAMES[metaToUpdate[k].i])
                    .attr('stroke-width', 2)
                    .attr('fill', 'none')
                    .attr('id', sanitizeForHtml(metaName));
            }
            else{
                vis.select(sanitizeForHtml('#'+ metaName)).remove();
            }
        }
    }
    
    return {
        updateChart : updateChart,
        InitChart : InitChart
    };
    
    window.temp = updateChart;
    
    InitChart();

});
