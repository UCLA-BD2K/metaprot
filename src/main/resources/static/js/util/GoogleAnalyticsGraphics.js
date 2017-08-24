

// generate pie chart displaying usage of site's features (dummy data currently)
export function plotUsagePieChart(data) {
    var pie = new d3pie("pieChart", {
                "header": {
                    "title": {
                        "fontSize": 24,
                        "font": "open sans"
                    },
                    "subtitle": {
                        "color": "#999999",
                        "fontSize": 12,
                        "font": "open sans"
                    },
                    "location": "pie-center",
                    "titleSubtitlePadding": 9
                },
                "footer": {
                    "color": "#999999",
                    "fontSize": 10,
                    "font": "open sans",
                    "location": "bottom-center"
                },
                "size": {
                    "canvasHeight": 400,
                    "canvasWidth": 400,
                    "pieOuterRadius": "80%"
                },
                "data": function() {
                    let pieData = {
                        "sortOrder": "label-desc",
                        "content": []
                    }
                    data.forEach( val => {
                        pieData.content.push({ "label":val[0], "value": parseInt(val[1])})
                    })
                    return pieData;
                }(),
                "labels": {
                    "outer": {
                        "format": "none",
                        "pieDistance": 32
                    },
                    "inner": {
                        "format": "label",
                        "hideWhenLessThanPercentage": 3
                    },
                    "mainLabel": {
                        "color": "#faf8f8",
                        "font": "open sans",
                        "fontSize": 9
                    },
                    "percentage": {
                        "color": "#ffffff",
                        "decimalPlaces": 0
                    },
                    "value": {
                        "color": "#adadad",
                        "fontSize": 11
                    },
                    "lines": {
                        "enabled": true
                    },
                    "truncation": {
                        "enabled": true,
                        "truncateLength": 33
                    }
                },
                "tooltips": {
                    "enabled": true,
                    "type": "placeholder",
                    "string": "{label}:  {percentage}%"
                },
                "effects": {
                    "pullOutSegmentOnClick": {
                        "effect": "linear",
                        "speed": 400,
                        "size": 8
                    }
                },
                "misc": {
                    "gradient": {
                        "enabled": true,
                        "percentage": 100
                    },
                    "canvasPadding": {
                        "top": 0,
                        "right": 0,
                        "bottom": 0,
                        "left": 0
                    }
                }
            });
    return pie;
}

// generate heat map of site usage in various countries
export function plotGeoMap(mapData) {
      google.charts.load('current', {
        'packages':['geochart'],
        'mapsApiKey': 'AIzaSyCXkYdibsxSbTe8LZwdB6hZ9eoFiOC0tMU'
      });
      google.charts.setOnLoadCallback(drawRegionsMap);

      function drawRegionsMap() {
        var arr = [['Country', 'Sessions']];
        if (mapData) {
            mapData = mapData.map(function(row) {
                return [row[0],parseInt(row[1],10)];
            });
            arr = arr.concat(mapData);
        }
        var data = google.visualization.arrayToDataTable(arr);

        var options = {
          backgroundColor: "#eef7fb",
          colorAxis: {colors: ['#4062BB', '#FF4242']},
          datalessRegionColor: '#ACECA1'
        };

        var chart = new google.visualization.GeoChart(document.getElementById('regions-chart'));

        chart.draw(data, options);
      }
 }

// generate line chart to display usage trends (daily/monthly sessions)
export function plotTrafficChart(dailySessionCounts, montlySessionCounts) {

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {

        var dataDaily = new google.visualization.DataTable();
        var dataMonthly = new google.visualization.DataTable();
        dataDaily.addColumn('date', 'Daily');
        dataDaily.addColumn('number', 'Sessions');
        dataMonthly.addColumn('date', 'Monthly');
        dataMonthly.addColumn('number', 'Sessions');

        if (dailySessionCounts) {
            // try implementing map() function for parsing when done using dummy data
            for (var i = 0; i < dailySessionCounts.length; i++) {
                dataDaily.addRow([new Date(dailySessionCounts[i][0],
                                            dailySessionCounts[i][1]-1,
                                            dailySessionCounts[i][2]),
                                        parseInt(dailySessionCounts[i][3], 10)]);
            }

        }
        if (montlySessionCounts) {
        // try implementing map() function for parsing when done using dummy data
            for (var i = 0; i < montlySessionCounts.length; i++) {
                dataMonthly.addRow([new Date(montlySessionCounts[i][0],
                                            montlySessionCounts[i][1]-1, 1),
                                        parseInt(montlySessionCounts[i][2], 10)]);
            }

        }

        var today = new Date();
        var lastMonth = new Date();
        lastMonth.setMonth(today.getMonth()-1);
        var lastYear = new Date();
        lastYear.setMonth(today.getMonth()-13);

        var options = {
            backgroundColor: "#eef7fb",
            colors: ["#058ED9"],
            pointSize: 5,
            //theme: 'maximized',
            width: '100%',
            height: '100%',
            hAxis: {
                format: "MMM dd",
                gridlines: {color: 'none'},
                viewWindowMode: 'pretty',
                color: 'gray',
                viewWindow: {
                    max: today,
                    min: lastMonth
                }
            },
            vAxis: {
                format: 'decimal',
                color: 'gray',
                viewWindow: {
                    min: 0
                },
                title: 'Sessions'
            },
            legend: "none",
            explorer: {
                axis: "horizontal",
                maxZoomOut: 1
            },
            chartArea: {
                width: '78%',
                height: '78%'
            }

        };

        var chart = new google.visualization.AreaChart(document.getElementById('usage-trends-chart'));
        chart.draw(dataDaily, options);

        var button = document.getElementById("chart-toggle-view");
        button.onclick = function() {
            // currently viewing daily data, toggle to monthly data
            if (options.hAxis.format === "MMM dd") {
                options.hAxis.format = "MMM yyyy";
                options.hAxis.viewWindow.min = lastYear;
                var newChart = new google.visualization.AreaChart(document.getElementById('usage-trends-chart'));
                newChart.draw(dataMonthly, options);
                button.innerHTML = "View daily totals";
                $("#usage-trends-title").text("Sessions per Month");
            }
            // currently viewing monthly data, toggle to daily data
            else {
                options.hAxis.format = "MMM dd";
                options.hAxis.viewWindow.min = lastMonth;
                var newChart = new google.visualization.AreaChart(document.getElementById('usage-trends-chart'));
                newChart.draw(dataDaily, options);
                button.innerHTML = "View monthly totals";
                $("#usage-trends-title").text("Sessions per Day");
            }

        }

    }
}