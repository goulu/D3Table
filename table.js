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

/*export*/
class Table extends Clusterize {

  constructor(element) {
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
    let thead = element.append("table").append("thead");
    thead.insert("th").append("tr").text("Headers");

    let scroll = element.append("div")
      .attr("id", uniqueId)
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

    let tr = rows.append("tr").classed("clusterize-no-data", true);
    tr.append("td").text("Loading data...");

    super({
      // rows: [], // do not specify it here
      scrollId: scroll.attr("id"),
      contentId: rows.attr("id"),
    });

    this.element = element;
    this.thead = thead;
    this.rows = element.select("tbody");

    this.format(function (v) {
      return v;
    });

    let table = this;

    this.options.callbacks = {
      clusterChanged: this.resize.bind(this)
    };

    window.addEventListener("resize", this.resize.bind(this));

    this.__data__ = [];
    this.selected = [];
    this.sortAscending = true;
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
        if (!isArray(table.data()[0])) { // rows are dicts
          i = table.columns[i]; // index by field
        }
        if (table.sortAscending) {
          table.sort(function (x, y) {
            return cmp(x[i], y[i])
          })
        } else {
          table.sort(function (x, y) {
            return cmp(y[i], x[i])
          })
        }
        table.thead.selectAll('th').classed('aes', false).classed('des', false);
        table.sortAscending = !table.sortAscending;
        let th = d3.select(this);
        th.classed('aes', table.sortAscending).classed('des', !table.sortAscending);
      });
    return this;
  }

  format(f) {
    this._format = f;
    return this;
  }

// run
  data(d) {
    if (d === undefined) {
      return this.__data__;
    }
    this.__data__ = d;
    table = this;
    this.update(function (i) {
        let row = d[i];
        if (!isArray(row)) { // suppose it's a dict
          row = table.columns.map(function (d, i) {
            return row[d]
          })
        }
        return '<tr>'
          + row.map(function (cell) {
            return '<td>' + (cell === undefined ? '' : table._format(cell)) + '</td>';
          }).join('')
          + '</tr>'
      }
      ,
      d.length
    );
    return this;
  }

  sort(f) {
    // shaker_sort(this.__data__, f); // stable, but slow
    this.data().sort(f); // quick ...
    this.data(this.data()) // refresh
  }

  filter(f) {
    self._filter = f;
    this.data(this.data()) // refresh
  }

  add(newdata) {
    // merge and sort data with current
    // don't rename it "append" to avoid conflicts with Clusterize and/or D3
    let data = this.data().concat(newdata);
    data = data.sort(function (a, b) {
      return d3.ascending(a.datetime, b.datetime)
    });
    return this.data(data);
  }

  indexOf(d) {
    return this.data().indexOf(d);
  }

  scrollTo(d, ms = 1000) {
    // smooth scroll to data d in ms milliseconds
    let node = this.rows.node();
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
      console.log(d + "not found in table");
      return;
    }

    this.rows.transition()
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

  // events

  resize() {
    // Makes header columns equal width to content columns
    let scrollBarWidth = width(this.element)[0] - width(this.rows)[0],
      td = this.rows.select('tr:not(.clusterize-extra-row)').selectAll('td'),
      w = width(td);
    w[w.length - 1] += scrollBarWidth;
    width(this.thead.selectAll('th'), w);
  }
}

//https://stackoverflow.com/a/25413534/1395973
d3.selection.prototype.first = function () {
  return d3.select(this[0][0]);
};
d3.selection.prototype.last = function () {
  var last = this.size() - 1;
  return d3.select(this[0][last]);
};

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
};

function shaker_sort(list, comp_func) {
  // A stable sort function to allow multi-level sorting of data
  // see: http://en.wikipedia.org/wiki/Cocktail_sort
  // thanks to Joseph Nahmias
  var b = 0;
  var t = list.length - 1;
  var swap = true;

  while (swap) {
    swap = false;
    for (var i = b; i < t; ++i) {
      if (comp_func(list[i], list[i + 1]) > 0) {
        var q = list[i];
        list[i] = list[i + 1];
        list[i + 1] = q;
        swap = true;
      }
    } // for
    t--;

    if (!swap) break;

    for (var i = t; i > b; --i) {
      if (comp_func(list[i], list[i - 1]) < 0) {
        var q = list[i];
        list[i] = list[i - 1];
        list[i - 1] = q;
        swap = true;
      }
    } // for
    b++;

  } // while(swap)
  return list;
}

function cmp(a, b) {
  if (a == b) return 0;
  if (a > b) return 1;
  return -1;
}

function isArray(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
}