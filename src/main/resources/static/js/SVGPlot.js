/**
 * Exposes plotting events and drawing via d3 and JQuery.
 *
 * Expects JQuery, D3 to have been loaded before this.
 *
 * Construct by "new SVGPlot(dataset, plotId, pThresh, fcThresh)"
 *
 * @param dataset an appropriately formed array of values.
 * @param plotContainerId id that the SVG plot will be appended to.
 * @param norm_pThreshold normalized (-log10(...)) p value threshold.
 * @param norm_fcThreshold normalized (log2(...)) fold change threshold.
 *
 * Currently expects dataset to have the form: [ [x, y, unique-name-for-point], ... ]
 *
 * Created by allengong on 8/25/16.
 */
var SVGPlot = (function(dataset, plotContainerId, norm_pThreshold, norm_fcThreshold) {

    // the d3 intialized svg element (innerSvg holds the data points + thresholds)
    var svg;
    var innerSvg;

    // track normalized thresholds
    var norm_pThreshold = norm_pThreshold;
    var norm_fcThreshold = norm_fcThreshold;

    // set of strings, holding unique point names
    var highlightedItems = window.metaprot.plot.highlightedItems;

    // plot/graph dimensions
    var height = 400;
    var width = 500;
    var padding = 20;   // just to prevent colliding elements

    // scale functions (for better visualization of small values)
    var minX = d3.min(dataset, function(d) { return d[0]});
    var maxX = d3.max(dataset, function(d) { return d[0]});
    var minY = d3.min(dataset, function(d) { return d[1]});
    var maxY = d3.max(dataset, function(d) { return d[1]});

    var xScale = d3.scaleLinear()   // range of X values (preserve x values with width)
        .domain([minX, maxX])
        .range([padding, width-padding]);

    var yScale = d3.scaleLinear()   // ^
        .domain([minY, maxY])
        .range([height-padding, padding]);  // flips the growth of y values from downward to upwards

    // generate x and y axes
    var xAxis = d3.axisBottom()
        .scale(xScale);

    var yAxis = d3.axisLeft()
        .scale(yScale);

    // zoom feature
    var currentZoomTransform = d3.zoomIdentity;     // defaults to identity (no scaling, etc.)
    var onZoom = function() {
        gXAxis.call(xAxis.scale(d3.event.transform.rescaleX(xScale)));
        gYAxis.call(yAxis.scale(d3.event.transform.rescaleY(yScale)));
        svg.selectAll("line.threshold, circle.d3-node").attr("transform", d3.event.transform);

        currentZoomTransform = d3.event.transform;
    };

    var zoom = d3.zoom()
        .scaleExtent([1, 4])
        .translateExtent([[0,0], [width + 4*padding, height+3*padding]])  // see width in plot()
        .on("zoom", onZoom);

    // drag select
    var isInBoundingRect = function(startX, startY, endX, endY, x, y) {
        // find larger x and y's
        var orderedYs;         // in order [smaller, larger]
        var orderedXs;
        if (startY > endY) {
            orderedYs = [endY, startY]
        } else {
            orderedYs = [startY, endY];
        }

        if (startX > endX) {
            orderedXs = [endX, startX];
        } else {
            orderedXs = [startX, endX];
        }

        // now simply check if in bounds
        if ((x <= orderedXs[1]) && (x >= orderedXs[0]) && (y <= orderedYs[1]) &&
            (y >= orderedYs[0])) {
            return true;
        }

        return false;
    };
    var startDragX, startDragY;
    var onDragStart = function() {
        startDragX = d3.event.x;
        startDragY = d3.event.y;

        // draw a selection rectangle
        var loc = d3.mouse(this);   // so that the bounding rectangle is drawn at correct location
        svg.append("rect")
            .attr("rx", 6).attr("ry", 6).attr("class", "selection")
            .attr("x", loc[0]).attr("y", loc[1]).attr("width", 0);
    };
    var onDragEnd = function() {
        $("#" + plotContainerId + ' circle.d3-node').each(function(i, ele) {
            var eleX = +ele.getAttribute("cx"); // + prefix automatically converts to number
            var eleY = +ele.getAttribute("cy");

            // appropriately scale the x and y values before determining containment
            // x = x_transform_amount + x*scale
            eleX = currentZoomTransform.x + eleX*currentZoomTransform.k;
            eleY = currentZoomTransform.y + eleY*currentZoomTransform.k;

            if (isInBoundingRect(startDragX-59, startDragY, d3.event.x-59, d3.event.y, eleX, eleY)) {
                $('.' + ele.classList[0]).addClass("active");
                $('.d3-node.' + ele.classList[0]).css("fill", "red");
                highlightedItems.add(ele.classList[0]);
            }
        });

        $('rect.selection').remove();
    };
    var onDragMove = function() {
        // on mousemoving, draw a bounding rectangle
        var rectSelection = svg.select("rect.selection");

        if (rectSelection) {
            //var loc = [d3.event.x, d3.event.y];
            var loc = d3.mouse(this);
            var rectParams = {
                "x": +rectSelection.attr("x"),
                "y": +rectSelection.attr("y"),
                "width": +rectSelection.attr("width"),
                "height": +rectSelection.attr("height")
            };
            var move = {
                "x": loc[0] - rectParams.x,
                "y": loc[1] - rectParams.y
            };

            if (move.x < 1 || (move.x*2 < rectParams.width)) {
                rectParams.x = loc[0];
                rectParams.width -= move.x;
            } else {
                rectParams.width = move.x;
            }

            if (move.y < 1 || move.y*2 < rectParams.height) {
                rectParams.y = loc[1];
                rectParams.height -= move.y;
            } else {
                rectParams.height = move.y;
            }

            rectSelection
                .attr("x", rectParams.x).attr("y", rectParams.y)
                .attr("width", rectParams.width)
                .attr("height", rectParams.height);
        }
    };

    var drag = d3.drag().on("start", onDragStart).on("drag", onDragMove).on("end", onDragEnd);

    function enableDragSelect() {  // in future take svg as input
        svg.call(d3.zoom().on("zoom", null)).on("mousedown.zoom", null).on("wheel.zoom", null); // removes zoom
        svg.call(drag);
    }
    function disableDragSelect() {
        svg.call(d3.drag().on("drag.start", null).on("drag.end", null).on("drag.drag", null))
            .on("mousedown.drag", null);
        svg.call(zoom);
    }

    // returns correct color of a circle based on its p/fc values
    var getCircleColor = function(d) {
        if ( (d[1] < norm_pThreshold) ||
            ((d[0] > -1*norm_fcThreshold) && (d[0] < norm_fcThreshold)) ) { // insig
            return "#d3d3d3";
        } else if (d[0] < -1*norm_fcThreshold) {    // downregulated
            return "orange";
        } else if (d[0] > norm_fcThreshold) {       // upregulated
            return "blue";
        } else {
            return "black";   // directly on threshold line
        }
    };

    // threshold lines -- can pass in svg that you want to update threshold lines for
    function redrawThresholdLines(norm_pThreshold, norm_fcThreshold) {
        // delete current lines
        $( "#" + plotContainerId + " line.threshold").remove();

        // append new lines
        var line = innerSvg.append("line")
            .attr("class", "positive-fc-thresh threshold")
            .attr("x1", xScale(norm_fcThreshold))
            .attr("y1", yScale(maxY))
            .attr("x2", xScale(norm_fcThreshold))
            .attr("y2", yScale(minY))
            .attr("transform", currentZoomTransform)    // ensures when zoomed that loc is correct
            .style("stroke", "gray")
            .style("stroke-width", .5)
            .style("stroke-dasharray", "15,15");

        innerSvg.append("line")
            .attr("class", "negative-fc-thresh threshold")
            .attr("x1", xScale(-1*norm_fcThreshold))
            .attr("y1", yScale(maxY))
            .attr("x2", xScale(-1*norm_fcThreshold))
            .attr("y2", yScale(minY))
            .attr("transform", currentZoomTransform)    // ensures when zoomed that loc is correct
            .style("stroke", "gray")
            .style("stroke-width", .5)
            .style("stroke-dasharray", "15,15");

        innerSvg.append("line")
            .attr("class", "p-thresh threshold")
            .attr("x1", xScale(minX))
            .attr("y1", yScale(norm_pThreshold))
            .attr("x2", xScale(maxX))
            .attr("y2", yScale(norm_pThreshold))
            .attr("transform", currentZoomTransform)    // ensures when zoomed that loc is correct
            .style("stroke", "gray")
            .style("stroke-width", .5)
            .style("stroke-dasharray", "15,15");
    }

    // calls necessary functions to plot the input dataset
    var gXAxis, gYAxis;
    var plot = function() {
        /** SVG **/
        svg = d3.select("#" + plotContainerId).append("svg")
            .attr("height", height + 2*padding)
            .attr("width", width + 4*padding)
            .attr("id", plotContainerId + "-svg")
            //.call(zoom);
            .call(drag);

        innerSvg = svg.append("g").attr("transform", "translate(" + 2*padding  + ", 0)")
            .append("svg")
            .style("overflow", "hidden")
            .attr("width", width)
            .attr("height", height-padding);

        // for each circle datapoint in dataset
        innerSvg.selectAll("circle")
            .data(dataset)
            .enter()
            .append("circle")               // tag name
            .attr("class", function(d) {    // classname "d3-node {metabolite-name}"
                return sanitizeForHtml(d[2]) + " d3-node";
            })
            .attr("cx", function(d) {
                return xScale(d[0]);
            })
            .attr("cy", function(d) {
                return yScale(d[1]);
            })
            .attr("r", 2)
            .style("fill", function(d) {    // coloring
                return getCircleColor(d);
            })
            .on("click", function(){    // on click, highlight UI elements
                $('.' + this.classList[0]).toggleClass("active");   // also highlights sidetables

                // add unique class name to the highlighted set -- copied from tr onclick above, refactorr
                if ($(this).hasClass('active')) {
                    highlightedItems.add(this.classList[0]);
                    $('.d3-node.' + this.classList[0] ).css('fill', "red");
                } else {
                    highlightedItems.delete(this.classList[0]);
                    d3.selectAll('.d3-node.' + this.classList[0]).style("fill", getCircleColor);
                }
            });

        // draw and label axes
        gXAxis = svg.append("g").attr("class", "x axis").attr("transform", "translate(" + 2*padding + ", " + (height-padding) + ")").call(xAxis);
        gYAxis = svg.append("g").attr("class", "y axis").attr("transform", "translate(" + 3*padding + ", 0)").call(yAxis);
        svg.append("text")
            .text("log2(fc threshold)")
            .attr("text-anchor", "middle")
            .attr("x", width/2 + padding)
            .attr("y", height + padding)
            .attr("class", "axis-label");
        svg.append("text")
            .text("-log10(p threshold)")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")  //  x-y coordinate system is also rotated
            .attr("x", -1*height/2)
            .attr("y", padding)
            .attr("class", "axis-label");

        // threshold lines
        redrawThresholdLines(norm_pThreshold, norm_fcThreshold);
    };

    function getSvg() {
        return svg;
    }

    function setThresholds(norm_pThreshold_new, norm_fcThreshold_new) {
        norm_pThreshold = norm_pThreshold_new;
        norm_fcThreshold = norm_fcThreshold_new;
    }

    // misc

    /**
     * Returns the dataUrl for the current plot, as a download-ready string
     * to place in an anchor tag.
     */
    var getDataUrl = function() {
        // get svg DOM element
        var currSvg = $("#" + plotContainerId + "-svg")[0];
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
        redrawThresholdLines:redrawThresholdLines,
        enableDragSelect:enableDragSelect,
        disableDragSelect:disableDragSelect,
        plot:plot,
        getCircleColor:getCircleColor,
        getSvg:getSvg,  // should be temporary
        setThresholds:setThresholds,
        getDataUrl:getDataUrl
    };
});
