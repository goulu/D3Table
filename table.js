/*
reusable D3.js (V3) class for a table
* sortable
* efficient with large data

inspired by
https://www.kryogenix.org/code/browser/sorttable/
https://clusterize.js.org/

@license Copyright BOBST SA 2018, all rights reserved
@version 0.1
@author  Philippe Guglielmetti https://github.com/goulu/
@updated 2018.06.12

 */

console.log('table.js loaded');

/*export*/ class Table {

    constructor(element) {
        this.element = element;
        this.thead=element.select('thead')
        this.tbody = element.select('tbody');
        this.selected = [];
        this.format(function (v) {return v;});
        window.addEventListener("resize", this.resize.bind(this));
    }

    get rows() {
        return this.tbody.selectAll("tr");
    }

    // config

    header(cols) {
        this.columns = cols;
        if (this.thead) { // append the header row
            this.thead.append('tr')
                .selectAll('th')
                .data(this.columns)
                .enter()
                .append('th')
                .text(function (column) {
                    return column;
                });
        }
        return this;
    }
    
    resize() {
        // assign header widths to column widths
        let th=this.thead.selectAll('th')[0];
        let td=this.tbody.select("tr").selectAll('td')[0];
        for (var i = 0; i < th.length; i++) {
            th[i].width=td[i].clientWidth;
        };
        return this;
    }

    format(f) {
        this._format = f;
        return this;
    }

    // run

    data(d) {
        // data is in fact assigned to the rows
        if (d === undefined) {
            return this.rows.data();
        }

        const table = this;

        let rows = this.rows
            .data(d, function (d) {
                return [d.datetime, d.id]
            });

        rows.enter().append('tr');

        rows.order(); // https://stackoverflow.com/a/18032229/1395973

        // create a cell in each row for each column


        let cells = rows.selectAll("td")
            .data(function (row) {
                return table.columns.map(function (column) {
                    return {column: column, value: table._format(row[column])};
                });
            });

        cells.enter().append("td");

        cells.text(function (d) {
            return d.value;
        });

        cells.exit().remove();
        rows.exit().remove();
        this.resize();

        return this.rows; // here we return the rows to allow chain call
    }

    add(newdata) {
        // merge and sort data with current
        let data = this.data().concat(newdata);
        data = data.sort(function (a, b) {
            return d3.ascending(a.datetime, b.datetime)
        });
        return this.data(data);
    }

    indexOf(d) {
        return this.data().indexOf(d);
    }

    scrollTo(d, ms=1000) {
        // smooth scroll to data d in ms milliseconds
        let node = this.tbody.node();
        let f = node.scrollHeight / node.rows.length;
        let nlines = node.clientHeight / f;

        function scrollTween(offset) {
            return function () {
                let i = d3.interpolateNumber(node.scrollTop, offset);
                return function (t) {
                    node.scrollTop = i(t);
                };
            };
        }

        let line = table.indexOf(d);
        if (line < 0) {
            console.log(d + 'not found in table');
            return;
        }

        this.tbody.transition()
            .duration(ms)
            .tween("scroll", scrollTween(
                (line - Math.round(nlines / 2)) * f
                )
            );
    }

    select(d, i) {
        this.selected.push(
            this.rows
                .filter(function (d2, j) {
                    return d2 === d;
                })
                .classed("highlight", true)
        );
    }

    deselect() {
        this.selected.map(function (row) {
            row.classed("highlight", false);
        });
        this.selected = [];
    }
}