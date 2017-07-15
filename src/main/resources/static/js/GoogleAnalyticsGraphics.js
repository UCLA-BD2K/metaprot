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

        var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

        chart.draw(data, options);
      }
 }

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

        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

        chart.draw(dataDaily, options);

        var button = document.getElementById("chart_toggle_view");
        button.onclick = function() {
            // currently viewing daily data, toggle to monthly data
            if (options.hAxis.format === "MMM dd") {
                options.hAxis.format = "MMM yyyy";
                options.hAxis.viewWindow.min = lastYear;
                chart.draw(dataMonthly, options);
                button.innerHTML = "View daily totals";
                $("#chart_title").text("Views per Month");
            }
            else {
                options.hAxis.format = "MMM dd";
                options.hAxis.viewWindow.min = lastMonth;
                chart.draw(dataDaily, options);
                button.innerHTML = "View monthly totals";
                $("#chart_title").text("Views per Day");
            }


        }


      }
 }