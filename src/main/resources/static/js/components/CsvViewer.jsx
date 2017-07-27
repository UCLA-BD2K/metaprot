import React, {Component} from 'react';

class CsvViewer extends Component {



    componentDidMount() {
        this.createTable();
    }

    createTable() {
//            d3.text("/css/data.csv", function(data) {
//            d3.csv.parse(data_file, function(data) {
        /*var parsedCSV = d3.csv.parseRows(this.props.data);
        var table = d3.select("#csv-viewer-content")
            .append("div").attr("class", "container")
            .append("table").attr("class", "display nowrap table table-hover table-bordered table-striped")
                            .attr("id", "example")
                            .attr("cellspacing", "0")
                            .attr("width", "100%");
        var titles = d3.keys(parsedCSV[0]);


        var sortAscending = true;
        var headers = table.append("thead")
                    .append('tr')
                    .selectAll('th')
                    .data(parsedCSV[0]).enter()
                    .append('th')
                    .text(function (d) {
                        return d;
                    })
                    .on('click', function (d) {
                        headers.attr('class', 'header');
                        console.log(d);
                        console.log(rows);
                        if (sortAscending) {
                            rows.sort(function(a, b) { return b[d] < a[d]; });
                            sortAscending = false;
                            this.className = 'aes';
                        } else {
                            rows.sort(function(a, b) { return b[d] > a[d]; });
                            sortAscending = true;
                            this.className = 'des';
                        }

                    });;

        parsedCSV = parsedCSV.slice(1,parsedCSV.length);
        var rows = table.append("tbody")
            .selectAll("tr")
            .data(parsedCSV).enter()
            .append("tr")
            .selectAll("td")
            .data(function(d) {
                return d;
            }).enter()
            .append("td")
            .text(function(d) {
                return d;
            });
*/
        var data = d3.csv.parse(this.props.data, row => {
            var r = {};
                for (var k in row) {
                    r[k] = +row[k];
                    if (isNaN(r[k])) {
                        r[k] = row[k];
                    }
                }
            return r;
        });
        console.log(data);
        var sortAscending = true;
        var table = d3.select("#csv-viewer-content")
                    .append("div").attr("class", "container")
                    .append("table").attr("class", "display nowrap table table-hover table-bordered table-striped")
                                    .attr("id", "example")
                                    .attr("cellspacing", "0")
                                    .attr("width", "100%");
        var titles = d3.keys(data[0]);

        var headers = table.append('thead').append('tr')
               .selectAll('th')
               .data(titles).enter()
               .append('th')
               .attr('class', 'header')
               .text(function (d) {
                    return d;
                })
               .on('click', function (d) {
                   headers.attr('class', 'header');
                   if (sortAscending) {
                       rows.sort(function(a, b) {return d3.ascending(b[d], a[d]);  });
                       sortAscending = false;
                       this.className = 'aes';
                   }
                   else {
                       rows.sort(function(a, b) { return d3.descending(b[d], a[d]); });
                       sortAscending = true;
                       this.className = 'des';
                   }
               });

        var rows = table.append('tbody').selectAll('tr')
               .data(data).enter()
               .append('tr');
        rows.selectAll('td')
        .data(function (d) {
            return titles.map(function (k) {
                return { 'value': d[k], 'name': k};
            });
        }).enter()
        .append('td')
        .attr('data-th', function (d) {
            return d.name;
        })
        .text(function (d) {
            return d.value;
        });


    }


   render() {

        return (
            <div id="csv-viewer-content">
            </div>
        )
    }
}

export default CsvViewer;
