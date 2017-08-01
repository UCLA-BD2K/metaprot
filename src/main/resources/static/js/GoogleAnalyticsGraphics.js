// generate pie chart displaying usage of site's features (dummy data currently)
function plotUsagePieChart() {
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
                    "canvasHeight": 300,
                    "canvasWidth": 300,
                    "pieOuterRadius": "90%"
                },
                "data": {
                    "sortOrder": "label-desc",
                    "content": [
                        {
                            "label": "Differential Expression Analysis ",
                            "value": 200,
                            "color": "#2282c1"
                        },
                        {
                            "label": "Association Study",
                            "value": 90,
                            "color": "#7b6688"
                        },
                        {
                            "label": "Pattern Recognition ",
                            "value": 100,
                            "color": "#64a61f"
                        }
                    ]
                },
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
function plotGeoMap(mapData) {
      google.charts.load('current', {
        'packages':['geochart'],
        'mapsApiKey': 'AIzaSyCXkYdibsxSbTe8LZwdB6hZ9eoFiOC0tMU'
      });
      google.charts.setOnLoadCallback(drawRegionsMap);

      function drawRegionsMap() {
        var arr = [['Country', 'Visits']];
        if (mapData) {
            mapData = mapData.map(function(row) {
                return [row[0],parseInt(row[1],10)];
            });
            arr = arr.concat(mapData);
        }
        var data = google.visualization.arrayToDataTable(arr);

        var options = {
          backgroundColor: "#eef7fb",
          colorAxis: {colors: ['#0000ff', '#DC143C']},
          datalessRegionColor: '#90EE90'
        };

        var chart = new google.visualization.GeoChart(document.getElementById('regions-chart'));

        chart.draw(data, options);
      }
 }

// generate line chart to display usage trends (daily/monthly visits)
function plotTrafficChart(dailyVisitCounts, monthlyVisitCounts) {

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {

        var dataDaily = new google.visualization.DataTable();
        var dataMonthly = new google.visualization.DataTable();
        dataDaily.addColumn('date', 'Daily');
        dataDaily.addColumn('number', 'Visits');
        dataMonthly.addColumn('date', 'Monthly');
        dataMonthly.addColumn('number', 'Visits');

        if (dailyVisitCounts) {
            // try implementing map() function for parsing when done using dummy data
            for (var i = 0; i < dailyVisitCounts.length; i++) {
                dataDaily.addRow([new Date(dailyVisitCounts[i][0],
                                            dailyVisitCounts[i][1]-1,
                                            dailyVisitCounts[i][2]),
                                        parseInt(dailyVisitCounts[i][3], 10)]);
            }

        }
        if (monthlyVisitCounts) {
        // try implementing map() function for parsing when done using dummy data
            for (var i = 0; i < monthlyVisitCounts.length; i++) {
                dataMonthly.addRow([new Date(monthlyVisitCounts[i][0],
                                            monthlyVisitCounts[i][1]-1, 1),
                                        parseInt(monthlyVisitCounts[i][2], 10)]);
            }

        }

        var today = new Date();
        var lastMonth = new Date();
        lastMonth.setMonth(today.getMonth()-1);
        var lastYear = new Date();
        lastYear.setMonth(today.getMonth()-13);

        var options = {
            backgroundColor: "#eef7fb",
            colors: ["#2857ff"],
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
                title: 'Pageviews'
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
                $("#usage-trends-title").text("Views per Month");
            }
            // currently viewing monthly data, toggle to daily data
            else {
                options.hAxis.format = "MMM dd";
                options.hAxis.viewWindow.min = lastMonth;
                var newChart = new google.visualization.AreaChart(document.getElementById('usage-trends-chart'));
                newChart.draw(dataDaily, options);
                button.innerHTML = "View monthly totals";
                $("#usage-trends-title").text("Views per Day");
            }

        }

    }
}