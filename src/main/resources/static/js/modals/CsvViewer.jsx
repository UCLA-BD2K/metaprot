import React, {Component} from 'react';


/**
 * Expected props:
 *      data - a CSV formatted string, to be displayed in table format
 */
class CsvViewer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            numRows: 0,
            numCols: 0
        }
        this.contentId = "csv-viewer-content";  // div id to mount d3 table
        this.createTable = this.createTable.bind(this);
    }

    componentDidMount() {
        // generate d3 table after component has mounted
        this.createTable();
    }

    /* generate d3 table and mount to div with id specified by this.contentId */
    createTable() {
        // parse CSV data and convert values from String to numeric values when applicable
        const data = d3.csv.parse(this.props.data, row => {
            var r = {};
                for (var k in row) {
                    r[k] = +row[k];
                    if (isNaN(r[k])) {
                        r[k] = row[k];
                    }
                }
            return r;
        });

        const numRows = data.length;
        const numCols = Object.keys(data[0]).length;

        this.setState({numRows, numCols});

        let sortAscending = true;
        const table = d3.select("#" + this.contentId)
                    .append("div").attr("class", "container")
                    .append("table").attr("class", "display nowrap table table-hover table-bordered table-striped")
                                    .attr("id", "example")
                                    .attr("cellspacing", "0")
                                    .attr("width", "100%");

        const titles = d3.keys(data[0]);

        const headers = table.append('thead').append('tr')
               .selectAll('th')
               .data(titles).enter()
               .append('th')
               .attr('class', 'header')
               .text(function (d) {
                    return d;
                })
               .on('click', function (d) {
                   headers.attr('class', 'header');
                   // upon clicking column header, sort rows by this column
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

        const rows = table.append('tbody').selectAll('tr')
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
            <div>
                <p className="text-muted">
                    Rows: {this.state.numRows}, Columns: {this.state.numCols}
                </p>
                <div id={this.contentId}>
                    { /* d3 table will be generated here */ }
                </div>
            </div>
        )
    }
}

export default CsvViewer;
