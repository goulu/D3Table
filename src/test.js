import {Table} from './table.js'
console.log(Table)
var table = new Table('.table')
    .format(function (d) {
        return (d === null) ? "?" : d;
    })
    .filter(d3.select('#filter'))
    .on("mouseover", function (d, i) {
        this.select(d, i);
    })
    .on("mouseleave", function (d, i) {
        this.deselect(d, i);
    })
    .on("click", function (d, i) {
        this.select(d, i);
    })
    .on("dblclick", function (d, i) {
        this.deselect(d, i);
    });

d3.json("https://raw.githubusercontent.com/prust/wikipedia-movie-data/master/movies.json", function (json) {
    table
        .header(Object.keys(json[0]))
        .data(json);
    d3.select('#rows').text(json.length);
    d3.select('#few').text(table.options.rows_in_block * table.options.blocks_in_cluster);
});

d3.select('#search').on("input", function () {
    let s = this.value.toLowerCase();
    let i = table.data().findIndex(function (d, i) {
        return table.findInRow(d, s) !== -1;
    });
    if (i > -1) {
        let d = table.data()[i]
        table.select(d);
        table.scrollTo(d);
    }
});