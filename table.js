/*
reusable D3.js class for a table
* filterable thanks to D3
* sortable (TODO)
* efficient with large data thanks to https://clusterize.js.org/

@author  Philippe Guglielmetti https://github.com/goulu/
@license LGPL 3
@version 0.1
@updated 2018.06.25

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

    let tbody = scroll.append("table").append("tbody")
      .attr("id", uniqueId)
      .classed("clusterize-content", true);

    let tr = tbody.append("tr").classed("clusterize-no-data", true);
    tr.append("td").text("Loading data...");

    super({
      // rows: [], // do not specify it here
      scrollId: scroll.attr("id"),
      contentId: tbody.attr("id"),
    });

    this.selected = [];
    this.element = element;
    this.thead = thead;
    this.tbody = element.select("tbody");

    this.format(function (v) {
      return v;
    });

    let table=this;

    this.options.callbacks = {
      clusterChanged: function () {
        table.fitHeaderColumns();
        table.setHeaderWidth();
      }
    };

    window.addEventListener("resize", this.resize.bind(this));
  }

  // config

  header(cols) {
    this.columns = cols;
    this.thead.selectAll("th")
      .remove();
    this.thead.selectAll("th")
      .data(this.columns)
      .enter()
      .append("th")
      .text(function (column) {
        return column;
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
    let fmt = this._format
    this.update(function (i) {
        return '<tr>'
          + d[i].map(function (cell) {
            return '<td>' + fmt(cell) + '</td>';
          }).join('')
          + '</tr>'
      }
      ,
      d.length
    );
    return this;
  }

  append(newdata) {
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

  scrollTo(d, ms = 1000) {
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
      console.log(d + "not found in table");
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

  // events

  resize() {
    this.fitHeaderColumns();
    this.setHeaderWidth()
  }

  // Makes header columns equal width to content columns
  fitHeaderColumns() {
    let firstRow = this.tbody.select('tr:not(.clusterize-extra-row)');
    let td = firstRow.selectAll('td');
    let th = this.thead.selectAll('th');
    let w = [];
    td[0].map(function (d, i) {
      w.push(d.clientWidth)
    });
    th.attr("width", function (d, i) {
      return w[i]
    });
  }

  setHeaderWidth() {
    this.thead.width = this.tbody.width;
  }
}


function uniqueId() {
  // https://gist.github.com/gordonbrander/2230317
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return "_" + Math.random().toString(36).substr(2, 9);
};
