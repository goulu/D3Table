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

    let table = this;

    this.options.callbacks = {
      clusterChanged: this.resize.bind(this)
    };

    window.addEventListener("resize", this.resize.bind(this));

    let tr = rows.append("tr").classed("clusterize-no-data", true);
    tr.append("td").text("Loading data...");

    this.__data__ = [];
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
    return this;
  }

  sort(i, ascending = true, stable = false) {
    // sort data by i-th column, ascending or descending
    // optionally with stable sort algo (slower...)
    let th = this.thead.selectAll('th');
    th.classed('aes', false).classed('des', false);
    d3.select(th[0][i]).classed('aes', !ascending).classed('des', ascending);
    let data = this.data();
    if (data.length == 0) {
      return;
    }

    if (!isArray(data[0])) { // rows are dicts
      i = this.columns[i]; // index by field
    }

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
        return x.localeCompare(y, 'en', {'sensitivity': 'base'});
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
    if (stable) {
      shaker_sort(data, f);
    } else {
      data.sort(f);
    }
    this.draw();
  }

  filter(f) {
    self._filter = f;
    this.draw();
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
    let d=this.__data__;
    this.update(function (i) {
        let row = d[i];
        if (!isArray(row)) { // suppose it's a dict
          row = table.columns.map(function (d, i) {
            return row[d]
          })
        }
        return '<tr id="r' + i + '">'  // way to find the data back. id must start with non numeric
          + row.map(function (cell) {
            return '<td>' + (cell === undefined ? '' : table._format(cell)) + '</td>';
          }).join('')
          + '</tr>'
      }
      ,
      d.length
    );

    // (re)attach events to rows

    function fevent(e) {
      e = e || event;
      if (e.type in table.options.callbacks) { // handle it
        let target = e.target;
        if (target.tagName == 'TD') {
          target = target.parentElement; // events are on rows (for now)
        }
        let i = Number(target.id.substr(1));  //get tr #id
        let d = table.data()[i];
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

    return this;
  }

  add(newdata, i = 0) {
    // merge and sort data with current
    // don't rename it "append" to avoid conflicts with Clusterize and/or D3
    this.__data__ = this.data().concat(newdata);
    this.sort(i);
    return this.data();
  }

  indexOf(d) {
    return this.data().indexOf(d);
  }

  scrollTo(d, ms = 1000) {
    // smooth scroll to data d in ms milliseconds
    let line = this.indexOf(d);
    if (line < 0) {
      console.log(d + "not found in table");
      return;
    }
    let node = this.scroll.node();

    let f = node.scrollHeight / this.data().length;
    let nlines = node.clientHeight / f;

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
      .tween("scroll", scrollTween(
        (line - Math.round(nlines / 2)) * f
        )
      );
  }

  select(d, i) {
    if (i===undefined){
      i=this.indexOf(d)
    }
    this._selected.add(i);
    let tr = this.rows.select("#r" + i);
    tr.classed("highlight", true);
  }

  deselect(d,i) {
    if (i===undefined){
      if (d===undefined) {
        this._selected.clear();
        this.draw();
        return
      }
      i=this.indexOf(d)
    }
    this._selected.delete(i);
    let tr = this.rows.select("#r" + i);
    tr.classed("highlight", false);
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


function isArray(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
}