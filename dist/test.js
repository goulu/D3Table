/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/test.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/clusterize.js":
/*!***************************!*\
  !*** ./src/clusterize.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* Clusterize.js - v0.19.0 - 2020-05-18
 http://NeXTs.github.com/Clusterize.js/
 Copyright (c) 2015 Denis Lukov; Licensed GPLv3 */

;(function (name, definition) {
  if (true) module.exports = definition();
  else {}
}('Clusterize', function () {
  "use strict"

  // detect ie9 and lower
  // https://gist.github.com/padolsey/527683#comment-786682
  var ie = (function(){
    for( var v = 3,
             el = document.createElement('b'),
             all = el.all || [];
         el.innerHTML = '<!--[if gt IE ' + (++v) + ']><i><![endif]-->',
         all[0];
       ){}
    return v > 4 ? v : document.documentMode;
  }()),
  is_mac = navigator.platform.toLowerCase().indexOf('mac') + 1;
  
  var Clusterize = function(data) {
    if( ! (this instanceof Clusterize))
      return new Clusterize(data);
    var self = this;

    var defaults = {
      rows_in_block: 50,
      blocks_in_cluster: 4,
      tag: null,
      show_no_data_row: true,
      no_data_class: 'clusterize-no-data',
      no_data_text: 'No data',
      keep_parity: true,
      callbacks: {}
    }

    // public parameters
    self.options = {};
    var options = ['rows_in_block', 'blocks_in_cluster', 'show_no_data_row', 'no_data_class', 'no_data_text', 'keep_parity', 'tag', 'callbacks'];
    for(var i = 0, option; option = options[i]; i++) {
      self.options[option] = typeof data[option] != 'undefined' && data[option] != null
        ? data[option]
        : defaults[option];
    }

    var elems = ['scroll', 'content'];
    for(var i = 0, elem; elem = elems[i]; i++) {
      self[elem + '_elem'] = data[elem + 'Id']
        ? document.getElementById(data[elem + 'Id'])
        : data[elem + 'Elem'];
      if( ! self[elem + '_elem'])
        throw new Error("Error! Could not find " + elem + " element");
    }

    // tabindex forces the browser to keep focus on the scrolling list, fixes #11
    if( ! self.content_elem.hasAttribute('tabindex'))
      self.content_elem.setAttribute('tabindex', 0);

    // private parameters

    var nrows = (data.nrows !== undefined) ? data.nrows : 0
    var frow = function (i) {
      return ''
    }; // function that returns i-th row as HTML text

    var _rows = function () {
      // private function that rebuilds the array for append+prepend+destroy
      var arr = Array.apply(null, Array(nrows));
      arr = arr.map(function (x, i) {
        return frow(i)
      });
      return arr
    }

    var add = function (new_rows, where = "append") {
      if (isArray(new_rows)) { // the "classic" case
        var arr = (where == 'append')
          ? _rows().concat(new_rows)
          : new_rows.concat(_rows());
        frow = function (i) {
          return arr[i]
        }
        nrows += new_rows.length;
      }
      else if (isFunction(new_rows)) { // rows defined by a function
        frow = new_rows;
        // nrows should be assigned separately
      }
    }

    if (data.rows !== undefined) {
      add(data.rows);
    }
    else {
      add(this.fetchMarkup());
    }

    var cache = {},
      scroll_top = self.scroll_elem.scrollTop;

    // append initial data
    self.insertToDOM(frow, nrows, cache);

    // restore the scroll position
    self.scroll_elem.scrollTop = scroll_top;

    // adding scroll handler
    var last_cluster = false,
    scroll_debounce = 0,
    pointer_events_set = false,
    scrollEv = function() {
      // fixes scrolling issue on Mac #3
      if (is_mac) {
          if( ! pointer_events_set) self.content_elem.style.pointerEvents = 'none';
          pointer_events_set = true;
          clearTimeout(scroll_debounce);
          scroll_debounce = setTimeout(function () {
              self.content_elem.style.pointerEvents = 'auto';
              pointer_events_set = false;
          }, 50);
        }
        if (last_cluster != (last_cluster = self.getClusterNum()))
          self.insertToDOM(frow, nrows, cache);
        if (self.options.callbacks.scrollingProgress)
          self.options.callbacks.scrollingProgress(self.getScrollProgress());
      },
      resize_debounce = 0,
      resizeEv = function () {
        clearTimeout(resize_debounce);
        resize_debounce = setTimeout(self.refresh, 100);
      }
    on('scroll', self.scroll_elem, scrollEv);
    on('resize', window, resizeEv);

    // public methods
    self.destroy = function (clean) {
      off('scroll', self.scroll_elem, scrollEv);
      off('resize', window, resizeEv);
      self.html((clean ? self.generateEmptyRow() : _rows()).join(''));
    }
    self.refresh = function (force) {
      if (self.getRowsHeight(nrows) || force) self.update(frow,nrows);
    }
    self.update = function (new_rows, new_nrows = 0) {
      // a new_nrows should be specified if new_rows is a function, otherwise it's recalculated
      nrows = new_nrows;
      add(new_rows);
      var scroll_top = self.scroll_elem.scrollTop;
      // fixes #39
      if (nrows * self.options.item_height < scroll_top) {
        self.scroll_elem.scrollTop = 0;
        last_cluster = 0;
      }
      self.insertToDOM(frow, nrows, cache);
      self.scroll_elem.scrollTop = scroll_top;
    }
    self.clear = function () {
      self.update([],0);
    }
    self.getRowsAmount = function () {
      return nrows;
    }
    self.getScrollProgress = function () {
      return this.options.scroll_top / (nrows * this.options.item_height) * 100 || 0;
    }

    self.append = function (rows) {
      add(rows, 'append',);
      self.insertToDOM(frow, nrows, cache);
    }
    self.prepend = function (rows) {
      add(rows, 'prepend');
      self.insertToDOM(frow, nrows, cache);
    }
  };

  Clusterize.prototype = {
    constructor: Clusterize,
    // fetch existing markup
    fetchMarkup: function () {
      var rows = [], rows_nodes = this.getChildNodes(this.content_elem);
      while (rows_nodes.length) {
        rows.push(rows_nodes.shift().outerHTML);
      }
      return rows;
    },
    // get tag name, content tag name, tag height, calc cluster height
    exploreEnvironment: function (frow, nrows, cache) {
      var opts = this.options;
      opts.content_tag = this.content_elem.tagName.toLowerCase();
      if (!nrows) return;
      if (ie && ie <= 9 && !opts.tag) {
        opts.tag = frow(0).match(/<([^>\s/]*)/)[1].toLowerCase();
      }
      var nchildren = this.content_elem.children.length;
      if (!opts.tag) {
        opts.tag = this.content_elem.children[0].tagName.toLowerCase();
      }
      if (nchildren <= 1) {
        // what's the purpose of this ??? it may clear the html content ...
        cache.data = this.html(frow(0) + frow(0) + frow(0));
      }
      this.getRowsHeight(nrows);
    },
    getRowsHeight: function (nrows) {
      var opts = this.options,
        prev_item_height = opts.item_height;
      opts.cluster_height = 0;
      if (!nrows) return;
      var nodes = this.content_elem.children;
      if (!nodes.length) return;
      var node = nodes[Math.floor(nodes.length / 2)];
      opts.item_height = node.offsetHeight;
      // consider table's border-spacing
      if (opts.tag == 'tr' && getStyle('borderCollapse', this.content_elem) != 'collapse')
        opts.item_height += parseInt(getStyle('borderSpacing', this.content_elem), 10) || 0;
      // consider margins (and margins collapsing)
      if (opts.tag != 'tr') {
        var marginTop = parseInt(getStyle('marginTop', node), 10) || 0;
        var marginBottom = parseInt(getStyle('marginBottom', node), 10) || 0;
        opts.item_height += Math.max(marginTop, marginBottom);
      }
      opts.block_height = opts.item_height * opts.rows_in_block;
      opts.rows_in_cluster = opts.blocks_in_cluster * opts.rows_in_block;
      opts.cluster_height = opts.blocks_in_cluster * opts.block_height;
      return prev_item_height != opts.item_height;
    },
    // get current cluster number
    getClusterNum: function () {
      this.options.scroll_top = this.scroll_elem.scrollTop;
      return Math.floor(this.options.scroll_top / (this.options.cluster_height - this.options.block_height)) || 0;
    },
    // generate empty row if no data provided
    generateEmptyRow: function () {
      var opts = this.options;
      if (!opts.tag || !opts.show_no_data_row) return [];
      var empty_row = document.createElement(opts.tag),
        no_data_content = document.createTextNode(opts.no_data_text), td;
      empty_row.className = opts.no_data_class;
      if (opts.tag == 'tr') {
        td = document.createElement('td');
        // fixes #53
        td.colSpan = 100;
        td.appendChild(no_data_content);
      }
      empty_row.appendChild(td || no_data_content);
      return [empty_row.outerHTML];
    },
    // generate cluster for current scroll position
    generate: function (frow, nrows, cluster_num) {
      var opts = this.options;
      /*
      if (nrows < opts.rows_in_block) {
        return {
          top_offset: 0,
          bottom_offset: 0,
          rows_above: 0,
          rows: nrows ? frow : this.generateEmptyRow
        }
      }
      */
      var items_start = Math.max((opts.rows_in_cluster - opts.rows_in_block) * cluster_num, 0),
        items_end = Math.min(items_start + opts.rows_in_cluster, nrows),
        top_offset = Math.max(items_start * opts.item_height, 0),
        bottom_offset = Math.max((nrows - items_end) * opts.item_height, 0),
        this_cluster_rows = [],
        rows_above = items_start;
      if (top_offset < 1) {
        rows_above++;
      }
      for (var i = items_start; i < items_end; i++) {
        try {
          this_cluster_rows.push(frow(i));
        }
        catch (err) {
          this_cluster_rows.push(this.generateEmptyRow());
        }
      }
      return {
        top_offset: top_offset,
        bottom_offset: bottom_offset,
        rows_above: rows_above,
        rows: this_cluster_rows
      }
    },
    renderExtraTag: function (class_name, height) {
      var tag = document.createElement(this.options.tag),
        clusterize_prefix = 'clusterize-';
      tag.className = [clusterize_prefix + 'extra-row', clusterize_prefix + class_name].join(' ');
      height && (tag.style.height = height + 'px');
      return tag.outerHTML;
    },
    // if necessary verify data changed and insert to DOM
    insertToDOM: function (frow, nrows, cache) {
      // explore row's height
      if (!this.options.cluster_height) {
        this.exploreEnvironment(frow, nrows, cache);
      }
      var data = this.generate(frow, nrows, this.getClusterNum()),
        this_cluster_rows = data.rows.join(''),
        this_cluster_content_changed = this.checkChanges('data', this_cluster_rows, cache),
        top_offset_changed = this.checkChanges('top', data.top_offset, cache),
        only_bottom_offset_changed = this.checkChanges('bottom', data.bottom_offset, cache),
        callbacks = this.options.callbacks,
        layout = [];

      if (this_cluster_content_changed || top_offset_changed) {
        if (data.top_offset) {
          this.options.keep_parity && layout.push(this.renderExtraTag('keep-parity'));
          layout.push(this.renderExtraTag('top-space', data.top_offset));
        }
        layout.push(this_cluster_rows);
        data.bottom_offset && layout.push(this.renderExtraTag('bottom-space', data.bottom_offset));
        callbacks.clusterWillChange && callbacks.clusterWillChange();
        this.html(layout.join(''));
        this.options.content_tag == 'ol' && this.content_elem.setAttribute('start', data.rows_above);
        this.content_elem.style['counter-increment'] = 'clusterize-counter ' + (data.rows_above - 1);
        callbacks.clusterChanged && callbacks.clusterChanged();
      } else if (only_bottom_offset_changed) {
        this.content_elem.lastChild.style.height = data.bottom_offset + 'px';
      }
    },
    // unfortunately ie <= 9 does not allow to use innerHTML for table elements, so make a workaround
    html: function (data) {
      var content_elem = this.content_elem;
      if (ie && ie <= 9 && this.options.tag == 'tr') {
        var div = document.createElement('div'), last;
        div.innerHTML = '<table><tbody>' + data + '</tbody></table>';
        while ((last = content_elem.lastChild)) {
          content_elem.removeChild(last);
        }
        var rows_nodes = this.getChildNodes(div.firstChild.firstChild);
        while (rows_nodes.length) {
          content_elem.appendChild(rows_nodes.shift());
        }
      } else {
        content_elem.innerHTML = data;
      }
    },
    getChildNodes: function (tag) {
      var child_nodes = tag.children, nodes = [];
      for (var i = 0, ii = child_nodes.length; i < ii; i++) {
        nodes.push(child_nodes[i]);
      }
      return nodes;
    },
    checkChanges: function (type, value, cache) {
      var changed = value != cache[type];
      cache[type] = value;
      return changed;
    }
  }

// support functions
  function on(evt, element, fnc) {
    return element.addEventListener ? element.addEventListener(evt, fnc, false) : element.attachEvent("on" + evt, fnc);
  }

  function off(evt, element, fnc) {
    return element.removeEventListener ? element.removeEventListener(evt, fnc, false) : element.detachEvent("on" + evt, fnc);
  }

  function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
  }

  function isFunction(fnc) {
    //https://stackoverflow.com/a/7356528/1395973
    return fnc && {}.toString.call(fnc) === '[object Function]';
  }

  function getStyle(prop, elem) {
    return window.getComputedStyle ? window.getComputedStyle(elem)[prop] : elem.currentStyle[prop];
  }

  return Clusterize;
}))
;

/***/ }),

/***/ "./src/table.js":
/*!**********************!*\
  !*** ./src/table.js ***!
  \**********************/
/*! exports provided: Table */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Table", function() { return Table; });
/* harmony import */ var _clusterize_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./clusterize.js */ "./src/clusterize.js");
/* harmony import */ var _clusterize_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_clusterize_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! d3 */ "d3");
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(d3__WEBPACK_IMPORTED_MODULE_1__);
/*
reusable D3.js class for (LARGE) tables
* efficient with large data thanks to https://clusterize.js.org/
* filterable thanks to D3
* sortable thanks to http://bl.ocks.org/AMDS/4a61497182b8fcb05906
* and https://www.kryogenix.org/code/browser/sorttable/)

@author  Philippe Guglielmetti https://github.com/goulu/
 */




class Table extends _clusterize_js__WEBPACK_IMPORTED_MODULE_0__ {

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
            element=d3__WEBPACK_IMPORTED_MODULE_1__["select"](element) 
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
        d3__WEBPACK_IMPORTED_MODULE_1__["select"](th[0][i]).classed('aes', !ascending).classed('des', ascending);
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
            let e = d3__WEBPACK_IMPORTED_MODULE_1__["event"];
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
                let i = d3__WEBPACK_IMPORTED_MODULE_1__["interpolateNumber"](node.scrollTop, offset);
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
d3__WEBPACK_IMPORTED_MODULE_1__["selection"]
    .prototype
    .first = function () {
        return d3__WEBPACK_IMPORTED_MODULE_1__["select"](this[0][0]);
    };
d3__WEBPACK_IMPORTED_MODULE_1__["selection"]
    .prototype
    .last = function () {
        var last = this.size() - 1;
        return d3__WEBPACK_IMPORTED_MODULE_1__["select"](this[0][last]);
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

/***/ }),

/***/ "./src/test.js":
/*!*********************!*\
  !*** ./src/test.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _table_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./table.js */ "./src/table.js");

console.log(_table_js__WEBPACK_IMPORTED_MODULE_0__["Table"])
var table = new _table_js__WEBPACK_IMPORTED_MODULE_0__["Table"]('.table')
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

/***/ }),

/***/ "d3":
/*!*********************!*\
  !*** external "d3" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = d3;

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsdXN0ZXJpemUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RhYmxlLmpzIiwid2VicGFjazovLy8uL3NyYy90ZXN0LmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcImQzXCIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQSxnQ0FBZ0M7O0FBRWhDLENBQUM7QUFDRCxNQUFNLElBQTRCO0FBQ2xDLE9BQU8sRUFDMEI7QUFDakMsQ0FBQztBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixxQkFBcUI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3QkFBd0IsaUJBQWlCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQztBQUN0QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCO0FBQ2xCOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsZUFBZTtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsOENBQThDLFFBQVE7QUFDdEQ7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQztBQUNELEM7Ozs7Ozs7Ozs7OztBQzdYQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFNkM7QUFDckI7O0FBRWpCLG9CQUFvQiwyQ0FBVTs7QUFFckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQix5Q0FBUztBQUM3Qjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTOzs7QUFHVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsMkJBQTJCOztBQUUzQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLDJEQUEyRDtBQUMzRCxhQUFhO0FBQ2Isb0JBQW9CO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLHlDQUFTO0FBQ2pCO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7O0FBRUEsZ0NBQWdDO0FBQ2hDLGdDQUFnQztBQUNoQzs7QUFFQSwwQ0FBMEMsd0JBQXdCOztBQUVsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDJDQUEyQztBQUMzQztBQUNBO0FBQ0EsU0FBUzs7QUFFVCxtQ0FBbUM7QUFDbkM7QUFDQSxTQUFTO0FBQ1Qsb0JBQW9CO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHVCQUF1QjtBQUN2QjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxvQkFBb0Isd0NBQVE7QUFDNUIsb0RBQW9EO0FBQ3BEO0FBQ0E7QUFDQSxrREFBa0Q7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhOztBQUViO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3QkFBd0Isb0RBQW9CO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsb0JBQW9CO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EsNENBQ2M7QUFDZDtBQUNBO0FBQ0EsZUFBZSx5Q0FBUztBQUN4QjtBQUNBLDRDQUNjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0EsZUFBZSx5Q0FBUztBQUN4Qjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQSxlQUFlO0FBQ2Y7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBdUIsT0FBTztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7O0FBRUEsdUJBQXVCLE9BQU87QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDOzs7Ozs7Ozs7Ozs7QUNsaEJBO0FBQUE7QUFBZ0M7QUFDaEMsWUFBWSwrQ0FBSztBQUNqQixnQkFBZ0IsK0NBQUs7QUFDckI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsRTs7Ozs7Ozs7Ozs7QUN0Q0Qsb0IiLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3Rlc3QuanNcIik7XG4iLCIvKiBDbHVzdGVyaXplLmpzIC0gdjAuMTkuMCAtIDIwMjAtMDUtMThcclxuIGh0dHA6Ly9OZVhUcy5naXRodWIuY29tL0NsdXN0ZXJpemUuanMvXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTUgRGVuaXMgTHVrb3Y7IExpY2Vuc2VkIEdQTHYzICovXHJcblxyXG47KGZ1bmN0aW9uIChuYW1lLCBkZWZpbml0aW9uKSB7XHJcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcpIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpO1xyXG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PSAnb2JqZWN0JykgZGVmaW5lKGRlZmluaXRpb24pO1xyXG4gIGVsc2UgdGhpc1tuYW1lXSA9IGRlZmluaXRpb24oKTtcclxufSgnQ2x1c3Rlcml6ZScsIGZ1bmN0aW9uICgpIHtcclxuICBcInVzZSBzdHJpY3RcIlxyXG5cclxuICAvLyBkZXRlY3QgaWU5IGFuZCBsb3dlclxyXG4gIC8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3BhZG9sc2V5LzUyNzY4MyNjb21tZW50LTc4NjY4MlxyXG4gIHZhciBpZSA9IChmdW5jdGlvbigpe1xyXG4gICAgZm9yKCB2YXIgdiA9IDMsXHJcbiAgICAgICAgICAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2InKSxcclxuICAgICAgICAgICAgIGFsbCA9IGVsLmFsbCB8fCBbXTtcclxuICAgICAgICAgZWwuaW5uZXJIVE1MID0gJzwhLS1baWYgZ3QgSUUgJyArICgrK3YpICsgJ10+PGk+PCFbZW5kaWZdLS0+JyxcclxuICAgICAgICAgYWxsWzBdO1xyXG4gICAgICAgKXt9XHJcbiAgICByZXR1cm4gdiA+IDQgPyB2IDogZG9jdW1lbnQuZG9jdW1lbnRNb2RlO1xyXG4gIH0oKSksXHJcbiAgaXNfbWFjID0gbmF2aWdhdG9yLnBsYXRmb3JtLnRvTG93ZXJDYXNlKCkuaW5kZXhPZignbWFjJykgKyAxO1xyXG4gIFxyXG4gIHZhciBDbHVzdGVyaXplID0gZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgaWYoICEgKHRoaXMgaW5zdGFuY2VvZiBDbHVzdGVyaXplKSlcclxuICAgICAgcmV0dXJuIG5ldyBDbHVzdGVyaXplKGRhdGEpO1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHZhciBkZWZhdWx0cyA9IHtcclxuICAgICAgcm93c19pbl9ibG9jazogNTAsXHJcbiAgICAgIGJsb2Nrc19pbl9jbHVzdGVyOiA0LFxyXG4gICAgICB0YWc6IG51bGwsXHJcbiAgICAgIHNob3dfbm9fZGF0YV9yb3c6IHRydWUsXHJcbiAgICAgIG5vX2RhdGFfY2xhc3M6ICdjbHVzdGVyaXplLW5vLWRhdGEnLFxyXG4gICAgICBub19kYXRhX3RleHQ6ICdObyBkYXRhJyxcclxuICAgICAga2VlcF9wYXJpdHk6IHRydWUsXHJcbiAgICAgIGNhbGxiYWNrczoge31cclxuICAgIH1cclxuXHJcbiAgICAvLyBwdWJsaWMgcGFyYW1ldGVyc1xyXG4gICAgc2VsZi5vcHRpb25zID0ge307XHJcbiAgICB2YXIgb3B0aW9ucyA9IFsncm93c19pbl9ibG9jaycsICdibG9ja3NfaW5fY2x1c3RlcicsICdzaG93X25vX2RhdGFfcm93JywgJ25vX2RhdGFfY2xhc3MnLCAnbm9fZGF0YV90ZXh0JywgJ2tlZXBfcGFyaXR5JywgJ3RhZycsICdjYWxsYmFja3MnXTtcclxuICAgIGZvcih2YXIgaSA9IDAsIG9wdGlvbjsgb3B0aW9uID0gb3B0aW9uc1tpXTsgaSsrKSB7XHJcbiAgICAgIHNlbGYub3B0aW9uc1tvcHRpb25dID0gdHlwZW9mIGRhdGFbb3B0aW9uXSAhPSAndW5kZWZpbmVkJyAmJiBkYXRhW29wdGlvbl0gIT0gbnVsbFxyXG4gICAgICAgID8gZGF0YVtvcHRpb25dXHJcbiAgICAgICAgOiBkZWZhdWx0c1tvcHRpb25dO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBlbGVtcyA9IFsnc2Nyb2xsJywgJ2NvbnRlbnQnXTtcclxuICAgIGZvcih2YXIgaSA9IDAsIGVsZW07IGVsZW0gPSBlbGVtc1tpXTsgaSsrKSB7XHJcbiAgICAgIHNlbGZbZWxlbSArICdfZWxlbSddID0gZGF0YVtlbGVtICsgJ0lkJ11cclxuICAgICAgICA/IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRhdGFbZWxlbSArICdJZCddKVxyXG4gICAgICAgIDogZGF0YVtlbGVtICsgJ0VsZW0nXTtcclxuICAgICAgaWYoICEgc2VsZltlbGVtICsgJ19lbGVtJ10pXHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXJyb3IhIENvdWxkIG5vdCBmaW5kIFwiICsgZWxlbSArIFwiIGVsZW1lbnRcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdGFiaW5kZXggZm9yY2VzIHRoZSBicm93c2VyIHRvIGtlZXAgZm9jdXMgb24gdGhlIHNjcm9sbGluZyBsaXN0LCBmaXhlcyAjMTFcclxuICAgIGlmKCAhIHNlbGYuY29udGVudF9lbGVtLmhhc0F0dHJpYnV0ZSgndGFiaW5kZXgnKSlcclxuICAgICAgc2VsZi5jb250ZW50X2VsZW0uc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIDApO1xyXG5cclxuICAgIC8vIHByaXZhdGUgcGFyYW1ldGVyc1xyXG5cclxuICAgIHZhciBucm93cyA9IChkYXRhLm5yb3dzICE9PSB1bmRlZmluZWQpID8gZGF0YS5ucm93cyA6IDBcclxuICAgIHZhciBmcm93ID0gZnVuY3Rpb24gKGkpIHtcclxuICAgICAgcmV0dXJuICcnXHJcbiAgICB9OyAvLyBmdW5jdGlvbiB0aGF0IHJldHVybnMgaS10aCByb3cgYXMgSFRNTCB0ZXh0XHJcblxyXG4gICAgdmFyIF9yb3dzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAvLyBwcml2YXRlIGZ1bmN0aW9uIHRoYXQgcmVidWlsZHMgdGhlIGFycmF5IGZvciBhcHBlbmQrcHJlcGVuZCtkZXN0cm95XHJcbiAgICAgIHZhciBhcnIgPSBBcnJheS5hcHBseShudWxsLCBBcnJheShucm93cykpO1xyXG4gICAgICBhcnIgPSBhcnIubWFwKGZ1bmN0aW9uICh4LCBpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZyb3coaSlcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBhcnJcclxuICAgIH1cclxuXHJcbiAgICB2YXIgYWRkID0gZnVuY3Rpb24gKG5ld19yb3dzLCB3aGVyZSA9IFwiYXBwZW5kXCIpIHtcclxuICAgICAgaWYgKGlzQXJyYXkobmV3X3Jvd3MpKSB7IC8vIHRoZSBcImNsYXNzaWNcIiBjYXNlXHJcbiAgICAgICAgdmFyIGFyciA9ICh3aGVyZSA9PSAnYXBwZW5kJylcclxuICAgICAgICAgID8gX3Jvd3MoKS5jb25jYXQobmV3X3Jvd3MpXHJcbiAgICAgICAgICA6IG5ld19yb3dzLmNvbmNhdChfcm93cygpKTtcclxuICAgICAgICBmcm93ID0gZnVuY3Rpb24gKGkpIHtcclxuICAgICAgICAgIHJldHVybiBhcnJbaV1cclxuICAgICAgICB9XHJcbiAgICAgICAgbnJvd3MgKz0gbmV3X3Jvd3MubGVuZ3RoO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKGlzRnVuY3Rpb24obmV3X3Jvd3MpKSB7IC8vIHJvd3MgZGVmaW5lZCBieSBhIGZ1bmN0aW9uXHJcbiAgICAgICAgZnJvdyA9IG5ld19yb3dzO1xyXG4gICAgICAgIC8vIG5yb3dzIHNob3VsZCBiZSBhc3NpZ25lZCBzZXBhcmF0ZWx5XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoZGF0YS5yb3dzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgYWRkKGRhdGEucm93cyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgYWRkKHRoaXMuZmV0Y2hNYXJrdXAoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGNhY2hlID0ge30sXHJcbiAgICAgIHNjcm9sbF90b3AgPSBzZWxmLnNjcm9sbF9lbGVtLnNjcm9sbFRvcDtcclxuXHJcbiAgICAvLyBhcHBlbmQgaW5pdGlhbCBkYXRhXHJcbiAgICBzZWxmLmluc2VydFRvRE9NKGZyb3csIG5yb3dzLCBjYWNoZSk7XHJcblxyXG4gICAgLy8gcmVzdG9yZSB0aGUgc2Nyb2xsIHBvc2l0aW9uXHJcbiAgICBzZWxmLnNjcm9sbF9lbGVtLnNjcm9sbFRvcCA9IHNjcm9sbF90b3A7XHJcblxyXG4gICAgLy8gYWRkaW5nIHNjcm9sbCBoYW5kbGVyXHJcbiAgICB2YXIgbGFzdF9jbHVzdGVyID0gZmFsc2UsXHJcbiAgICBzY3JvbGxfZGVib3VuY2UgPSAwLFxyXG4gICAgcG9pbnRlcl9ldmVudHNfc2V0ID0gZmFsc2UsXHJcbiAgICBzY3JvbGxFdiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAvLyBmaXhlcyBzY3JvbGxpbmcgaXNzdWUgb24gTWFjICMzXHJcbiAgICAgIGlmIChpc19tYWMpIHtcclxuICAgICAgICAgIGlmKCAhIHBvaW50ZXJfZXZlbnRzX3NldCkgc2VsZi5jb250ZW50X2VsZW0uc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcclxuICAgICAgICAgIHBvaW50ZXJfZXZlbnRzX3NldCA9IHRydWU7XHJcbiAgICAgICAgICBjbGVhclRpbWVvdXQoc2Nyb2xsX2RlYm91bmNlKTtcclxuICAgICAgICAgIHNjcm9sbF9kZWJvdW5jZSA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgIHNlbGYuY29udGVudF9lbGVtLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnYXV0byc7XHJcbiAgICAgICAgICAgICAgcG9pbnRlcl9ldmVudHNfc2V0ID0gZmFsc2U7XHJcbiAgICAgICAgICB9LCA1MCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChsYXN0X2NsdXN0ZXIgIT0gKGxhc3RfY2x1c3RlciA9IHNlbGYuZ2V0Q2x1c3Rlck51bSgpKSlcclxuICAgICAgICAgIHNlbGYuaW5zZXJ0VG9ET00oZnJvdywgbnJvd3MsIGNhY2hlKTtcclxuICAgICAgICBpZiAoc2VsZi5vcHRpb25zLmNhbGxiYWNrcy5zY3JvbGxpbmdQcm9ncmVzcylcclxuICAgICAgICAgIHNlbGYub3B0aW9ucy5jYWxsYmFja3Muc2Nyb2xsaW5nUHJvZ3Jlc3Moc2VsZi5nZXRTY3JvbGxQcm9ncmVzcygpKTtcclxuICAgICAgfSxcclxuICAgICAgcmVzaXplX2RlYm91bmNlID0gMCxcclxuICAgICAgcmVzaXplRXYgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHJlc2l6ZV9kZWJvdW5jZSk7XHJcbiAgICAgICAgcmVzaXplX2RlYm91bmNlID0gc2V0VGltZW91dChzZWxmLnJlZnJlc2gsIDEwMCk7XHJcbiAgICAgIH1cclxuICAgIG9uKCdzY3JvbGwnLCBzZWxmLnNjcm9sbF9lbGVtLCBzY3JvbGxFdik7XHJcbiAgICBvbigncmVzaXplJywgd2luZG93LCByZXNpemVFdik7XHJcblxyXG4gICAgLy8gcHVibGljIG1ldGhvZHNcclxuICAgIHNlbGYuZGVzdHJveSA9IGZ1bmN0aW9uIChjbGVhbikge1xyXG4gICAgICBvZmYoJ3Njcm9sbCcsIHNlbGYuc2Nyb2xsX2VsZW0sIHNjcm9sbEV2KTtcclxuICAgICAgb2ZmKCdyZXNpemUnLCB3aW5kb3csIHJlc2l6ZUV2KTtcclxuICAgICAgc2VsZi5odG1sKChjbGVhbiA/IHNlbGYuZ2VuZXJhdGVFbXB0eVJvdygpIDogX3Jvd3MoKSkuam9pbignJykpO1xyXG4gICAgfVxyXG4gICAgc2VsZi5yZWZyZXNoID0gZnVuY3Rpb24gKGZvcmNlKSB7XHJcbiAgICAgIGlmIChzZWxmLmdldFJvd3NIZWlnaHQobnJvd3MpIHx8IGZvcmNlKSBzZWxmLnVwZGF0ZShmcm93LG5yb3dzKTtcclxuICAgIH1cclxuICAgIHNlbGYudXBkYXRlID0gZnVuY3Rpb24gKG5ld19yb3dzLCBuZXdfbnJvd3MgPSAwKSB7XHJcbiAgICAgIC8vIGEgbmV3X25yb3dzIHNob3VsZCBiZSBzcGVjaWZpZWQgaWYgbmV3X3Jvd3MgaXMgYSBmdW5jdGlvbiwgb3RoZXJ3aXNlIGl0J3MgcmVjYWxjdWxhdGVkXHJcbiAgICAgIG5yb3dzID0gbmV3X25yb3dzO1xyXG4gICAgICBhZGQobmV3X3Jvd3MpO1xyXG4gICAgICB2YXIgc2Nyb2xsX3RvcCA9IHNlbGYuc2Nyb2xsX2VsZW0uc2Nyb2xsVG9wO1xyXG4gICAgICAvLyBmaXhlcyAjMzlcclxuICAgICAgaWYgKG5yb3dzICogc2VsZi5vcHRpb25zLml0ZW1faGVpZ2h0IDwgc2Nyb2xsX3RvcCkge1xyXG4gICAgICAgIHNlbGYuc2Nyb2xsX2VsZW0uc2Nyb2xsVG9wID0gMDtcclxuICAgICAgICBsYXN0X2NsdXN0ZXIgPSAwO1xyXG4gICAgICB9XHJcbiAgICAgIHNlbGYuaW5zZXJ0VG9ET00oZnJvdywgbnJvd3MsIGNhY2hlKTtcclxuICAgICAgc2VsZi5zY3JvbGxfZWxlbS5zY3JvbGxUb3AgPSBzY3JvbGxfdG9wO1xyXG4gICAgfVxyXG4gICAgc2VsZi5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgc2VsZi51cGRhdGUoW10sMCk7XHJcbiAgICB9XHJcbiAgICBzZWxmLmdldFJvd3NBbW91bnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiBucm93cztcclxuICAgIH1cclxuICAgIHNlbGYuZ2V0U2Nyb2xsUHJvZ3Jlc3MgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuc2Nyb2xsX3RvcCAvIChucm93cyAqIHRoaXMub3B0aW9ucy5pdGVtX2hlaWdodCkgKiAxMDAgfHwgMDtcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLmFwcGVuZCA9IGZ1bmN0aW9uIChyb3dzKSB7XHJcbiAgICAgIGFkZChyb3dzLCAnYXBwZW5kJywpO1xyXG4gICAgICBzZWxmLmluc2VydFRvRE9NKGZyb3csIG5yb3dzLCBjYWNoZSk7XHJcbiAgICB9XHJcbiAgICBzZWxmLnByZXBlbmQgPSBmdW5jdGlvbiAocm93cykge1xyXG4gICAgICBhZGQocm93cywgJ3ByZXBlbmQnKTtcclxuICAgICAgc2VsZi5pbnNlcnRUb0RPTShmcm93LCBucm93cywgY2FjaGUpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIENsdXN0ZXJpemUucHJvdG90eXBlID0ge1xyXG4gICAgY29uc3RydWN0b3I6IENsdXN0ZXJpemUsXHJcbiAgICAvLyBmZXRjaCBleGlzdGluZyBtYXJrdXBcclxuICAgIGZldGNoTWFya3VwOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciByb3dzID0gW10sIHJvd3Nfbm9kZXMgPSB0aGlzLmdldENoaWxkTm9kZXModGhpcy5jb250ZW50X2VsZW0pO1xyXG4gICAgICB3aGlsZSAocm93c19ub2Rlcy5sZW5ndGgpIHtcclxuICAgICAgICByb3dzLnB1c2gocm93c19ub2Rlcy5zaGlmdCgpLm91dGVySFRNTCk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHJvd3M7XHJcbiAgICB9LFxyXG4gICAgLy8gZ2V0IHRhZyBuYW1lLCBjb250ZW50IHRhZyBuYW1lLCB0YWcgaGVpZ2h0LCBjYWxjIGNsdXN0ZXIgaGVpZ2h0XHJcbiAgICBleHBsb3JlRW52aXJvbm1lbnQ6IGZ1bmN0aW9uIChmcm93LCBucm93cywgY2FjaGUpIHtcclxuICAgICAgdmFyIG9wdHMgPSB0aGlzLm9wdGlvbnM7XHJcbiAgICAgIG9wdHMuY29udGVudF90YWcgPSB0aGlzLmNvbnRlbnRfZWxlbS50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgIGlmICghbnJvd3MpIHJldHVybjtcclxuICAgICAgaWYgKGllICYmIGllIDw9IDkgJiYgIW9wdHMudGFnKSB7XHJcbiAgICAgICAgb3B0cy50YWcgPSBmcm93KDApLm1hdGNoKC88KFtePlxccy9dKikvKVsxXS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICB9XHJcbiAgICAgIHZhciBuY2hpbGRyZW4gPSB0aGlzLmNvbnRlbnRfZWxlbS5jaGlsZHJlbi5sZW5ndGg7XHJcbiAgICAgIGlmICghb3B0cy50YWcpIHtcclxuICAgICAgICBvcHRzLnRhZyA9IHRoaXMuY29udGVudF9lbGVtLmNoaWxkcmVuWzBdLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAobmNoaWxkcmVuIDw9IDEpIHtcclxuICAgICAgICAvLyB3aGF0J3MgdGhlIHB1cnBvc2Ugb2YgdGhpcyA/Pz8gaXQgbWF5IGNsZWFyIHRoZSBodG1sIGNvbnRlbnQgLi4uXHJcbiAgICAgICAgY2FjaGUuZGF0YSA9IHRoaXMuaHRtbChmcm93KDApICsgZnJvdygwKSArIGZyb3coMCkpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuZ2V0Um93c0hlaWdodChucm93cyk7XHJcbiAgICB9LFxyXG4gICAgZ2V0Um93c0hlaWdodDogZnVuY3Rpb24gKG5yb3dzKSB7XHJcbiAgICAgIHZhciBvcHRzID0gdGhpcy5vcHRpb25zLFxyXG4gICAgICAgIHByZXZfaXRlbV9oZWlnaHQgPSBvcHRzLml0ZW1faGVpZ2h0O1xyXG4gICAgICBvcHRzLmNsdXN0ZXJfaGVpZ2h0ID0gMDtcclxuICAgICAgaWYgKCFucm93cykgcmV0dXJuO1xyXG4gICAgICB2YXIgbm9kZXMgPSB0aGlzLmNvbnRlbnRfZWxlbS5jaGlsZHJlbjtcclxuICAgICAgaWYgKCFub2Rlcy5sZW5ndGgpIHJldHVybjtcclxuICAgICAgdmFyIG5vZGUgPSBub2Rlc1tNYXRoLmZsb29yKG5vZGVzLmxlbmd0aCAvIDIpXTtcclxuICAgICAgb3B0cy5pdGVtX2hlaWdodCA9IG5vZGUub2Zmc2V0SGVpZ2h0O1xyXG4gICAgICAvLyBjb25zaWRlciB0YWJsZSdzIGJvcmRlci1zcGFjaW5nXHJcbiAgICAgIGlmIChvcHRzLnRhZyA9PSAndHInICYmIGdldFN0eWxlKCdib3JkZXJDb2xsYXBzZScsIHRoaXMuY29udGVudF9lbGVtKSAhPSAnY29sbGFwc2UnKVxyXG4gICAgICAgIG9wdHMuaXRlbV9oZWlnaHQgKz0gcGFyc2VJbnQoZ2V0U3R5bGUoJ2JvcmRlclNwYWNpbmcnLCB0aGlzLmNvbnRlbnRfZWxlbSksIDEwKSB8fCAwO1xyXG4gICAgICAvLyBjb25zaWRlciBtYXJnaW5zIChhbmQgbWFyZ2lucyBjb2xsYXBzaW5nKVxyXG4gICAgICBpZiAob3B0cy50YWcgIT0gJ3RyJykge1xyXG4gICAgICAgIHZhciBtYXJnaW5Ub3AgPSBwYXJzZUludChnZXRTdHlsZSgnbWFyZ2luVG9wJywgbm9kZSksIDEwKSB8fCAwO1xyXG4gICAgICAgIHZhciBtYXJnaW5Cb3R0b20gPSBwYXJzZUludChnZXRTdHlsZSgnbWFyZ2luQm90dG9tJywgbm9kZSksIDEwKSB8fCAwO1xyXG4gICAgICAgIG9wdHMuaXRlbV9oZWlnaHQgKz0gTWF0aC5tYXgobWFyZ2luVG9wLCBtYXJnaW5Cb3R0b20pO1xyXG4gICAgICB9XHJcbiAgICAgIG9wdHMuYmxvY2tfaGVpZ2h0ID0gb3B0cy5pdGVtX2hlaWdodCAqIG9wdHMucm93c19pbl9ibG9jaztcclxuICAgICAgb3B0cy5yb3dzX2luX2NsdXN0ZXIgPSBvcHRzLmJsb2Nrc19pbl9jbHVzdGVyICogb3B0cy5yb3dzX2luX2Jsb2NrO1xyXG4gICAgICBvcHRzLmNsdXN0ZXJfaGVpZ2h0ID0gb3B0cy5ibG9ja3NfaW5fY2x1c3RlciAqIG9wdHMuYmxvY2tfaGVpZ2h0O1xyXG4gICAgICByZXR1cm4gcHJldl9pdGVtX2hlaWdodCAhPSBvcHRzLml0ZW1faGVpZ2h0O1xyXG4gICAgfSxcclxuICAgIC8vIGdldCBjdXJyZW50IGNsdXN0ZXIgbnVtYmVyXHJcbiAgICBnZXRDbHVzdGVyTnVtOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxfdG9wID0gdGhpcy5zY3JvbGxfZWxlbS5zY3JvbGxUb3A7XHJcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKHRoaXMub3B0aW9ucy5zY3JvbGxfdG9wIC8gKHRoaXMub3B0aW9ucy5jbHVzdGVyX2hlaWdodCAtIHRoaXMub3B0aW9ucy5ibG9ja19oZWlnaHQpKSB8fCAwO1xyXG4gICAgfSxcclxuICAgIC8vIGdlbmVyYXRlIGVtcHR5IHJvdyBpZiBubyBkYXRhIHByb3ZpZGVkXHJcbiAgICBnZW5lcmF0ZUVtcHR5Um93OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBvcHRzID0gdGhpcy5vcHRpb25zO1xyXG4gICAgICBpZiAoIW9wdHMudGFnIHx8ICFvcHRzLnNob3dfbm9fZGF0YV9yb3cpIHJldHVybiBbXTtcclxuICAgICAgdmFyIGVtcHR5X3JvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQob3B0cy50YWcpLFxyXG4gICAgICAgIG5vX2RhdGFfY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG9wdHMubm9fZGF0YV90ZXh0KSwgdGQ7XHJcbiAgICAgIGVtcHR5X3Jvdy5jbGFzc05hbWUgPSBvcHRzLm5vX2RhdGFfY2xhc3M7XHJcbiAgICAgIGlmIChvcHRzLnRhZyA9PSAndHInKSB7XHJcbiAgICAgICAgdGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xyXG4gICAgICAgIC8vIGZpeGVzICM1M1xyXG4gICAgICAgIHRkLmNvbFNwYW4gPSAxMDA7XHJcbiAgICAgICAgdGQuYXBwZW5kQ2hpbGQobm9fZGF0YV9jb250ZW50KTtcclxuICAgICAgfVxyXG4gICAgICBlbXB0eV9yb3cuYXBwZW5kQ2hpbGQodGQgfHwgbm9fZGF0YV9jb250ZW50KTtcclxuICAgICAgcmV0dXJuIFtlbXB0eV9yb3cub3V0ZXJIVE1MXTtcclxuICAgIH0sXHJcbiAgICAvLyBnZW5lcmF0ZSBjbHVzdGVyIGZvciBjdXJyZW50IHNjcm9sbCBwb3NpdGlvblxyXG4gICAgZ2VuZXJhdGU6IGZ1bmN0aW9uIChmcm93LCBucm93cywgY2x1c3Rlcl9udW0pIHtcclxuICAgICAgdmFyIG9wdHMgPSB0aGlzLm9wdGlvbnM7XHJcbiAgICAgIC8qXHJcbiAgICAgIGlmIChucm93cyA8IG9wdHMucm93c19pbl9ibG9jaykge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0b3Bfb2Zmc2V0OiAwLFxyXG4gICAgICAgICAgYm90dG9tX29mZnNldDogMCxcclxuICAgICAgICAgIHJvd3NfYWJvdmU6IDAsXHJcbiAgICAgICAgICByb3dzOiBucm93cyA/IGZyb3cgOiB0aGlzLmdlbmVyYXRlRW1wdHlSb3dcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgKi9cclxuICAgICAgdmFyIGl0ZW1zX3N0YXJ0ID0gTWF0aC5tYXgoKG9wdHMucm93c19pbl9jbHVzdGVyIC0gb3B0cy5yb3dzX2luX2Jsb2NrKSAqIGNsdXN0ZXJfbnVtLCAwKSxcclxuICAgICAgICBpdGVtc19lbmQgPSBNYXRoLm1pbihpdGVtc19zdGFydCArIG9wdHMucm93c19pbl9jbHVzdGVyLCBucm93cyksXHJcbiAgICAgICAgdG9wX29mZnNldCA9IE1hdGgubWF4KGl0ZW1zX3N0YXJ0ICogb3B0cy5pdGVtX2hlaWdodCwgMCksXHJcbiAgICAgICAgYm90dG9tX29mZnNldCA9IE1hdGgubWF4KChucm93cyAtIGl0ZW1zX2VuZCkgKiBvcHRzLml0ZW1faGVpZ2h0LCAwKSxcclxuICAgICAgICB0aGlzX2NsdXN0ZXJfcm93cyA9IFtdLFxyXG4gICAgICAgIHJvd3NfYWJvdmUgPSBpdGVtc19zdGFydDtcclxuICAgICAgaWYgKHRvcF9vZmZzZXQgPCAxKSB7XHJcbiAgICAgICAgcm93c19hYm92ZSsrO1xyXG4gICAgICB9XHJcbiAgICAgIGZvciAodmFyIGkgPSBpdGVtc19zdGFydDsgaSA8IGl0ZW1zX2VuZDsgaSsrKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIHRoaXNfY2x1c3Rlcl9yb3dzLnB1c2goZnJvdyhpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgIHRoaXNfY2x1c3Rlcl9yb3dzLnB1c2godGhpcy5nZW5lcmF0ZUVtcHR5Um93KCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHRvcF9vZmZzZXQ6IHRvcF9vZmZzZXQsXHJcbiAgICAgICAgYm90dG9tX29mZnNldDogYm90dG9tX29mZnNldCxcclxuICAgICAgICByb3dzX2Fib3ZlOiByb3dzX2Fib3ZlLFxyXG4gICAgICAgIHJvd3M6IHRoaXNfY2x1c3Rlcl9yb3dzXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICByZW5kZXJFeHRyYVRhZzogZnVuY3Rpb24gKGNsYXNzX25hbWUsIGhlaWdodCkge1xyXG4gICAgICB2YXIgdGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLm9wdGlvbnMudGFnKSxcclxuICAgICAgICBjbHVzdGVyaXplX3ByZWZpeCA9ICdjbHVzdGVyaXplLSc7XHJcbiAgICAgIHRhZy5jbGFzc05hbWUgPSBbY2x1c3Rlcml6ZV9wcmVmaXggKyAnZXh0cmEtcm93JywgY2x1c3Rlcml6ZV9wcmVmaXggKyBjbGFzc19uYW1lXS5qb2luKCcgJyk7XHJcbiAgICAgIGhlaWdodCAmJiAodGFnLnN0eWxlLmhlaWdodCA9IGhlaWdodCArICdweCcpO1xyXG4gICAgICByZXR1cm4gdGFnLm91dGVySFRNTDtcclxuICAgIH0sXHJcbiAgICAvLyBpZiBuZWNlc3NhcnkgdmVyaWZ5IGRhdGEgY2hhbmdlZCBhbmQgaW5zZXJ0IHRvIERPTVxyXG4gICAgaW5zZXJ0VG9ET006IGZ1bmN0aW9uIChmcm93LCBucm93cywgY2FjaGUpIHtcclxuICAgICAgLy8gZXhwbG9yZSByb3cncyBoZWlnaHRcclxuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuY2x1c3Rlcl9oZWlnaHQpIHtcclxuICAgICAgICB0aGlzLmV4cGxvcmVFbnZpcm9ubWVudChmcm93LCBucm93cywgY2FjaGUpO1xyXG4gICAgICB9XHJcbiAgICAgIHZhciBkYXRhID0gdGhpcy5nZW5lcmF0ZShmcm93LCBucm93cywgdGhpcy5nZXRDbHVzdGVyTnVtKCkpLFxyXG4gICAgICAgIHRoaXNfY2x1c3Rlcl9yb3dzID0gZGF0YS5yb3dzLmpvaW4oJycpLFxyXG4gICAgICAgIHRoaXNfY2x1c3Rlcl9jb250ZW50X2NoYW5nZWQgPSB0aGlzLmNoZWNrQ2hhbmdlcygnZGF0YScsIHRoaXNfY2x1c3Rlcl9yb3dzLCBjYWNoZSksXHJcbiAgICAgICAgdG9wX29mZnNldF9jaGFuZ2VkID0gdGhpcy5jaGVja0NoYW5nZXMoJ3RvcCcsIGRhdGEudG9wX29mZnNldCwgY2FjaGUpLFxyXG4gICAgICAgIG9ubHlfYm90dG9tX29mZnNldF9jaGFuZ2VkID0gdGhpcy5jaGVja0NoYW5nZXMoJ2JvdHRvbScsIGRhdGEuYm90dG9tX29mZnNldCwgY2FjaGUpLFxyXG4gICAgICAgIGNhbGxiYWNrcyA9IHRoaXMub3B0aW9ucy5jYWxsYmFja3MsXHJcbiAgICAgICAgbGF5b3V0ID0gW107XHJcblxyXG4gICAgICBpZiAodGhpc19jbHVzdGVyX2NvbnRlbnRfY2hhbmdlZCB8fCB0b3Bfb2Zmc2V0X2NoYW5nZWQpIHtcclxuICAgICAgICBpZiAoZGF0YS50b3Bfb2Zmc2V0KSB7XHJcbiAgICAgICAgICB0aGlzLm9wdGlvbnMua2VlcF9wYXJpdHkgJiYgbGF5b3V0LnB1c2godGhpcy5yZW5kZXJFeHRyYVRhZygna2VlcC1wYXJpdHknKSk7XHJcbiAgICAgICAgICBsYXlvdXQucHVzaCh0aGlzLnJlbmRlckV4dHJhVGFnKCd0b3Atc3BhY2UnLCBkYXRhLnRvcF9vZmZzZXQpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGF5b3V0LnB1c2godGhpc19jbHVzdGVyX3Jvd3MpO1xyXG4gICAgICAgIGRhdGEuYm90dG9tX29mZnNldCAmJiBsYXlvdXQucHVzaCh0aGlzLnJlbmRlckV4dHJhVGFnKCdib3R0b20tc3BhY2UnLCBkYXRhLmJvdHRvbV9vZmZzZXQpKTtcclxuICAgICAgICBjYWxsYmFja3MuY2x1c3RlcldpbGxDaGFuZ2UgJiYgY2FsbGJhY2tzLmNsdXN0ZXJXaWxsQ2hhbmdlKCk7XHJcbiAgICAgICAgdGhpcy5odG1sKGxheW91dC5qb2luKCcnKSk7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmNvbnRlbnRfdGFnID09ICdvbCcgJiYgdGhpcy5jb250ZW50X2VsZW0uc2V0QXR0cmlidXRlKCdzdGFydCcsIGRhdGEucm93c19hYm92ZSk7XHJcbiAgICAgICAgdGhpcy5jb250ZW50X2VsZW0uc3R5bGVbJ2NvdW50ZXItaW5jcmVtZW50J10gPSAnY2x1c3Rlcml6ZS1jb3VudGVyICcgKyAoZGF0YS5yb3dzX2Fib3ZlIC0gMSk7XHJcbiAgICAgICAgY2FsbGJhY2tzLmNsdXN0ZXJDaGFuZ2VkICYmIGNhbGxiYWNrcy5jbHVzdGVyQ2hhbmdlZCgpO1xyXG4gICAgICB9IGVsc2UgaWYgKG9ubHlfYm90dG9tX29mZnNldF9jaGFuZ2VkKSB7XHJcbiAgICAgICAgdGhpcy5jb250ZW50X2VsZW0ubGFzdENoaWxkLnN0eWxlLmhlaWdodCA9IGRhdGEuYm90dG9tX29mZnNldCArICdweCc7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyB1bmZvcnR1bmF0ZWx5IGllIDw9IDkgZG9lcyBub3QgYWxsb3cgdG8gdXNlIGlubmVySFRNTCBmb3IgdGFibGUgZWxlbWVudHMsIHNvIG1ha2UgYSB3b3JrYXJvdW5kXHJcbiAgICBodG1sOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICB2YXIgY29udGVudF9lbGVtID0gdGhpcy5jb250ZW50X2VsZW07XHJcbiAgICAgIGlmIChpZSAmJiBpZSA8PSA5ICYmIHRoaXMub3B0aW9ucy50YWcgPT0gJ3RyJykge1xyXG4gICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSwgbGFzdDtcclxuICAgICAgICBkaXYuaW5uZXJIVE1MID0gJzx0YWJsZT48dGJvZHk+JyArIGRhdGEgKyAnPC90Ym9keT48L3RhYmxlPic7XHJcbiAgICAgICAgd2hpbGUgKChsYXN0ID0gY29udGVudF9lbGVtLmxhc3RDaGlsZCkpIHtcclxuICAgICAgICAgIGNvbnRlbnRfZWxlbS5yZW1vdmVDaGlsZChsYXN0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJvd3Nfbm9kZXMgPSB0aGlzLmdldENoaWxkTm9kZXMoZGl2LmZpcnN0Q2hpbGQuZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgd2hpbGUgKHJvd3Nfbm9kZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICBjb250ZW50X2VsZW0uYXBwZW5kQ2hpbGQocm93c19ub2Rlcy5zaGlmdCgpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29udGVudF9lbGVtLmlubmVySFRNTCA9IGRhdGE7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBnZXRDaGlsZE5vZGVzOiBmdW5jdGlvbiAodGFnKSB7XHJcbiAgICAgIHZhciBjaGlsZF9ub2RlcyA9IHRhZy5jaGlsZHJlbiwgbm9kZXMgPSBbXTtcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gY2hpbGRfbm9kZXMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xyXG4gICAgICAgIG5vZGVzLnB1c2goY2hpbGRfbm9kZXNbaV0pO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBub2RlcztcclxuICAgIH0sXHJcbiAgICBjaGVja0NoYW5nZXM6IGZ1bmN0aW9uICh0eXBlLCB2YWx1ZSwgY2FjaGUpIHtcclxuICAgICAgdmFyIGNoYW5nZWQgPSB2YWx1ZSAhPSBjYWNoZVt0eXBlXTtcclxuICAgICAgY2FjaGVbdHlwZV0gPSB2YWx1ZTtcclxuICAgICAgcmV0dXJuIGNoYW5nZWQ7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuLy8gc3VwcG9ydCBmdW5jdGlvbnNcclxuICBmdW5jdGlvbiBvbihldnQsIGVsZW1lbnQsIGZuYykge1xyXG4gICAgcmV0dXJuIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciA/IGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldnQsIGZuYywgZmFsc2UpIDogZWxlbWVudC5hdHRhY2hFdmVudChcIm9uXCIgKyBldnQsIGZuYyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvZmYoZXZ0LCBlbGVtZW50LCBmbmMpIHtcclxuICAgIHJldHVybiBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIgPyBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZ0LCBmbmMsIGZhbHNlKSA6IGVsZW1lbnQuZGV0YWNoRXZlbnQoXCJvblwiICsgZXZ0LCBmbmMpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaXNBcnJheShhcnIpIHtcclxuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJyKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGlzRnVuY3Rpb24oZm5jKSB7XHJcbiAgICAvL2h0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS83MzU2NTI4LzEzOTU5NzNcclxuICAgIHJldHVybiBmbmMgJiYge30udG9TdHJpbmcuY2FsbChmbmMpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2V0U3R5bGUocHJvcCwgZWxlbSkge1xyXG4gICAgcmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlID8gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbSlbcHJvcF0gOiBlbGVtLmN1cnJlbnRTdHlsZVtwcm9wXTtcclxuICB9XHJcblxyXG4gIHJldHVybiBDbHVzdGVyaXplO1xyXG59KSlcclxuOyIsIi8qXHJcbnJldXNhYmxlIEQzLmpzIGNsYXNzIGZvciAoTEFSR0UpIHRhYmxlc1xyXG4qIGVmZmljaWVudCB3aXRoIGxhcmdlIGRhdGEgdGhhbmtzIHRvIGh0dHBzOi8vY2x1c3Rlcml6ZS5qcy5vcmcvXHJcbiogZmlsdGVyYWJsZSB0aGFua3MgdG8gRDNcclxuKiBzb3J0YWJsZSB0aGFua3MgdG8gaHR0cDovL2JsLm9ja3Mub3JnL0FNRFMvNGE2MTQ5NzE4MmI4ZmNiMDU5MDZcclxuKiBhbmQgaHR0cHM6Ly93d3cua3J5b2dlbml4Lm9yZy9jb2RlL2Jyb3dzZXIvc29ydHRhYmxlLylcclxuXHJcbkBhdXRob3IgIFBoaWxpcHBlIEd1Z2xpZWxtZXR0aSBodHRwczovL2dpdGh1Yi5jb20vZ291bHUvXHJcbiAqL1xyXG5cclxuaW1wb3J0ICogYXMgQ2x1c3Rlcml6ZSBmcm9tICcuL2NsdXN0ZXJpemUuanMnXHJcbmltcG9ydCAqIGFzIGQzIGZyb20gJ2QzJ1xyXG5cclxuZXhwb3J0IGNsYXNzIFRhYmxlIGV4dGVuZHMgQ2x1c3Rlcml6ZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgaGVpZ2h0ID0gNDAwKSB7XHJcbiAgICAgICAgLyogYnVpbGQgRE9NIHN0cnVjdHVyZSBsaWtlIHRoaXM6XHJcbiAgICAgICAgICAgIDx0YWJsZT5cclxuICAgICAgICAgICAgICAgIDx0aGVhZD5cclxuICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgICA8dGg+SGVhZGVyczwvdGg+XHJcbiAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgPC90aGVhZD5cclxuICAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICAgICAgPGRpdiBpZD1cInNjcm9sbEFyZWFcIiBjbGFzcz1cImNsdXN0ZXJpemUtc2Nyb2xsXCI+XHJcbiAgICAgICAgICAgICAgICA8dGFibGU+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRib2R5IGlkPVwiY29udGVudEFyZWFcIiBjbGFzcz1cImNsdXN0ZXJpemUtY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ciBjbGFzcz1cImNsdXN0ZXJpemUtbm8tZGF0YVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+TG9hZGluZyBkYXRh4oCmPC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XHJcbiAgICAgICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodHlwZW9mKGVsZW1lbnQpPT0nc3RyaW5nJykge1xyXG4gICAgICAgICAgICBlbGVtZW50PWQzLnNlbGVjdChlbGVtZW50KSBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB0aGVhZCA9IGVsZW1lbnQuYXBwZW5kKFwidGFibGVcIikuYXBwZW5kKFwidGhlYWRcIik7XHJcbiAgICAgICAgdGhlYWQuaW5zZXJ0KFwidGhcIikuYXBwZW5kKFwidHJcIikudGV4dChcIkhlYWRlcnNcIik7XHJcblxyXG4gICAgICAgIGxldCBzY3JvbGwgPSBlbGVtZW50LmFwcGVuZChcImRpdlwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIHVuaXF1ZUlkKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJtYXgtaGVpZ2h0XCIsIGhlaWdodCArICdweCcpXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKFwiY2x1c3Rlcml6ZS1zY3JvbGxcIiwgdHJ1ZSlcclxuICAgICAgICAgICAgLm9uKCdzY3JvbGwnLCAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHByZXZTY3JvbGxMZWZ0ID0gMDtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNjcm9sbExlZnQgPSB0aGlzLnNjcm9sbExlZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2Nyb2xsTGVmdCA9PSBwcmV2U2Nyb2xsTGVmdCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXZTY3JvbGxMZWZ0ID0gc2Nyb2xsTGVmdDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRoZWFkLnN0eWxlKCdtYXJnaW4tbGVmdCcsIC1zY3JvbGxMZWZ0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgbGV0IHJvd3MgPSBzY3JvbGwuYXBwZW5kKFwidGFibGVcIikuYXBwZW5kKFwidGJvZHlcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCB1bmlxdWVJZClcclxuICAgICAgICAgICAgLmNsYXNzZWQoXCJjbHVzdGVyaXplLWNvbnRlbnRcIiwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIHN1cGVyKHtcclxuICAgICAgICAgICAgLy8gcm93czogW10sIC8vIGRvIG5vdCBzcGVjaWZ5IGl0IGhlcmVcclxuICAgICAgICAgICAgc2Nyb2xsSWQ6IHNjcm9sbC5hdHRyKFwiaWRcIiksXHJcbiAgICAgICAgICAgIGNvbnRlbnRJZDogcm93cy5hdHRyKFwiaWRcIiksXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy50aGVhZCA9IHRoZWFkO1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsID0gc2Nyb2xsO1xyXG4gICAgICAgIHRoaXMucm93cyA9IGVsZW1lbnQuc2VsZWN0KFwidGJvZHlcIik7XHJcblxyXG4gICAgICAgIHRoaXMuZm9ybWF0KGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2O1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5yb3dpZChmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICAvLyBieSBkZWZhdWx0LCByb3dpZCBpcyByb3cgbnVtYmVyIGluIGRhdGFcclxuICAgICAgICAgICAgLy8gbm90IGJhZCwgYnV0IGRvZW5zJ3Qgc3Vydml2ZSBhIHRhYmxlLnNvcnQgLi4uXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEoKS5pbmRleE9mKGQpXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmNhbGxiYWNrcyA9IHtcclxuICAgICAgICAgICAgY2x1c3RlckNoYW5nZWQ6IHRoaXMucmVzaXplLmJpbmQodGhpcylcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB0aGlzLnJlc2l6ZS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgbGV0IHRyID0gcm93cy5hcHBlbmQoXCJ0clwiKS5jbGFzc2VkKFwiY2x1c3Rlcml6ZS1uby1kYXRhXCIsIHRydWUpO1xyXG4gICAgICAgIHRyLmFwcGVuZChcInRkXCIpLnRleHQoXCJMb2FkaW5nIGRhdGEuLi5cIik7XHJcblxyXG4gICAgICAgIHRoaXMuX19kYXRhX18gPSBbXTsgLy8gZG9uJ3QgY2FsbCBkYXRhKCkgc2luY2UgaXQgd291bGQgY2xlYXIgYW55IGV4aXN0aW5nIERPTSB0YWJsZVxyXG5cclxuICAgICAgICB0aGlzLl9maWx0ZXIgPSBmdW5jdGlvbiAoZCwgaSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkID0gbmV3IFNldChbXSk7XHJcbiAgICAgICAgdGhpcy5zb3J0QXNjZW5kaW5nID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBmb3JtYXQoZikge1xyXG4gICAgICAgIHRoaXMuX2Zvcm1hdCA9IGY7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY29uZmlnXHJcblxyXG4gICAgaGVhZGVyKGNvbHMpIHtcclxuICAgICAgICBsZXQgdGFibGUgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuY29sdW1ucyA9IGNvbHM7XHJcbiAgICAgICAgdGhpcy50aGVhZC5zZWxlY3RBbGwoXCJ0aFwiKVxyXG4gICAgICAgICAgICAucmVtb3ZlKCk7XHJcbiAgICAgICAgdGhpcy50aGVhZC5zZWxlY3RBbGwoXCJ0aFwiKVxyXG4gICAgICAgICAgICAuZGF0YSh0aGlzLmNvbHVtbnMpXHJcbiAgICAgICAgICAgIC5lbnRlcigpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoXCJ0aFwiKVxyXG4gICAgICAgICAgICAudGV4dChmdW5jdGlvbiAoY29sdW1uKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29sdW1uO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24gKGQsIGkpIHtcclxuICAgICAgICAgICAgICAgIHRhYmxlLnNvcnQoaSwgdGFibGUuc29ydEFzY2VuZGluZyk7XHJcbiAgICAgICAgICAgICAgICB0YWJsZS5zb3J0QXNjZW5kaW5nID0gIXRhYmxlLnNvcnRBc2NlbmRpbmc7IC8vIGZvciB0aGUgbmV4dCB0aW1lXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzOyAvLyBmb3IgY2hhaW5pbmdcclxuICAgIH1cclxuXHJcbiAgICBzb3J0KGksIGFzY2VuZGluZyA9IHRydWUsIHN0YWJsZSA9IGZhbHNlKSB7XHJcbiAgICAgICAgLy8gc29ydCBkYXRhIGJ5IGktdGggY29sdW1uLCBhc2NlbmRpbmcgb3IgZGVzY2VuZGluZ1xyXG4gICAgICAgIC8vIG9wdGlvbmFsbHkgd2l0aCBzdGFibGUgc29ydCBhbGdvIChzbG93ZXIuLi4pXHJcbiAgICAgICAgbGV0IHRoID0gdGhpcy50aGVhZC5zZWxlY3RBbGwoJ3RoJyk7XHJcbiAgICAgICAgdGguY2xhc3NlZCgnYWVzJywgZmFsc2UpLmNsYXNzZWQoJ2RlcycsIGZhbHNlKTtcclxuICAgICAgICBkMy5zZWxlY3QodGhbMF1baV0pLmNsYXNzZWQoJ2FlcycsICFhc2NlbmRpbmcpLmNsYXNzZWQoJ2RlcycsIGFzY2VuZGluZyk7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB0aGlzLmRhdGEoKTtcclxuICAgICAgICBpZiAoZGF0YS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpczsgLy8gZm9yIGNoYWluaW5nXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWlzQXJyYXkoZGF0YVswXSkpIHsgLy8gcm93cyBhcmUgZGljdHNcclxuICAgICAgICAgICAgaSA9IHRoaXMuY29sdW1uc1tpXTsgLy8gaW5kZXggYnkgZmllbGRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBpYyA9IG5ldyBJbnRsLkNvbGxhdG9yKCdlbicsIHsgJ3NlbnNpdGl2aXR5JzogJ2Jhc2UnIH0pO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBmKHgsIHkpIHtcclxuICAgICAgICAgICAgLy8gdW5pdmVyc2FsICg/KSBjb21wYXJpc29uXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB4ID0geFtpXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICB4ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB5ID0geVtpXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICB5ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoeCA9PT0geSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB4ID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGljLmNvbXBhcmUoeCwgeSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHQgPT09ICdudW1iZXInKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geCAtIHk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geCA+IHkgPyAxIDogLTFcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFhc2NlbmRpbmcpIHtcclxuICAgICAgICAgICAgbGV0IGZmID0gZjtcclxuICAgICAgICAgICAgZiA9IGZ1bmN0aW9uICh4LCB5KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmYoeSwgeCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHBlcmZvcm1hbmNlID0gd2luZG93LnBlcmZvcm1hbmNlLFxyXG4gICAgICAgICAgICB0MCA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICAgIGlmIChzdGFibGUpIHtcclxuICAgICAgICAgICAgc2hha2VyX3NvcnQoZGF0YSwgZik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZGF0YS5zb3J0KGYpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgICAgICBsZXQgZHQgPSBNYXRoLnJvdW5kKHBlcmZvcm1hbmNlLm5vdygpIC0gdDApXHJcbiAgICAgICAgaWYgKGR0ID4gMTAwMCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInRhYmxlLnNvcnQgdG9vayBcIiArIGR0ICsgXCIgbWlsbGlzZWNvbmRzLlwiKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpczsgLy8gZm9yIGNoYWluaW5nXHJcbiAgICB9XHJcblxyXG4gICAgcm93QXNBcnJheShyb3cpIHtcclxuICAgICAgICAvLyByZXR1cm4gcm93IGFzIHRoZSBhcnJheSBvZiB2aXNpYmxlIGNlbGxzXHJcbiAgICAgICAgaWYgKCFpc0FycmF5KHJvdykpIHsgLy8gc3VwcG9zZSBpdCdzIGEgZGljdFxyXG4gICAgICAgICAgICByb3cgPSB0aGlzLmNvbHVtbnMubWFwKGZ1bmN0aW9uIChkLCBpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcm93W2RdXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByb3c7XHJcbiAgICB9XHJcblxyXG4gICAgcm93QXNTdHJpbmcoZCwgc2VwID0gJ1xcdTMwMDAnKSB7XHJcbiAgICAgICAgLy8gc2VwIGlzIGEgdmVyeSB1bmxpa2VseSBjaGFyIHRvIG1pbmltaXplIHRoZSByaXNrIG9mIHdyb25nIHBvc2l0aXZlIHdoZW4gc2VhcmNoaW5nXHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm93QXNBcnJheShkKS5tYXAodGhpcy5fZm9ybWF0KS5qb2luKHNlcCk7XHJcbiAgICB9XHJcblxyXG4gICAgZmluZEluUm93KGQsIHdoYXQpIHtcclxuICAgICAgICAvLyB3aGF0IG11c3QgYmUgaW4gbG93ZXJjYXNlIGZvclxyXG4gICAgICAgIHJldHVybiB0aGlzLnJvd0FzU3RyaW5nKGQpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih3aGF0KVxyXG4gICAgfVxyXG5cclxuICAgIGZpbHRlcihmKSB7XHJcbiAgICAgICAgaWYgKGlzRnVuY3Rpb24oZikpIHtcclxuICAgICAgICAgICAgdGhpcy5fZmlsdGVyID0gZjtcclxuICAgICAgICAgICAgdGhpcy5kcmF3KCk7IC8vIGFwcGx5IGZpbHRlclxyXG4gICAgICAgICAgICByZXR1cm4gdGhpczsgLy8gZm9yIGNoYWluaW5nXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGFzc3VtZSBmIGlzIGEgc2VsZWN0aW9uIG9mIGFuIGlucHV0IGZpZWxkXHJcbiAgICAgICAgbGV0IHRhYmxlID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5maWx0ZXIoZnVuY3Rpb24gKGQsIGkpIHtcclxuICAgICAgICAgICAgLy8gaGVyZSwgdGhpcyBpcyB0aGUgaW5wdXQgZmllbGQsIHdoaWNoIGlzIC5ib3VuZFxyXG4gICAgICAgICAgICBsZXQgcyA9IHRoaXMucHJvcGVydHkoXCJ2YWx1ZVwiKTsgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzMxMzY5NzU5LzEzOTU5NzNcclxuICAgICAgICAgICAgaWYgKHMgPT09ICcnKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRhYmxlLmZpbmRJblJvdyhkLCBzLnRvTG93ZXJDYXNlKCkpICE9PSAtMVxyXG4gICAgICAgIH0uYmluZChmKSkgLy8gYmluZCB0byB0aGUgaW5wdXQgZmllbGRcclxuXHJcbiAgICAgICAgZi5vbihcImlucHV0XCIsIGZ1bmN0aW9uICgpIHsgLy8gc2V0IHRoZSB1cGRhdGUgZXZlbnQgb2YgdGhlIGlucHV0IGZpZWxkXHJcbiAgICAgICAgICAgIHRhYmxlLmRyYXcoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpczsgLy8gZm9yIGNoYWluaW5nXHJcbiAgICB9XHJcblxyXG4gICAgcm93aWQoZCkge1xyXG4gICAgICAgIC8vIHJldHVybnMgYSB1bmlxdWUgaWQgb2Ygcm93IGFzc29jaWF0ZWQgdG8gZGF0YSBkXHJcbiAgICAgICAgaWYgKGlzRnVuY3Rpb24oZCkpIHtcclxuICAgICAgICAgICAgdGhpcy5fcm93aWQgPSBkO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpczsgLy8gZm9yIGNoYWluaW5nXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fcm93aWQoZClcclxuICAgIH1cclxuXHJcbiAgICBvbihlLCBmKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmNhbGxiYWNrc1tlXSA9IGYuYmluZCh0aGlzKTtcclxuICAgICAgICByZXR1cm4gdGhpczsgLy8gZm9yIGNoYWluaW5nXHJcbiAgICB9XHJcblxyXG4gICAgLy8gcnVuXHJcbiAgICBkYXRhKGQpIHtcclxuICAgICAgICBpZiAoZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9fZGF0YV9fO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9fZGF0YV9fID0gZDtcclxuICAgICAgICByZXR1cm4gdGhpcy5kcmF3KCk7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhdygpIHtcclxuICAgICAgICBsZXQgdGFibGUgPSB0aGlzO1xyXG4gICAgICAgIGxldCBkID0gdGhpcy5kYXRhKCk7XHJcbiAgICAgICAgaWYgKGQubGVuZ3RoID09PSAwKSByZXR1cm4gdGFibGU7XHJcbiAgICAgICAgZCA9IGQuZmlsdGVyKHRhYmxlLl9maWx0ZXIpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKGZ1bmN0aW9uIChpKSB7XHJcbiAgICAgICAgICAgIGxldCByb3cgPSB0YWJsZS5yb3dBc0FycmF5KGRbaV0pO1xyXG4gICAgICAgICAgICByZXR1cm4gJzx0ciAnXHJcbiAgICAgICAgICAgICAgICArICdpZD1cInInICsgdGFibGUucm93aWQoZFtpXSkgKyAnXCIgJyAvLyB3YXkgdG8gZmluZCB0aGUgZGF0YSBiYWNrIGZvciBzZWxlY3Rpb24uIGlkIG11c3Qgc3RhcnQgd2l0aCBub24gbnVtZXJpY1xyXG4gICAgICAgICAgICAgICAgKyAoKGkgaW4gdGFibGUuX3NlbGVjdGVkKVxyXG4gICAgICAgICAgICAgICAgICAgID8gJ2NsYXNzPVwiaGlnaGxpZ2h0XCInXHJcbiAgICAgICAgICAgICAgICAgICAgOiAnJykgIC8vIG5vIGhhbmRpZXIgd2F5IHRvIHNlbGVjdCBhIGhpZGRlbiByb3cgLi4uXHJcbiAgICAgICAgICAgICAgICArICc+J1xyXG4gICAgICAgICAgICAgICAgKyByb3cubWFwKGZ1bmN0aW9uIChjZWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICc8dGQ+JyArIChjZWxsID09PSB1bmRlZmluZWQgPyAnJyA6IHRhYmxlLl9mb3JtYXQoY2VsbCkpICsgJzwvdGQ+JztcclxuICAgICAgICAgICAgICAgIH0pLmpvaW4oJycpXHJcbiAgICAgICAgICAgICAgICArICc8L3RyPidcclxuICAgICAgICB9XHJcbiAgICAgICAgICAgICxcclxuICAgICAgICAgICAgZC5sZW5ndGhcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0YWJsZS5yZXNpemUoKTsgLy8gcmVkcmF3XHJcbiAgICAgICAgcmV0dXJuIHRhYmxlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGV2ZW50c1xyXG5cclxuICAgIHJlc2l6ZSgpIHtcclxuICAgICAgICBsZXQgdGFibGUgPSB0aGlzO1xyXG4gICAgICAgIC8vIE1ha2VzIGhlYWRlciBjb2x1bW5zIGVxdWFsIHdpZHRoIHRvIGNvbnRlbnQgY29sdW1uc1xyXG4gICAgICAgIGxldCBzY3JvbGxCYXJXaWR0aCA9IHdpZHRoKHRoaXMuZWxlbWVudClbMF0gLSB3aWR0aCh0aGlzLnJvd3MpWzBdLFxyXG4gICAgICAgICAgICB0ZCA9IHRoaXMucm93cy5zZWxlY3QoJ3RyOm5vdCguY2x1c3Rlcml6ZS1leHRyYS1yb3cpJykuc2VsZWN0QWxsKCd0ZCcpLFxyXG4gICAgICAgICAgICB3ID0gd2lkdGgodGQpO1xyXG4gICAgICAgIHdbdy5sZW5ndGggLSAxXSArPSBzY3JvbGxCYXJXaWR0aDtcclxuICAgICAgICB3aWR0aCh0aGlzLnRoZWFkLnNlbGVjdEFsbCgndGgnKSwgdyk7XHJcblxyXG4gICAgICAgIC8vIChyZSlhdHRhY2ggZXZlbnRzIHRvIHJvd3NcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZmV2ZW50KCkge1xyXG4gICAgICAgICAgICBsZXQgZSA9IGQzLmV2ZW50O1xyXG4gICAgICAgICAgICBpZiAoZS50eXBlIGluIHRhYmxlLm9wdGlvbnMuY2FsbGJhY2tzKSB7IC8vIGhhbmRsZSBpdFxyXG4gICAgICAgICAgICAgICAgbGV0IHRhcmdldCA9IGUudGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldC50YWdOYW1lID09ICdURCcpIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50RWxlbWVudDsgLy8gZXZlbnRzIGFyZSBvbiByb3dzIChmb3Igbm93KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gcmV0cmlldmUgdGhlIGRhdGEgKFRPRE86IHRoZXJlIHNob3VsZCBiZSBhIHF1aWNrZXIgd2F5Li4uKVxyXG4gICAgICAgICAgICAgICAgbGV0IGkgPSB0YXJnZXQuaWQuc3Vic3RyKDEpLCAgLy9nZXQgdHIgI2lkXHJcbiAgICAgICAgICAgICAgICAgICAgZCA9IHRhYmxlLmRhdGEoKS5maW5kKGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0YWJsZS5yb3dpZChkKSA9PSBpXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFibGUub3B0aW9ucy5jYWxsYmFja3NbZS50eXBlXShkLCBpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yb3dzLnNlbGVjdEFsbChcInRyXCIpXHJcbiAgICAgICAgICAgIC5vbihcIm1vdXNlb3ZlclwiLCBmZXZlbnQpXHJcbiAgICAgICAgICAgIC5vbihcIm1vdXNlbGVhdmVcIiwgZmV2ZW50KVxyXG4gICAgICAgICAgICAub24oXCJjbGlja1wiLCBmZXZlbnQpXHJcbiAgICAgICAgICAgIC5vbihcImRibGNsaWNrXCIsIGZldmVudClcclxuICAgICAgICAgICAgLmNsYXNzZWQoXCJoaWdobGlnaHRcIiwgZnVuY3Rpb24gKGQsIGkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0YWJsZS5fc2VsZWN0ZWQuaGFzKGkpO1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICByZXR1cm4gdGFibGU7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkKG5ld2RhdGEsIGkgPSAtMSkge1xyXG4gICAgICAgIC8vIG1lcmdlIGFuZCBzb3J0IGRhdGEgd2l0aCBjdXJyZW50XHJcbiAgICAgICAgLy8gZG9uJ3QgcmVuYW1lIGl0IFwiYXBwZW5kXCIgdG8gYXZvaWQgY29uZmxpY3RzIHdpdGggQ2x1c3Rlcml6ZSBhbmQvb3IgRDNcclxuICAgICAgICB0aGlzLl9fZGF0YV9fID0gdGhpcy5kYXRhKCkuY29uY2F0KG5ld2RhdGEpO1xyXG4gICAgICAgIGlmIChpID49IDApIHtcclxuICAgICAgICAgICAgdGhpcy5zb3J0KGkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhdygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHNjcm9sbFRvKGQsIG1zID0gMTAwMCkge1xyXG4gICAgICAgIC8vIHNtb290aCBzY3JvbGwgdG8gZGF0YSBkIGluIG1zIG1pbGxpc2Vjb25kc1xyXG4gICAgICAgIGxldCB0YWJsZSA9IHRoaXMsXHJcbiAgICAgICAgICAgIGxlbmd0aCA9IHRoaXMuZGF0YSgpLmZpbHRlcih0aGlzLl9maWx0ZXIpLmxlbmd0aCxcclxuICAgICAgICAgICAgbm9kZSA9IHRoaXMuc2Nyb2xsLm5vZGUoKSxcclxuICAgICAgICAgICAgZiA9IG5vZGUuc2Nyb2xsSGVpZ2h0IC8gbGVuZ3RoLFxyXG4gICAgICAgICAgICBubGluZXMgPSBub2RlLmNsaWVudEhlaWdodCAvIGYsXHJcbiAgICAgICAgICAgIGxpbmUgPSB0aGlzLmZpbmRJbmRleChkKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2Nyb2xsVHdlZW4ob2Zmc2V0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaSA9IGQzLmludGVycG9sYXRlTnVtYmVyKG5vZGUuc2Nyb2xsVG9wLCBvZmZzZXQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5zY3JvbGxUb3AgPSBpKHQpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucm93cy50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgLmR1cmF0aW9uKG1zKVxyXG4gICAgICAgICAgICAuZWFjaChcImVuZFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0YWJsZS5zZWxlY3QoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICAgIC50d2VlbihcInNjcm9sbFwiLCBzY3JvbGxUd2VlbihcclxuICAgICAgICAgICAgICAgIChsaW5lIC0gTWF0aC5yb3VuZChubGluZXMgLyAyKSkgKiBmXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICA7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7IC8vIGZvciBjaGFpbmluZ1xyXG4gICAgfVxyXG5cclxuICAgIGluZGV4T2YoZCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEoKS5maWx0ZXIodGhpcy5fZmlsdGVyKS5pbmRleE9mKGQpO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmQoZCkge1xyXG4gICAgICAgIGxldCB0YWJsZSA9IHRoaXMsXHJcbiAgICAgICAgICAgIGlkID0gdGFibGUucm93aWQoZCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YSgpLmZpbHRlcih0aGlzLl9maWx0ZXIpLmZpbmQoXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFibGUucm93aWQoZSkgPT09IGlkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG4gICAgZmluZEluZGV4KGQpIHtcclxuICAgICAgICBsZXQgdGFibGUgPSB0aGlzLFxyXG4gICAgICAgICAgICBpZCA9IHRhYmxlLnJvd2lkKGQpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEoKS5maWx0ZXIodGhpcy5fZmlsdGVyKS5maW5kSW5kZXgoXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFibGUucm93aWQoZSkgPT09IGlkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBzZWxlY3QoZCwgaSkge1xyXG4gICAgICAgIGxldCB0YWJsZSA9IHRoaXM7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhpZ2hsaWdodChpKSB7XHJcbiAgICAgICAgICAgIHRhYmxlLl9zZWxlY3RlZC5hZGQoaSk7XHJcbiAgICAgICAgICAgIGxldCB0ciA9IHRhYmxlLnJvd3Muc2VsZWN0KFwiI3JcIiArIGkpO1xyXG4gICAgICAgICAgICB0ci5jbGFzc2VkKFwiaGlnaGxpZ2h0XCIsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGkgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpZiAoZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZC5mb3JFYWNoKGhpZ2hsaWdodCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGkgPSB0aGlzLnJvd2lkKGQpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBoaWdobGlnaHQoaSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzOyAvLyBmb3IgY2hhaW5pbmdcclxuICAgIH1cclxuXHJcbiAgICBkZXNlbGVjdChkLCBpKSB7XHJcbiAgICAgICAgaWYgKGkgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpZiAoZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZC5jbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGkgPSB0aGlzLnJvd2lkKGQpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkLmRlbGV0ZShpKTtcclxuICAgICAgICBsZXQgdHIgPSB0aGlzLnJvd3Muc2VsZWN0KFwiI3JcIiArIGkpO1xyXG4gICAgICAgIHRyLmNsYXNzZWQoXCJoaWdobGlnaHRcIiwgZmFsc2UpO1xyXG4gICAgICAgIHJldHVybiB0aGlzOyAvLyBmb3IgY2hhaW5pbmdcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vIGZpcnN0IGFuZCBsYXN0IG9mIGEgc2VsZWN0aW9uXHJcbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNTQxMzUzNC8xMzk1OTczXHJcbmQzXHJcbiAgICAuc2VsZWN0aW9uXHJcbiAgICAucHJvdG90eXBlXHJcbiAgICAuZmlyc3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIGQzLnNlbGVjdCh0aGlzWzBdWzBdKTtcclxuICAgIH07XHJcbmQzXHJcbiAgICAuc2VsZWN0aW9uXHJcbiAgICAucHJvdG90eXBlXHJcbiAgICAubGFzdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbGFzdCA9IHRoaXMuc2l6ZSgpIC0gMTtcclxuICAgICAgICByZXR1cm4gZDMuc2VsZWN0KHRoaXNbMF1bbGFzdF0pO1xyXG4gICAgfTtcclxuXHJcbi8vIHV0aWxpdHkgZnVuY3Rpb25zXHJcblxyXG5mdW5jdGlvbiB3aWR0aChzZWwsIHZhbHVlKSB7XHJcbiAgICAvLyBtaW1pY3MgalF1ZXJ5IGZvciBEMyBodHRwczovL2FwaS5qcXVlcnkuY29tL2NhdGVnb3J5L2RpbWVuc2lvbnMvXHJcbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkgeyAvLyBnZXRcclxuICAgICAgICBsZXQgdyA9IFtdO1xyXG4gICAgICAgIHNlbC5lYWNoKGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgIHcucHVzaCh0aGlzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdztcclxuICAgIH1cclxuICAgIGVsc2UgeyAvLyBzZXRcclxuICAgICAgICBzZWwuc3R5bGUoXCJ3aWR0aFwiLCBmdW5jdGlvbiAoZCwgaSkge1xyXG4gICAgICAgICAgICBsZXQgdyA9IHZhbHVlW2ldO1xyXG4gICAgICAgICAgICByZXR1cm4gdyArIFwicHhcIjtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc2VsOyAvLyBmb3IgY2hhaW5pbmdcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHVuaXF1ZUlkKCkge1xyXG4gICAgLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vZ29yZG9uYnJhbmRlci8yMjMwMzE3XHJcbiAgICAvLyBNYXRoLnJhbmRvbSBzaG91bGQgYmUgdW5pcXVlIGJlY2F1c2Ugb2YgaXRzIHNlZWRpbmcgYWxnb3JpdGhtLlxyXG4gICAgLy8gQ29udmVydCBpdCB0byBiYXNlIDM2IChudW1iZXJzICsgbGV0dGVycyksIGFuZCBncmFiIHRoZSBmaXJzdCA5IGNoYXJhY3RlcnNcclxuICAgIC8vIGFmdGVyIHRoZSBkZWNpbWFsLlxyXG4gICAgcmV0dXJuIFwiX1wiICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyKDIsIDkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaGFrZXJfc29ydChsaXN0LCBjb21wX2Z1bmMpIHtcclxuICAgIC8vIEEgc3RhYmxlIHNvcnQgZnVuY3Rpb24gdG8gYWxsb3cgbXVsdGktbGV2ZWwgc29ydGluZyBvZiBkYXRhXHJcbiAgICAvLyBzZWU6IGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQ29ja3RhaWxfc29ydFxyXG4gICAgLy8gdGhhbmtzIHRvIEpvc2VwaCBOYWhtaWFzXHJcbiAgICBsZXQgYiA9IDA7XHJcbiAgICBsZXQgdCA9IGxpc3QubGVuZ3RoIC0gMTtcclxuICAgIGxldCBzd2FwID0gdHJ1ZTtcclxuXHJcbiAgICB3aGlsZSAoc3dhcCkge1xyXG4gICAgICAgIHN3YXAgPSBmYWxzZTtcclxuICAgICAgICBmb3IgKHZhciBpID0gYjsgaSA8IHQ7ICsraSkge1xyXG4gICAgICAgICAgICBpZiAoY29tcF9mdW5jKGxpc3RbaV0sIGxpc3RbaSArIDFdKSA+IDApIHtcclxuICAgICAgICAgICAgICAgIGxldCBxID0gbGlzdFtpXTtcclxuICAgICAgICAgICAgICAgIGxpc3RbaV0gPSBsaXN0W2kgKyAxXTtcclxuICAgICAgICAgICAgICAgIGxpc3RbaSArIDFdID0gcTtcclxuICAgICAgICAgICAgICAgIHN3YXAgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSAvLyBmb3JcclxuICAgICAgICB0LS07XHJcblxyXG4gICAgICAgIGlmICghc3dhcCkgYnJlYWs7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSB0OyBpID4gYjsgLS1pKSB7XHJcbiAgICAgICAgICAgIGlmIChjb21wX2Z1bmMobGlzdFtpXSwgbGlzdFtpIC0gMV0pIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHEgPSBsaXN0W2ldO1xyXG4gICAgICAgICAgICAgICAgbGlzdFtpXSA9IGxpc3RbaSAtIDFdO1xyXG4gICAgICAgICAgICAgICAgbGlzdFtpIC0gMV0gPSBxO1xyXG4gICAgICAgICAgICAgICAgc3dhcCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IC8vIGZvclxyXG4gICAgICAgIGIrKztcclxuXHJcbiAgICB9IC8vIHdoaWxlKHN3YXApXHJcbiAgICByZXR1cm4gbGlzdDtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNGdW5jdGlvbihmbmMpIHtcclxuICAgIC8vaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzczNTY1MjgvMTM5NTk3M1xyXG4gICAgcmV0dXJuIGZuYyAmJiB7fS50b1N0cmluZy5jYWxsKGZuYykgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzQXJyYXkoYXJyKSB7XHJcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFycikgPT09ICdbb2JqZWN0IEFycmF5XSc7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRpY3RWYWx1ZXMoZCkge1xyXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGQpLm1hcChmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgcmV0dXJuIGRba2V5XTtcclxuICAgIH0pXHJcbn0iLCJpbXBvcnQge1RhYmxlfSBmcm9tICcuL3RhYmxlLmpzJ1xyXG5jb25zb2xlLmxvZyhUYWJsZSlcclxudmFyIHRhYmxlID0gbmV3IFRhYmxlKCcudGFibGUnKVxyXG4gICAgLmZvcm1hdChmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgIHJldHVybiAoZCA9PT0gbnVsbCkgPyBcIj9cIiA6IGQ7XHJcbiAgICB9KVxyXG4gICAgLmZpbHRlcihkMy5zZWxlY3QoJyNmaWx0ZXInKSlcclxuICAgIC5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbiAoZCwgaSkge1xyXG4gICAgICAgIHRoaXMuc2VsZWN0KGQsIGkpO1xyXG4gICAgfSlcclxuICAgIC5vbihcIm1vdXNlbGVhdmVcIiwgZnVuY3Rpb24gKGQsIGkpIHtcclxuICAgICAgICB0aGlzLmRlc2VsZWN0KGQsIGkpO1xyXG4gICAgfSlcclxuICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIChkLCBpKSB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3QoZCwgaSk7XHJcbiAgICB9KVxyXG4gICAgLm9uKFwiZGJsY2xpY2tcIiwgZnVuY3Rpb24gKGQsIGkpIHtcclxuICAgICAgICB0aGlzLmRlc2VsZWN0KGQsIGkpO1xyXG4gICAgfSk7XHJcblxyXG5kMy5qc29uKFwiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3BydXN0L3dpa2lwZWRpYS1tb3ZpZS1kYXRhL21hc3Rlci9tb3ZpZXMuanNvblwiLCBmdW5jdGlvbiAoanNvbikge1xyXG4gICAgdGFibGVcclxuICAgICAgICAuaGVhZGVyKE9iamVjdC5rZXlzKGpzb25bMF0pKVxyXG4gICAgICAgIC5kYXRhKGpzb24pO1xyXG4gICAgZDMuc2VsZWN0KCcjcm93cycpLnRleHQoanNvbi5sZW5ndGgpO1xyXG4gICAgZDMuc2VsZWN0KCcjZmV3JykudGV4dCh0YWJsZS5vcHRpb25zLnJvd3NfaW5fYmxvY2sgKiB0YWJsZS5vcHRpb25zLmJsb2Nrc19pbl9jbHVzdGVyKTtcclxufSk7XHJcblxyXG5kMy5zZWxlY3QoJyNzZWFyY2gnKS5vbihcImlucHV0XCIsIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBzID0gdGhpcy52YWx1ZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgbGV0IGkgPSB0YWJsZS5kYXRhKCkuZmluZEluZGV4KGZ1bmN0aW9uIChkLCBpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRhYmxlLmZpbmRJblJvdyhkLCBzKSAhPT0gLTE7XHJcbiAgICB9KTtcclxuICAgIGlmIChpID4gLTEpIHtcclxuICAgICAgICBsZXQgZCA9IHRhYmxlLmRhdGEoKVtpXVxyXG4gICAgICAgIHRhYmxlLnNlbGVjdChkKTtcclxuICAgICAgICB0YWJsZS5zY3JvbGxUbyhkKTtcclxuICAgIH1cclxufSk7IiwibW9kdWxlLmV4cG9ydHMgPSBkMzsiXSwic291cmNlUm9vdCI6IiJ9