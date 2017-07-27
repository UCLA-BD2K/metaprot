import React, {Component} from 'react';

class CsvViewer extends Component {



    componentDidMount() {
        this.createTable();
    }

    createTable() {
//            d3.text("/css/data.csv", function(data) {
//            d3.csv.parse(data_file, function(data) {
        var parsedCSV = d3.csv.parseRows(this.props.data);
        var table = d3.select("#csv-viewer-content")
            .append("div").attr("class", "container")
            .append("table").attr("class", "display nowrap table table-hover table-bordered table-striped")
                            .attr("id", "example")
                            .attr("cellspacing", "0")
                            .attr("width", "100%");
        var titles = d3.keys(parsedCSV[0]);
        var headers = table.append("thead")
                        .append('tr')
                        .selectAll('th')
                        .data(parsedCSV[0]).enter()
                        .append('th')
                        .text(function (d) {
                            return d;
                        });
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

    }


   render() {

        return (
            <div id="csv-viewer-content">
            </div>
        )
    }
}

export default CsvViewer;
