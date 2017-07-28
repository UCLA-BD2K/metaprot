import React, {Component} from 'react';

class CsvViewer extends Component {

    constructor(props) {
        super(props);
        this.contentId = "csv-viewer-content";
        this.createTable = this.createTable.bind(this);
    }

    componentDidMount() {
        this.createTable();
    }

    createTable() {
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

        var sortAscending = true;
        var table = d3.select("#" + this.contentId)
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
            <div id={this.contentId}>
            </div>
        )
    }
}

export default CsvViewer;
