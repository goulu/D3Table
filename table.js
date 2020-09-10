/*
reusable D3.js class for (LARGE) tables
* efficient with large data thanks to https://clusterize.js.org/
* filterable thanks to D3
* sortable thanks to http://bl.ocks.org/AMDS/4a61497182b8fcb05906
* and https://www.kryogenix.org/code/browser/sorttable/)

@author  Philippe Guglielmetti https://github.com/goulu/
@license LGPL 3
@version 0.2
@updated 2018.07.02

 */

const Clusterize = require('clusterize.js'),
    d3 = require('d3');


module.exports=class Table extends Clusterize {

    constructor(element, height = 400) {
        /* build DOM structure like this:
            <table>
                <thead>
                <tr>
                    <th>Headers</th>
                </tr>
                </thead>
            </table>
            <div id="scrollArea" class="clusterize-scroll">
                <table>
                    <tbody id="contentArea" class="clusterize-content">
                    <tr class="clusterize-no-data">
                        <td>Loading data…</td>
                    </tr>
                    </tbody>
                </table>
            </div>
         */
        if (typeof(element)=='string') {
            element=d3.select(element) 
        }

        let thead = element.append("table").append("thead");
        thead.insert("th").append("tr").text("Headers");

        let scroll = element.append("div")
            .attr("id", uniqueId)
            .style("max-height", height + 'px')
            .classed("clusterize-scroll", true)
            .on('scroll', (function () {
                var prevScrollLeft = 0;
                return function () {
                    var scrollLeft = this.scrollLeft();
                    if (scrollLeft == prevScrollLeft) return;
                    prevScrollLeft = scrollLeft;
                    this.thead.style('margin-left', -scrollLeft);
                }
            })
            );

        let rows = scroll.append("table").append("tbody")
            .attr("id", uniqueId)
            .classed("clusterize-content", true);

        super({
            // rows: [], // do not specify it here
            scrollId: scroll.attr("id"),
            contentId: rows.attr("id"),
        });

        this.element = element;
        this.thead = thead;
        this.scroll = scroll;
        this.rows = element.select("tbody");

        this.format(function (v) {
            return v;
        });


        this.rowid(function (d) {
            // by default, rowid is row number in data
            // not bad, but doens't survive a table.sort ...
            return this.data().indexOf(d)
        })

        this.options.callbacks = {
            clusterChanged: this.resize.bind(this)
        };

        window.addEventListener("resize", this.resize.bind(this));

        let tr = rows.append("tr").classed("clusterize-no-data", true);
        tr.append("td").text("Loading data...");

        this.__data__ = []; // don't call data() since it would clear any existing DOM table

        this._filter = function (d, i) {
            return true;
        }

        this._selected = new Set([]);
        this.sortAscending = true;
    }

    format(f) {
        this._format = f;
        return this;
    }

    // config

    header(cols) {
        let table = this;
        this.columns = cols;
        this.thead.selectAll("th")
            .remove();
        this.thead.selectAll("th")
            .data(this.columns)
            .enter()
            .append("th")
            .text(function (column) {
                return column;
            })
            .on('click', function (d, i) {
                table.sort(i, table.sortAscending);
                table.sortAscending = !table.sortAscending; // for the next time
            });
        return this; // for chaining
    }

    sort(i, ascending = true, stable = false) {
        // sort data by i-th column, ascending or descending
        // optionally with stable sort algo (slower...)
        let th = this.thead.selectAll('th');
        th.classed('aes', false).classed('des', false);
        d3.select(th[0][i]).classed('aes', !ascending).classed('des', ascending);
        let data = this.data();
        if (data.length == 0) {
            return this; // for chaining
        }

        if (!isArray(data[0])) { // rows are dicts
            i = this.columns[i]; // index by field
        }

        let ic = new Intl.Collator('en', { 'sensitivity': 'base' });

        function f(x, y) {
            // universal (?) comparison
            try {
                x = x[i]
            }
            catch (e) {
                x = undefined;
            }
            try {
                y = y[i]
            }
            catch (e) {
                y = undefined;
            }

            if (x === y) {
                return 0;
            }
            if (typeof x === 'string') {
                return ic.compare(x, y);
            }
            else if (typeof t === 'number') {
                return x - y;
            }
            else {
                return x > y ? 1 : -1
            }
        }

        if (!ascending) {
            let ff = f;
            f = function (x, y) {
                return ff(y, x);
            }
        }
        let performance = window.performance,
            t0 = performance.now();
        if (stable) {
            shaker_sort(data, f);
        } else {
            data.sort(f);
        }
        this.draw();
        let dt = Math.round(performance.now() - t0)
        if (dt > 1000) {
            console.log("table.sort took " + dt + " milliseconds.")
        }
        return this; // for chaining
    }

    rowAsArray(row) {
        // return row as the array of visible cells
        if (!isArray(row)) { // suppose it's a dict
            row = this.columns.map(function (d, i) {
                return row[d]
            })
        }
        return row;
    }

    rowAsString(d, sep = '\u3000') {
        // sep is a very unlikely char to minimize the risk of wrong positive when searching
        return this.rowAsArray(d).map(this._format).join(sep);
    }

    findInRow(d, what) {
        // what must be in lowercase for
        return this.rowAsString(d).toLowerCase().indexOf(what)
    }

    filter(f) {
        if (isFunction(f)) {
            this._filter = f;
            this.draw(); // apply filter
            return this; // for chaining
        }
        // assume f is a selection of an input field
        let table = this;

        this.filter(function (d, i) {
            // here, this is the input field, which is .bound
            let s = this.property("value"); // https://stackoverflow.com/a/31369759/1395973
            if (s === '') return true;
            return table.findInRow(d, s.toLowerCase()) !== -1
        }.bind(f)) // bind to the input field

        f.on("input", function () { // set the update event of the input field
            table.draw();
        });
        return this; // for chaining
    }

    rowid(d) {
        // returns a unique id of row associated to data d
        if (isFunction(d)) {
            this._rowid = d;
            return this; // for chaining
        }

        return this._rowid(d)
    }

    on(e, f) {
        this.options.callbacks[e] = f.bind(this);
        return this; // for chaining
    }

    // run
    data(d) {
        if (d === undefined) {
            return this.__data__;
        }
        this.__data__ = d;
        return this.draw();
    }

    draw() {
        let table = this;
        let d = this.data();
        if (d.length === 0) return table;
        d = d.filter(table._filter);
        this.update(function (i) {
            let row = table.rowAsArray(d[i]);
            return '<tr '
                + 'id="r' + table.rowid(d[i]) + '" ' // way to find the data back for selection. id must start with non numeric
                + ((i in table._selected)
                    ? 'class="highlight"'
                    : '')  // no handier way to select a hidden row ...
                + '>'
                + row.map(function (cell) {
                    return '<td>' + (cell === undefined ? '' : table._format(cell)) + '</td>';
                }).join('')
                + '</tr>'
        }
            ,
            d.length
        );

        table.resize(); // redraw
        return table;
    }

    // events

    resize() {
        let table = this;
        // Makes header columns equal width to content columns
        let scrollBarWidth = width(this.element)[0] - width(this.rows)[0],
            td = this.rows.select('tr:not(.clusterize-extra-row)').selectAll('td'),
            w = width(td);
        w[w.length - 1] += scrollBarWidth;
        width(this.thead.selectAll('th'), w);

        // (re)attach events to rows

        function fevent() {
            let e = d3.event;
            if (e.type in table.options.callbacks) { // handle it
                let target = e.target;
                if (target.tagName == 'TD') {
                    target = target.parentElement; // events are on rows (for now)
                }
                // retrieve the data (TODO: there should be a quicker way...)
                let i = target.id.substr(1),  //get tr #id
                    d = table.data().find(function (d) {
                        return table.rowid(d) == i
                    });
                return table.options.callbacks[e.type](d, i);
            }
        }

        this.rows.selectAll("tr")
            .on("mouseover", fevent)
            .on("mouseleave", fevent)
            .on("click", fevent)
            .on("dblclick", fevent)
            .classed("highlight", function (d, i) {
                return table._selected.has(i);
            })

        return table;
    }

    add(newdata, i = -1) {
        // merge and sort data with current
        // don't rename it "append" to avoid conflicts with Clusterize and/or D3
        this.__data__ = this.data().concat(newdata);
        if (i >= 0) {
            this.sort(i);
        } else {
            this.draw();
        }
        return this.data();
    }


    scrollTo(d, ms = 1000) {
        // smooth scroll to data d in ms milliseconds
        let table = this,
            length = this.data().filter(this._filter).length,
            node = this.scroll.node(),
            f = node.scrollHeight / length,
            nlines = node.clientHeight / f,
            line = this.findIndex(d);

        function scrollTween(offset) {
            return function () {
                let i = d3.interpolateNumber(node.scrollTop, offset);
                return function (t) {
                    node.scrollTop = i(t);
                };
            };
        }

        this.rows.transition()
            .duration(ms)
            .each("end", function () {
                table.select();
            }
            )
            .tween("scroll", scrollTween(
                (line - Math.round(nlines / 2)) * f
            )
            )
            ;
        return this; // for chaining
    }

    indexOf(d) {
        return this.data().filter(this._filter).indexOf(d);
    }

    find(d) {
        let table = this,
            id = table.rowid(d);
        return this.data().filter(this._filter).find(
            function (e) {
                return table.rowid(e) === id;
            }
        )
    }
    findIndex(d) {
        let table = this,
            id = table.rowid(d);
        return this.data().filter(this._filter).findIndex(
            function (e) {
                return table.rowid(e) === id;
            }
        )
    }


    select(d, i) {
        let table = this;

        function highlight(i) {
            table._selected.add(i);
            let tr = table.rows.select("#r" + i);
            tr.classed("highlight", true);
        }

        if (i === undefined) {
            if (d === undefined) {
                this._selected.forEach(highlight);
                return this
            }
            i = this.rowid(d)
        }

        highlight(i);

        return this; // for chaining
    }

    deselect(d, i) {
        if (i === undefined) {
            if (d === undefined) {
                this._selected.clear();
                this.draw();
                return this
            }
            i = this.rowid(d)
        }
        this._selected.delete(i);
        let tr = this.rows.select("#r" + i);
        tr.classed("highlight", false);
        return this; // for chaining
    }
}


// first and last of a selection
// https://stackoverflow.com/a/25413534/1395973
d3
    .selection
    .prototype
    .first = function () {
        return d3.select(this[0][0]);
    };
d3
    .selection
    .prototype
    .last = function () {
        var last = this.size() - 1;
        return d3.select(this[0][last]);
    };

// utility functions

function width(sel, value) {
    // mimics jQuery for D3 https://api.jquery.com/category/dimensions/
    if (value === undefined) { // get
        let w = [];
        sel.each(function (d) {
            w.push(this.getBoundingClientRect().width);
        });
        return w;
    }
    else { // set
        sel.style("width", function (d, i) {
            let w = value[i];
            return w + "px";
        });
    }

    return sel; // for chaining
}


function uniqueId() {
    // https://gist.github.com/gordonbrander/2230317
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return "_" + Math.random().toString(36).substr(2, 9);
}

function shaker_sort(list, comp_func) {
    // A stable sort function to allow multi-level sorting of data
    // see: http://en.wikipedia.org/wiki/Cocktail_sort
    // thanks to Joseph Nahmias
    let b = 0;
    let t = list.length - 1;
    let swap = true;

    while (swap) {
        swap = false;
        for (var i = b; i < t; ++i) {
            if (comp_func(list[i], list[i + 1]) > 0) {
                let q = list[i];
                list[i] = list[i + 1];
                list[i + 1] = q;
                swap = true;
            }
        } // for
        t--;

        if (!swap) break;

        for (var i = t; i > b; --i) {
            if (comp_func(list[i], list[i - 1]) < 0) {
                let q = list[i];
                list[i] = list[i - 1];
                list[i - 1] = q;
                swap = true;
            }
        } // for
        b++;

    } // while(swap)
    return list;
}

function isFunction(fnc) {
    //https://stackoverflow.com/a/7356528/1395973
    return fnc && {}.toString.call(fnc) === '[object Function]';
}

function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
}

function dictValues(d) {
    return Object.keys(d).map(function (key) {
        return d[key];
    })
}