// Create a 3d scatter plot within d3 selection parent. Adapted from example at http://bl.ocks.org/hlvoorhees/5986172
function scatterPlot3d( parent, data )
{
  const x3d = parent
    .append("x3d")
      .style( "width", parseInt(parent.style("width"))+"px" )
      .style( "height", parseInt(parent.style("height"))+"px" )
      .style( "border", "none" )

  const scene = x3d.append("scene")

  scene.append("orthoviewpoint")
       .attr( "centerOfRotation", [5, 5, 5])
       .attr( "fieldOfView", [-5, -5, 15, 15])
       .attr( "orientation", [-0.5, 1, 0.2, 1.12*Math.PI/4])
       .attr( "position", [0,3,0])

  const rows = data
  const axisRange = [0, 10];
  const scales = [];
  const axisKeys = ["x", "y", "z"]
  const axisLabels = ["PC2", "PC3", "PC1"];	// to be consistent with the static plot

  // Helper functions for initializeAxis() and drawAxis()
  function axisName( name, axisIndex ) {
    return ['x','y','z'][axisIndex] + name;
  }

  function constVecWithAxisValue( otherValue, axisValue, axisIndex ) {
    var result = [otherValue, otherValue, otherValue];
    result[axisIndex] = axisValue;
    return result;
  }

  // Used to make 2d elements visible
  function makeSolid(selection, color) {
    selection.append("appearance")
      .append("material")
         .attr("diffuseColor", color||"black")
    return selection;
  }

  // Initialize the axes lines and labels.
  function initializePlot() {
    initializeAxis(0);
    initializeAxis(1);
    initializeAxis(2);
  }

  function initializeAxis( axisIndex )
  {
    const key = axisKeys[axisIndex];
    drawAxis( axisIndex, key );

    const scaleMin = axisRange[0];
    const scaleMax = axisRange[1];

    // the axis line
    const newAxisLine = scene.append("transform")
         .attr("class", axisName("Axis", axisIndex))
         .attr("rotation", ([[0,0,0,0],[0,0,1,Math.PI/2],[0,1,0,-Math.PI/2]][axisIndex]))
      .append("shape")
    newAxisLine
      .append("appearance")
      .append("material")
        .attr("emissiveColor", "lightgray")
    newAxisLine
      .append("polyline2d")
         // Line drawn along y axis does not render in Firefox, so draw one
         // along the x axis instead and rotate it (above).
        .attr("lineSegments", "0 0," + scaleMax + " 0")

    let axisLabelScaleFactor = 1.1;
    if (axisIndex===2)
        axisLabelScaleFactor = 1.2; // z-axis label placed further away to be seen
   // axis labels
   const newAxisLabel = scene.append("transform")
       .attr("class", axisName("AxisLabel", axisIndex))
       .attr("translation", constVecWithAxisValue( 0, scaleMin + axisLabelScaleFactor * (scaleMax-scaleMin), axisIndex ))

   const newAxisLabelShape = newAxisLabel
     .append("billboard")
       .attr("axisOfRotation", "0 0 0") // face viewer
     .append("shape")
     .call(makeSolid)

   const labelFontSize = 0.6;

   newAxisLabelShape
     .append("text")
       .attr("class", axisName("AxisLabelText", axisIndex))
       .attr("solid", "true")
       .attr("string", axisLabels[axisIndex])
    .append("fontstyle")
       .attr("size", labelFontSize)
       .attr("family", "SANS")
       .attr("justify", "END MIDDLE" )
  }

  // Assign key to axis, creating or updating its ticks, grid lines, and labels.
  function drawAxis( axisIndex, key ) {

    const scale = d3.scale.linear()
      .domain( [-3, 3] ) // TEMPORARY, determine min/max values of actual dataset
      .range( axisRange )

    scales[axisIndex] = scale;

    const numTicks = 8;
    const tickSize = 0.1;
    const tickFontSize = 0.5;

    // ticks along each axis
    const ticks = scene.selectAll( "."+axisName("Tick", axisIndex) )
       .data( scale.ticks( numTicks ));
    const newTicks = ticks.enter()
      .append("transform")
        .attr("class", axisName("Tick", axisIndex));
    newTicks.append("shape").call(makeSolid)
      .append("box")
        .attr("size", tickSize + " " + tickSize + " " + tickSize);
    // enter + update
    ticks
      .attr("translation", function(tick) {
         return constVecWithAxisValue( 0, scale(tick), axisIndex ); })
    ticks.exit().remove();

    // tick labels
    const tickLabels = ticks.selectAll("billboard shape text")
      .data(function(d) { return [d]; });
    const newTickLabels = tickLabels.enter()
      .append("billboard")
         .attr("axisOfRotation", "0 0 0")
      .append("shape")
      .call(makeSolid)
    newTickLabels.append("text")
      .attr("string", scale.tickFormat(10))
      .attr("solid", "true")
      .append("fontstyle")
        .attr("size", tickFontSize)
        .attr("family", "SANS")
        .attr("justify", "END MIDDLE" );
    tickLabels // enter + update
      .attr("string", scale.tickFormat(10))
    tickLabels.exit().remove();


  }

  function drawBaseGridLines() {
        const numTicks = 8;

        const axisPairs = [
            [0, 2],
            [0, 1],
            [1, 2]
        ]

        const rotationFcns = [
            (axisIndex) => axisIndex == 0 ? [0,1,0,-Math.PI/2] : [0,0,0,0],
            (axisIndex) => axisIndex == 0 ? [0,0,-1,-Math.PI/2] : [0,0,0,0],
            (axisIndex) => axisIndex == 1 ? [0,-1,0,Math.PI/2] : [0,0,1,Math.PI/2]
        ]

        const translationFcns = [
            (axisIndex, scale) => {
                if (axisIndex == 0)
                    return d => scale(d) + " 0 0";
                else
                    return d => "0 0 " + scale(d);
            },
            (axisIndex, scale) => {
                if (axisIndex == 0)
                    return d => scale(d) + " 0 0";
                else
                    return d => "0 " + scale(d) + " 0";
            },
            (axisIndex, scale) => {
                if (axisIndex == 1)
                    return d => "0 " + scale(d) + " 0";
                else
                    return d => "0 0 " + scale(d);
            },
        ]

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 2; j++) {
                const axisIndex = axisPairs[i][j];
                const scale = scales[axisIndex];
                // base grid lines
                const gridLines = scene.selectAll( "."+axisName("GridLine", axisIndex) + i + j)
                 .data(scale.ticks( numTicks ));
                gridLines.exit().remove();

                const newGridLines = gridLines.enter()
                .append("transform")
                  .attr("class", axisName("GridLine", axisIndex) + i + j)
                  .attr("rotation", rotationFcns[i](axisIndex))
                .append("shape")

                newGridLines.append("appearance")
                .append("material")
                  .attr("emissiveColor", "gray")
                newGridLines.append("polyline2d");

                gridLines.selectAll("shape polyline2d")
                .attr("lineSegments", "0 0, " + axisRange[1] + " 0")

                gridLines
                 .attr("translation", translationFcns[i](axisIndex, scale))

            }
        }

  }


  // Update the data points (spheres) and stems.
  function plotData() {

    if (!rows) {
     console.log("no rows to plot.")
     return;
    }

    const x = scales[0], y = scales[1], z = scales[2];
    const sphereRadius = 0.2;

    // Draw a sphere at each x,y,z coordinate.
    const datapoints = scene.selectAll(".datapoint").data( rows );
    datapoints.exit().remove()

    const newDatapoints = datapoints.enter()
      .append("transform")
        .attr("class", "datapoint")
        .attr("scale", [sphereRadius, sphereRadius, sphereRadius])
      .append("shape");
    newDatapoints
      .append("appearance")
      .append("material");
    newDatapoints
      .append("sphere")
       // Does not work on Chrome; use transform instead
       //.attr("radius", sphereRadius)

    datapoints.selectAll("shape appearance material")
        .attr("diffuseColor", datum => datum.treatment === "iso" ? 'red' : 'blue' )

    datapoints
        .attr("translation", function(row) {
          return x(row[axisKeys[0]]) + " " + y(row[axisKeys[1]]) + " " + z(row[axisKeys[2]])})

    // Draw a stem from the x-z plane to each sphere at elevation y.
    // This convention was chosen to be consistent with x3d primitive ElevationGrid.
    const stems = scene.selectAll(".stem").data( rows );
    stems.exit().remove();

    var newStems = stems.enter()
      .append("transform")
        .attr("class", "stem")
      .append("shape");
    newStems
      .append("appearance")
      .append("material")
        .attr("emissiveColor", "gray")
    newStems
      .append("polyline2d")
        .attr("lineSegments", function(row) { return "0 1, 0 0"; })

    stems
        .attr("translation",
           function(row) { return x(row[axisKeys[0]]) + " 0 " + z(row[axisKeys[2]]); })
        .attr("scale",
           function(row) { return [1, y(row[axisKeys[1]])]; })
  }


  initializePlot();
  drawBaseGridLines();
  plotData();



}
