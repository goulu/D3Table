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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/table.js");
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

/***/ "d3":
/*!*********************!*\
  !*** external "d3" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = d3;

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsdXN0ZXJpemUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RhYmxlLmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcImQzXCIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQSxnQ0FBZ0M7O0FBRWhDLENBQUM7QUFDRCxNQUFNLElBQTRCO0FBQ2xDLE9BQU8sRUFDMEI7QUFDakMsQ0FBQztBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixxQkFBcUI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3QkFBd0IsaUJBQWlCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQztBQUN0QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCO0FBQ2xCOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsZUFBZTtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsOENBQThDLFFBQVE7QUFDdEQ7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQztBQUNELEM7Ozs7Ozs7Ozs7OztBQzdYQTtB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QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDOzs7Ozs7Ozs7OztBQ2xoQkEsb0IiLCJmaWxlIjoidGFibGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy90YWJsZS5qc1wiKTtcbiIsIi8qIENsdXN0ZXJpemUuanMgLSB2MC4xOS4wIC0gMjAyMC0wNS0xOFxyXG4gaHR0cDovL05lWFRzLmdpdGh1Yi5jb20vQ2x1c3Rlcml6ZS5qcy9cclxuIENvcHlyaWdodCAoYykgMjAxNSBEZW5pcyBMdWtvdjsgTGljZW5zZWQgR1BMdjMgKi9cclxuXHJcbjsoZnVuY3Rpb24gKG5hbWUsIGRlZmluaXRpb24pIHtcclxuICBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJykgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKCk7XHJcbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09ICdvYmplY3QnKSBkZWZpbmUoZGVmaW5pdGlvbik7XHJcbiAgZWxzZSB0aGlzW25hbWVdID0gZGVmaW5pdGlvbigpO1xyXG59KCdDbHVzdGVyaXplJywgZnVuY3Rpb24gKCkge1xyXG4gIFwidXNlIHN0cmljdFwiXHJcblxyXG4gIC8vIGRldGVjdCBpZTkgYW5kIGxvd2VyXHJcbiAgLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vcGFkb2xzZXkvNTI3NjgzI2NvbW1lbnQtNzg2NjgyXHJcbiAgdmFyIGllID0gKGZ1bmN0aW9uKCl7XHJcbiAgICBmb3IoIHZhciB2ID0gMyxcclxuICAgICAgICAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYicpLFxyXG4gICAgICAgICAgICAgYWxsID0gZWwuYWxsIHx8IFtdO1xyXG4gICAgICAgICBlbC5pbm5lckhUTUwgPSAnPCEtLVtpZiBndCBJRSAnICsgKCsrdikgKyAnXT48aT48IVtlbmRpZl0tLT4nLFxyXG4gICAgICAgICBhbGxbMF07XHJcbiAgICAgICApe31cclxuICAgIHJldHVybiB2ID4gNCA/IHYgOiBkb2N1bWVudC5kb2N1bWVudE1vZGU7XHJcbiAgfSgpKSxcclxuICBpc19tYWMgPSBuYXZpZ2F0b3IucGxhdGZvcm0udG9Mb3dlckNhc2UoKS5pbmRleE9mKCdtYWMnKSArIDE7XHJcbiAgXHJcbiAgdmFyIENsdXN0ZXJpemUgPSBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICBpZiggISAodGhpcyBpbnN0YW5jZW9mIENsdXN0ZXJpemUpKVxyXG4gICAgICByZXR1cm4gbmV3IENsdXN0ZXJpemUoZGF0YSk7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgdmFyIGRlZmF1bHRzID0ge1xyXG4gICAgICByb3dzX2luX2Jsb2NrOiA1MCxcclxuICAgICAgYmxvY2tzX2luX2NsdXN0ZXI6IDQsXHJcbiAgICAgIHRhZzogbnVsbCxcclxuICAgICAgc2hvd19ub19kYXRhX3JvdzogdHJ1ZSxcclxuICAgICAgbm9fZGF0YV9jbGFzczogJ2NsdXN0ZXJpemUtbm8tZGF0YScsXHJcbiAgICAgIG5vX2RhdGFfdGV4dDogJ05vIGRhdGEnLFxyXG4gICAgICBrZWVwX3Bhcml0eTogdHJ1ZSxcclxuICAgICAgY2FsbGJhY2tzOiB7fVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHB1YmxpYyBwYXJhbWV0ZXJzXHJcbiAgICBzZWxmLm9wdGlvbnMgPSB7fTtcclxuICAgIHZhciBvcHRpb25zID0gWydyb3dzX2luX2Jsb2NrJywgJ2Jsb2Nrc19pbl9jbHVzdGVyJywgJ3Nob3dfbm9fZGF0YV9yb3cnLCAnbm9fZGF0YV9jbGFzcycsICdub19kYXRhX3RleHQnLCAna2VlcF9wYXJpdHknLCAndGFnJywgJ2NhbGxiYWNrcyddO1xyXG4gICAgZm9yKHZhciBpID0gMCwgb3B0aW9uOyBvcHRpb24gPSBvcHRpb25zW2ldOyBpKyspIHtcclxuICAgICAgc2VsZi5vcHRpb25zW29wdGlvbl0gPSB0eXBlb2YgZGF0YVtvcHRpb25dICE9ICd1bmRlZmluZWQnICYmIGRhdGFbb3B0aW9uXSAhPSBudWxsXHJcbiAgICAgICAgPyBkYXRhW29wdGlvbl1cclxuICAgICAgICA6IGRlZmF1bHRzW29wdGlvbl07XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGVsZW1zID0gWydzY3JvbGwnLCAnY29udGVudCddO1xyXG4gICAgZm9yKHZhciBpID0gMCwgZWxlbTsgZWxlbSA9IGVsZW1zW2ldOyBpKyspIHtcclxuICAgICAgc2VsZltlbGVtICsgJ19lbGVtJ10gPSBkYXRhW2VsZW0gKyAnSWQnXVxyXG4gICAgICAgID8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZGF0YVtlbGVtICsgJ0lkJ10pXHJcbiAgICAgICAgOiBkYXRhW2VsZW0gKyAnRWxlbSddO1xyXG4gICAgICBpZiggISBzZWxmW2VsZW0gKyAnX2VsZW0nXSlcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFcnJvciEgQ291bGQgbm90IGZpbmQgXCIgKyBlbGVtICsgXCIgZWxlbWVudFwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB0YWJpbmRleCBmb3JjZXMgdGhlIGJyb3dzZXIgdG8ga2VlcCBmb2N1cyBvbiB0aGUgc2Nyb2xsaW5nIGxpc3QsIGZpeGVzICMxMVxyXG4gICAgaWYoICEgc2VsZi5jb250ZW50X2VsZW0uaGFzQXR0cmlidXRlKCd0YWJpbmRleCcpKVxyXG4gICAgICBzZWxmLmNvbnRlbnRfZWxlbS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgMCk7XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBwYXJhbWV0ZXJzXHJcblxyXG4gICAgdmFyIG5yb3dzID0gKGRhdGEubnJvd3MgIT09IHVuZGVmaW5lZCkgPyBkYXRhLm5yb3dzIDogMFxyXG4gICAgdmFyIGZyb3cgPSBmdW5jdGlvbiAoaSkge1xyXG4gICAgICByZXR1cm4gJydcclxuICAgIH07IC8vIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBpLXRoIHJvdyBhcyBIVE1MIHRleHRcclxuXHJcbiAgICB2YXIgX3Jvd3MgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIC8vIHByaXZhdGUgZnVuY3Rpb24gdGhhdCByZWJ1aWxkcyB0aGUgYXJyYXkgZm9yIGFwcGVuZCtwcmVwZW5kK2Rlc3Ryb3lcclxuICAgICAgdmFyIGFyciA9IEFycmF5LmFwcGx5KG51bGwsIEFycmF5KG5yb3dzKSk7XHJcbiAgICAgIGFyciA9IGFyci5tYXAoZnVuY3Rpb24gKHgsIGkpIHtcclxuICAgICAgICByZXR1cm4gZnJvdyhpKVxyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIGFyclxyXG4gICAgfVxyXG5cclxuICAgIHZhciBhZGQgPSBmdW5jdGlvbiAobmV3X3Jvd3MsIHdoZXJlID0gXCJhcHBlbmRcIikge1xyXG4gICAgICBpZiAoaXNBcnJheShuZXdfcm93cykpIHsgLy8gdGhlIFwiY2xhc3NpY1wiIGNhc2VcclxuICAgICAgICB2YXIgYXJyID0gKHdoZXJlID09ICdhcHBlbmQnKVxyXG4gICAgICAgICAgPyBfcm93cygpLmNvbmNhdChuZXdfcm93cylcclxuICAgICAgICAgIDogbmV3X3Jvd3MuY29uY2F0KF9yb3dzKCkpO1xyXG4gICAgICAgIGZyb3cgPSBmdW5jdGlvbiAoaSkge1xyXG4gICAgICAgICAgcmV0dXJuIGFycltpXVxyXG4gICAgICAgIH1cclxuICAgICAgICBucm93cyArPSBuZXdfcm93cy5sZW5ndGg7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAoaXNGdW5jdGlvbihuZXdfcm93cykpIHsgLy8gcm93cyBkZWZpbmVkIGJ5IGEgZnVuY3Rpb25cclxuICAgICAgICBmcm93ID0gbmV3X3Jvd3M7XHJcbiAgICAgICAgLy8gbnJvd3Mgc2hvdWxkIGJlIGFzc2lnbmVkIHNlcGFyYXRlbHlcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChkYXRhLnJvd3MgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBhZGQoZGF0YS5yb3dzKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBhZGQodGhpcy5mZXRjaE1hcmt1cCgpKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgY2FjaGUgPSB7fSxcclxuICAgICAgc2Nyb2xsX3RvcCA9IHNlbGYuc2Nyb2xsX2VsZW0uc2Nyb2xsVG9wO1xyXG5cclxuICAgIC8vIGFwcGVuZCBpbml0aWFsIGRhdGFcclxuICAgIHNlbGYuaW5zZXJ0VG9ET00oZnJvdywgbnJvd3MsIGNhY2hlKTtcclxuXHJcbiAgICAvLyByZXN0b3JlIHRoZSBzY3JvbGwgcG9zaXRpb25cclxuICAgIHNlbGYuc2Nyb2xsX2VsZW0uc2Nyb2xsVG9wID0gc2Nyb2xsX3RvcDtcclxuXHJcbiAgICAvLyBhZGRpbmcgc2Nyb2xsIGhhbmRsZXJcclxuICAgIHZhciBsYXN0X2NsdXN0ZXIgPSBmYWxzZSxcclxuICAgIHNjcm9sbF9kZWJvdW5jZSA9IDAsXHJcbiAgICBwb2ludGVyX2V2ZW50c19zZXQgPSBmYWxzZSxcclxuICAgIHNjcm9sbEV2ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIC8vIGZpeGVzIHNjcm9sbGluZyBpc3N1ZSBvbiBNYWMgIzNcclxuICAgICAgaWYgKGlzX21hYykge1xyXG4gICAgICAgICAgaWYoICEgcG9pbnRlcl9ldmVudHNfc2V0KSBzZWxmLmNvbnRlbnRfZWxlbS5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xyXG4gICAgICAgICAgcG9pbnRlcl9ldmVudHNfc2V0ID0gdHJ1ZTtcclxuICAgICAgICAgIGNsZWFyVGltZW91dChzY3JvbGxfZGVib3VuY2UpO1xyXG4gICAgICAgICAgc2Nyb2xsX2RlYm91bmNlID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgc2VsZi5jb250ZW50X2VsZW0uc3R5bGUucG9pbnRlckV2ZW50cyA9ICdhdXRvJztcclxuICAgICAgICAgICAgICBwb2ludGVyX2V2ZW50c19zZXQgPSBmYWxzZTtcclxuICAgICAgICAgIH0sIDUwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGxhc3RfY2x1c3RlciAhPSAobGFzdF9jbHVzdGVyID0gc2VsZi5nZXRDbHVzdGVyTnVtKCkpKVxyXG4gICAgICAgICAgc2VsZi5pbnNlcnRUb0RPTShmcm93LCBucm93cywgY2FjaGUpO1xyXG4gICAgICAgIGlmIChzZWxmLm9wdGlvbnMuY2FsbGJhY2tzLnNjcm9sbGluZ1Byb2dyZXNzKVxyXG4gICAgICAgICAgc2VsZi5vcHRpb25zLmNhbGxiYWNrcy5zY3JvbGxpbmdQcm9ncmVzcyhzZWxmLmdldFNjcm9sbFByb2dyZXNzKCkpO1xyXG4gICAgICB9LFxyXG4gICAgICByZXNpemVfZGVib3VuY2UgPSAwLFxyXG4gICAgICByZXNpemVFdiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjbGVhclRpbWVvdXQocmVzaXplX2RlYm91bmNlKTtcclxuICAgICAgICByZXNpemVfZGVib3VuY2UgPSBzZXRUaW1lb3V0KHNlbGYucmVmcmVzaCwgMTAwKTtcclxuICAgICAgfVxyXG4gICAgb24oJ3Njcm9sbCcsIHNlbGYuc2Nyb2xsX2VsZW0sIHNjcm9sbEV2KTtcclxuICAgIG9uKCdyZXNpemUnLCB3aW5kb3csIHJlc2l6ZUV2KTtcclxuXHJcbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xyXG4gICAgc2VsZi5kZXN0cm95ID0gZnVuY3Rpb24gKGNsZWFuKSB7XHJcbiAgICAgIG9mZignc2Nyb2xsJywgc2VsZi5zY3JvbGxfZWxlbSwgc2Nyb2xsRXYpO1xyXG4gICAgICBvZmYoJ3Jlc2l6ZScsIHdpbmRvdywgcmVzaXplRXYpO1xyXG4gICAgICBzZWxmLmh0bWwoKGNsZWFuID8gc2VsZi5nZW5lcmF0ZUVtcHR5Um93KCkgOiBfcm93cygpKS5qb2luKCcnKSk7XHJcbiAgICB9XHJcbiAgICBzZWxmLnJlZnJlc2ggPSBmdW5jdGlvbiAoZm9yY2UpIHtcclxuICAgICAgaWYgKHNlbGYuZ2V0Um93c0hlaWdodChucm93cykgfHwgZm9yY2UpIHNlbGYudXBkYXRlKGZyb3csbnJvd3MpO1xyXG4gICAgfVxyXG4gICAgc2VsZi51cGRhdGUgPSBmdW5jdGlvbiAobmV3X3Jvd3MsIG5ld19ucm93cyA9IDApIHtcclxuICAgICAgLy8gYSBuZXdfbnJvd3Mgc2hvdWxkIGJlIHNwZWNpZmllZCBpZiBuZXdfcm93cyBpcyBhIGZ1bmN0aW9uLCBvdGhlcndpc2UgaXQncyByZWNhbGN1bGF0ZWRcclxuICAgICAgbnJvd3MgPSBuZXdfbnJvd3M7XHJcbiAgICAgIGFkZChuZXdfcm93cyk7XHJcbiAgICAgIHZhciBzY3JvbGxfdG9wID0gc2VsZi5zY3JvbGxfZWxlbS5zY3JvbGxUb3A7XHJcbiAgICAgIC8vIGZpeGVzICMzOVxyXG4gICAgICBpZiAobnJvd3MgKiBzZWxmLm9wdGlvbnMuaXRlbV9oZWlnaHQgPCBzY3JvbGxfdG9wKSB7XHJcbiAgICAgICAgc2VsZi5zY3JvbGxfZWxlbS5zY3JvbGxUb3AgPSAwO1xyXG4gICAgICAgIGxhc3RfY2x1c3RlciA9IDA7XHJcbiAgICAgIH1cclxuICAgICAgc2VsZi5pbnNlcnRUb0RPTShmcm93LCBucm93cywgY2FjaGUpO1xyXG4gICAgICBzZWxmLnNjcm9sbF9lbGVtLnNjcm9sbFRvcCA9IHNjcm9sbF90b3A7XHJcbiAgICB9XHJcbiAgICBzZWxmLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBzZWxmLnVwZGF0ZShbXSwwKTtcclxuICAgIH1cclxuICAgIHNlbGYuZ2V0Um93c0Ftb3VudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIG5yb3dzO1xyXG4gICAgfVxyXG4gICAgc2VsZi5nZXRTY3JvbGxQcm9ncmVzcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5zY3JvbGxfdG9wIC8gKG5yb3dzICogdGhpcy5vcHRpb25zLml0ZW1faGVpZ2h0KSAqIDEwMCB8fCAwO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGYuYXBwZW5kID0gZnVuY3Rpb24gKHJvd3MpIHtcclxuICAgICAgYWRkKHJvd3MsICdhcHBlbmQnLCk7XHJcbiAgICAgIHNlbGYuaW5zZXJ0VG9ET00oZnJvdywgbnJvd3MsIGNhY2hlKTtcclxuICAgIH1cclxuICAgIHNlbGYucHJlcGVuZCA9IGZ1bmN0aW9uIChyb3dzKSB7XHJcbiAgICAgIGFkZChyb3dzLCAncHJlcGVuZCcpO1xyXG4gICAgICBzZWxmLmluc2VydFRvRE9NKGZyb3csIG5yb3dzLCBjYWNoZSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgQ2x1c3Rlcml6ZS5wcm90b3R5cGUgPSB7XHJcbiAgICBjb25zdHJ1Y3RvcjogQ2x1c3Rlcml6ZSxcclxuICAgIC8vIGZldGNoIGV4aXN0aW5nIG1hcmt1cFxyXG4gICAgZmV0Y2hNYXJrdXA6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIHJvd3MgPSBbXSwgcm93c19ub2RlcyA9IHRoaXMuZ2V0Q2hpbGROb2Rlcyh0aGlzLmNvbnRlbnRfZWxlbSk7XHJcbiAgICAgIHdoaWxlIChyb3dzX25vZGVzLmxlbmd0aCkge1xyXG4gICAgICAgIHJvd3MucHVzaChyb3dzX25vZGVzLnNoaWZ0KCkub3V0ZXJIVE1MKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcm93cztcclxuICAgIH0sXHJcbiAgICAvLyBnZXQgdGFnIG5hbWUsIGNvbnRlbnQgdGFnIG5hbWUsIHRhZyBoZWlnaHQsIGNhbGMgY2x1c3RlciBoZWlnaHRcclxuICAgIGV4cGxvcmVFbnZpcm9ubWVudDogZnVuY3Rpb24gKGZyb3csIG5yb3dzLCBjYWNoZSkge1xyXG4gICAgICB2YXIgb3B0cyA9IHRoaXMub3B0aW9ucztcclxuICAgICAgb3B0cy5jb250ZW50X3RhZyA9IHRoaXMuY29udGVudF9lbGVtLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgaWYgKCFucm93cykgcmV0dXJuO1xyXG4gICAgICBpZiAoaWUgJiYgaWUgPD0gOSAmJiAhb3B0cy50YWcpIHtcclxuICAgICAgICBvcHRzLnRhZyA9IGZyb3coMCkubWF0Y2goLzwoW14+XFxzL10qKS8pWzFdLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgIH1cclxuICAgICAgdmFyIG5jaGlsZHJlbiA9IHRoaXMuY29udGVudF9lbGVtLmNoaWxkcmVuLmxlbmd0aDtcclxuICAgICAgaWYgKCFvcHRzLnRhZykge1xyXG4gICAgICAgIG9wdHMudGFnID0gdGhpcy5jb250ZW50X2VsZW0uY2hpbGRyZW5bMF0udGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChuY2hpbGRyZW4gPD0gMSkge1xyXG4gICAgICAgIC8vIHdoYXQncyB0aGUgcHVycG9zZSBvZiB0aGlzID8/PyBpdCBtYXkgY2xlYXIgdGhlIGh0bWwgY29udGVudCAuLi5cclxuICAgICAgICBjYWNoZS5kYXRhID0gdGhpcy5odG1sKGZyb3coMCkgKyBmcm93KDApICsgZnJvdygwKSk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5nZXRSb3dzSGVpZ2h0KG5yb3dzKTtcclxuICAgIH0sXHJcbiAgICBnZXRSb3dzSGVpZ2h0OiBmdW5jdGlvbiAobnJvd3MpIHtcclxuICAgICAgdmFyIG9wdHMgPSB0aGlzLm9wdGlvbnMsXHJcbiAgICAgICAgcHJldl9pdGVtX2hlaWdodCA9IG9wdHMuaXRlbV9oZWlnaHQ7XHJcbiAgICAgIG9wdHMuY2x1c3Rlcl9oZWlnaHQgPSAwO1xyXG4gICAgICBpZiAoIW5yb3dzKSByZXR1cm47XHJcbiAgICAgIHZhciBub2RlcyA9IHRoaXMuY29udGVudF9lbGVtLmNoaWxkcmVuO1xyXG4gICAgICBpZiAoIW5vZGVzLmxlbmd0aCkgcmV0dXJuO1xyXG4gICAgICB2YXIgbm9kZSA9IG5vZGVzW01hdGguZmxvb3Iobm9kZXMubGVuZ3RoIC8gMildO1xyXG4gICAgICBvcHRzLml0ZW1faGVpZ2h0ID0gbm9kZS5vZmZzZXRIZWlnaHQ7XHJcbiAgICAgIC8vIGNvbnNpZGVyIHRhYmxlJ3MgYm9yZGVyLXNwYWNpbmdcclxuICAgICAgaWYgKG9wdHMudGFnID09ICd0cicgJiYgZ2V0U3R5bGUoJ2JvcmRlckNvbGxhcHNlJywgdGhpcy5jb250ZW50X2VsZW0pICE9ICdjb2xsYXBzZScpXHJcbiAgICAgICAgb3B0cy5pdGVtX2hlaWdodCArPSBwYXJzZUludChnZXRTdHlsZSgnYm9yZGVyU3BhY2luZycsIHRoaXMuY29udGVudF9lbGVtKSwgMTApIHx8IDA7XHJcbiAgICAgIC8vIGNvbnNpZGVyIG1hcmdpbnMgKGFuZCBtYXJnaW5zIGNvbGxhcHNpbmcpXHJcbiAgICAgIGlmIChvcHRzLnRhZyAhPSAndHInKSB7XHJcbiAgICAgICAgdmFyIG1hcmdpblRvcCA9IHBhcnNlSW50KGdldFN0eWxlKCdtYXJnaW5Ub3AnLCBub2RlKSwgMTApIHx8IDA7XHJcbiAgICAgICAgdmFyIG1hcmdpbkJvdHRvbSA9IHBhcnNlSW50KGdldFN0eWxlKCdtYXJnaW5Cb3R0b20nLCBub2RlKSwgMTApIHx8IDA7XHJcbiAgICAgICAgb3B0cy5pdGVtX2hlaWdodCArPSBNYXRoLm1heChtYXJnaW5Ub3AsIG1hcmdpbkJvdHRvbSk7XHJcbiAgICAgIH1cclxuICAgICAgb3B0cy5ibG9ja19oZWlnaHQgPSBvcHRzLml0ZW1faGVpZ2h0ICogb3B0cy5yb3dzX2luX2Jsb2NrO1xyXG4gICAgICBvcHRzLnJvd3NfaW5fY2x1c3RlciA9IG9wdHMuYmxvY2tzX2luX2NsdXN0ZXIgKiBvcHRzLnJvd3NfaW5fYmxvY2s7XHJcbiAgICAgIG9wdHMuY2x1c3Rlcl9oZWlnaHQgPSBvcHRzLmJsb2Nrc19pbl9jbHVzdGVyICogb3B0cy5ibG9ja19oZWlnaHQ7XHJcbiAgICAgIHJldHVybiBwcmV2X2l0ZW1faGVpZ2h0ICE9IG9wdHMuaXRlbV9oZWlnaHQ7XHJcbiAgICB9LFxyXG4gICAgLy8gZ2V0IGN1cnJlbnQgY2x1c3RlciBudW1iZXJcclxuICAgIGdldENsdXN0ZXJOdW06IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbF90b3AgPSB0aGlzLnNjcm9sbF9lbGVtLnNjcm9sbFRvcDtcclxuICAgICAgcmV0dXJuIE1hdGguZmxvb3IodGhpcy5vcHRpb25zLnNjcm9sbF90b3AgLyAodGhpcy5vcHRpb25zLmNsdXN0ZXJfaGVpZ2h0IC0gdGhpcy5vcHRpb25zLmJsb2NrX2hlaWdodCkpIHx8IDA7XHJcbiAgICB9LFxyXG4gICAgLy8gZ2VuZXJhdGUgZW1wdHkgcm93IGlmIG5vIGRhdGEgcHJvdmlkZWRcclxuICAgIGdlbmVyYXRlRW1wdHlSb3c6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIG9wdHMgPSB0aGlzLm9wdGlvbnM7XHJcbiAgICAgIGlmICghb3B0cy50YWcgfHwgIW9wdHMuc2hvd19ub19kYXRhX3JvdykgcmV0dXJuIFtdO1xyXG4gICAgICB2YXIgZW1wdHlfcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChvcHRzLnRhZyksXHJcbiAgICAgICAgbm9fZGF0YV9jb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUob3B0cy5ub19kYXRhX3RleHQpLCB0ZDtcclxuICAgICAgZW1wdHlfcm93LmNsYXNzTmFtZSA9IG9wdHMubm9fZGF0YV9jbGFzcztcclxuICAgICAgaWYgKG9wdHMudGFnID09ICd0cicpIHtcclxuICAgICAgICB0ZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XHJcbiAgICAgICAgLy8gZml4ZXMgIzUzXHJcbiAgICAgICAgdGQuY29sU3BhbiA9IDEwMDtcclxuICAgICAgICB0ZC5hcHBlbmRDaGlsZChub19kYXRhX2NvbnRlbnQpO1xyXG4gICAgICB9XHJcbiAgICAgIGVtcHR5X3Jvdy5hcHBlbmRDaGlsZCh0ZCB8fCBub19kYXRhX2NvbnRlbnQpO1xyXG4gICAgICByZXR1cm4gW2VtcHR5X3Jvdy5vdXRlckhUTUxdO1xyXG4gICAgfSxcclxuICAgIC8vIGdlbmVyYXRlIGNsdXN0ZXIgZm9yIGN1cnJlbnQgc2Nyb2xsIHBvc2l0aW9uXHJcbiAgICBnZW5lcmF0ZTogZnVuY3Rpb24gKGZyb3csIG5yb3dzLCBjbHVzdGVyX251bSkge1xyXG4gICAgICB2YXIgb3B0cyA9IHRoaXMub3B0aW9ucztcclxuICAgICAgLypcclxuICAgICAgaWYgKG5yb3dzIDwgb3B0cy5yb3dzX2luX2Jsb2NrKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHRvcF9vZmZzZXQ6IDAsXHJcbiAgICAgICAgICBib3R0b21fb2Zmc2V0OiAwLFxyXG4gICAgICAgICAgcm93c19hYm92ZTogMCxcclxuICAgICAgICAgIHJvd3M6IG5yb3dzID8gZnJvdyA6IHRoaXMuZ2VuZXJhdGVFbXB0eVJvd1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICAqL1xyXG4gICAgICB2YXIgaXRlbXNfc3RhcnQgPSBNYXRoLm1heCgob3B0cy5yb3dzX2luX2NsdXN0ZXIgLSBvcHRzLnJvd3NfaW5fYmxvY2spICogY2x1c3Rlcl9udW0sIDApLFxyXG4gICAgICAgIGl0ZW1zX2VuZCA9IE1hdGgubWluKGl0ZW1zX3N0YXJ0ICsgb3B0cy5yb3dzX2luX2NsdXN0ZXIsIG5yb3dzKSxcclxuICAgICAgICB0b3Bfb2Zmc2V0ID0gTWF0aC5tYXgoaXRlbXNfc3RhcnQgKiBvcHRzLml0ZW1faGVpZ2h0LCAwKSxcclxuICAgICAgICBib3R0b21fb2Zmc2V0ID0gTWF0aC5tYXgoKG5yb3dzIC0gaXRlbXNfZW5kKSAqIG9wdHMuaXRlbV9oZWlnaHQsIDApLFxyXG4gICAgICAgIHRoaXNfY2x1c3Rlcl9yb3dzID0gW10sXHJcbiAgICAgICAgcm93c19hYm92ZSA9IGl0ZW1zX3N0YXJ0O1xyXG4gICAgICBpZiAodG9wX29mZnNldCA8IDEpIHtcclxuICAgICAgICByb3dzX2Fib3ZlKys7XHJcbiAgICAgIH1cclxuICAgICAgZm9yICh2YXIgaSA9IGl0ZW1zX3N0YXJ0OyBpIDwgaXRlbXNfZW5kOyBpKyspIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgdGhpc19jbHVzdGVyX3Jvd3MucHVzaChmcm93KGkpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgdGhpc19jbHVzdGVyX3Jvd3MucHVzaCh0aGlzLmdlbmVyYXRlRW1wdHlSb3coKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdG9wX29mZnNldDogdG9wX29mZnNldCxcclxuICAgICAgICBib3R0b21fb2Zmc2V0OiBib3R0b21fb2Zmc2V0LFxyXG4gICAgICAgIHJvd3NfYWJvdmU6IHJvd3NfYWJvdmUsXHJcbiAgICAgICAgcm93czogdGhpc19jbHVzdGVyX3Jvd3NcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHJlbmRlckV4dHJhVGFnOiBmdW5jdGlvbiAoY2xhc3NfbmFtZSwgaGVpZ2h0KSB7XHJcbiAgICAgIHZhciB0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRoaXMub3B0aW9ucy50YWcpLFxyXG4gICAgICAgIGNsdXN0ZXJpemVfcHJlZml4ID0gJ2NsdXN0ZXJpemUtJztcclxuICAgICAgdGFnLmNsYXNzTmFtZSA9IFtjbHVzdGVyaXplX3ByZWZpeCArICdleHRyYS1yb3cnLCBjbHVzdGVyaXplX3ByZWZpeCArIGNsYXNzX25hbWVdLmpvaW4oJyAnKTtcclxuICAgICAgaGVpZ2h0ICYmICh0YWcuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4Jyk7XHJcbiAgICAgIHJldHVybiB0YWcub3V0ZXJIVE1MO1xyXG4gICAgfSxcclxuICAgIC8vIGlmIG5lY2Vzc2FyeSB2ZXJpZnkgZGF0YSBjaGFuZ2VkIGFuZCBpbnNlcnQgdG8gRE9NXHJcbiAgICBpbnNlcnRUb0RPTTogZnVuY3Rpb24gKGZyb3csIG5yb3dzLCBjYWNoZSkge1xyXG4gICAgICAvLyBleHBsb3JlIHJvdydzIGhlaWdodFxyXG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5jbHVzdGVyX2hlaWdodCkge1xyXG4gICAgICAgIHRoaXMuZXhwbG9yZUVudmlyb25tZW50KGZyb3csIG5yb3dzLCBjYWNoZSk7XHJcbiAgICAgIH1cclxuICAgICAgdmFyIGRhdGEgPSB0aGlzLmdlbmVyYXRlKGZyb3csIG5yb3dzLCB0aGlzLmdldENsdXN0ZXJOdW0oKSksXHJcbiAgICAgICAgdGhpc19jbHVzdGVyX3Jvd3MgPSBkYXRhLnJvd3Muam9pbignJyksXHJcbiAgICAgICAgdGhpc19jbHVzdGVyX2NvbnRlbnRfY2hhbmdlZCA9IHRoaXMuY2hlY2tDaGFuZ2VzKCdkYXRhJywgdGhpc19jbHVzdGVyX3Jvd3MsIGNhY2hlKSxcclxuICAgICAgICB0b3Bfb2Zmc2V0X2NoYW5nZWQgPSB0aGlzLmNoZWNrQ2hhbmdlcygndG9wJywgZGF0YS50b3Bfb2Zmc2V0LCBjYWNoZSksXHJcbiAgICAgICAgb25seV9ib3R0b21fb2Zmc2V0X2NoYW5nZWQgPSB0aGlzLmNoZWNrQ2hhbmdlcygnYm90dG9tJywgZGF0YS5ib3R0b21fb2Zmc2V0LCBjYWNoZSksXHJcbiAgICAgICAgY2FsbGJhY2tzID0gdGhpcy5vcHRpb25zLmNhbGxiYWNrcyxcclxuICAgICAgICBsYXlvdXQgPSBbXTtcclxuXHJcbiAgICAgIGlmICh0aGlzX2NsdXN0ZXJfY29udGVudF9jaGFuZ2VkIHx8IHRvcF9vZmZzZXRfY2hhbmdlZCkge1xyXG4gICAgICAgIGlmIChkYXRhLnRvcF9vZmZzZXQpIHtcclxuICAgICAgICAgIHRoaXMub3B0aW9ucy5rZWVwX3Bhcml0eSAmJiBsYXlvdXQucHVzaCh0aGlzLnJlbmRlckV4dHJhVGFnKCdrZWVwLXBhcml0eScpKTtcclxuICAgICAgICAgIGxheW91dC5wdXNoKHRoaXMucmVuZGVyRXh0cmFUYWcoJ3RvcC1zcGFjZScsIGRhdGEudG9wX29mZnNldCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsYXlvdXQucHVzaCh0aGlzX2NsdXN0ZXJfcm93cyk7XHJcbiAgICAgICAgZGF0YS5ib3R0b21fb2Zmc2V0ICYmIGxheW91dC5wdXNoKHRoaXMucmVuZGVyRXh0cmFUYWcoJ2JvdHRvbS1zcGFjZScsIGRhdGEuYm90dG9tX29mZnNldCkpO1xyXG4gICAgICAgIGNhbGxiYWNrcy5jbHVzdGVyV2lsbENoYW5nZSAmJiBjYWxsYmFja3MuY2x1c3RlcldpbGxDaGFuZ2UoKTtcclxuICAgICAgICB0aGlzLmh0bWwobGF5b3V0LmpvaW4oJycpKTtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuY29udGVudF90YWcgPT0gJ29sJyAmJiB0aGlzLmNvbnRlbnRfZWxlbS5zZXRBdHRyaWJ1dGUoJ3N0YXJ0JywgZGF0YS5yb3dzX2Fib3ZlKTtcclxuICAgICAgICB0aGlzLmNvbnRlbnRfZWxlbS5zdHlsZVsnY291bnRlci1pbmNyZW1lbnQnXSA9ICdjbHVzdGVyaXplLWNvdW50ZXIgJyArIChkYXRhLnJvd3NfYWJvdmUgLSAxKTtcclxuICAgICAgICBjYWxsYmFja3MuY2x1c3RlckNoYW5nZWQgJiYgY2FsbGJhY2tzLmNsdXN0ZXJDaGFuZ2VkKCk7XHJcbiAgICAgIH0gZWxzZSBpZiAob25seV9ib3R0b21fb2Zmc2V0X2NoYW5nZWQpIHtcclxuICAgICAgICB0aGlzLmNvbnRlbnRfZWxlbS5sYXN0Q2hpbGQuc3R5bGUuaGVpZ2h0ID0gZGF0YS5ib3R0b21fb2Zmc2V0ICsgJ3B4JztcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIHVuZm9ydHVuYXRlbHkgaWUgPD0gOSBkb2VzIG5vdCBhbGxvdyB0byB1c2UgaW5uZXJIVE1MIGZvciB0YWJsZSBlbGVtZW50cywgc28gbWFrZSBhIHdvcmthcm91bmRcclxuICAgIGh0bWw6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgIHZhciBjb250ZW50X2VsZW0gPSB0aGlzLmNvbnRlbnRfZWxlbTtcclxuICAgICAgaWYgKGllICYmIGllIDw9IDkgJiYgdGhpcy5vcHRpb25zLnRhZyA9PSAndHInKSB7XHJcbiAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLCBsYXN0O1xyXG4gICAgICAgIGRpdi5pbm5lckhUTUwgPSAnPHRhYmxlPjx0Ym9keT4nICsgZGF0YSArICc8L3Rib2R5PjwvdGFibGU+JztcclxuICAgICAgICB3aGlsZSAoKGxhc3QgPSBjb250ZW50X2VsZW0ubGFzdENoaWxkKSkge1xyXG4gICAgICAgICAgY29udGVudF9lbGVtLnJlbW92ZUNoaWxkKGxhc3QpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcm93c19ub2RlcyA9IHRoaXMuZ2V0Q2hpbGROb2RlcyhkaXYuZmlyc3RDaGlsZC5maXJzdENoaWxkKTtcclxuICAgICAgICB3aGlsZSAocm93c19ub2Rlcy5sZW5ndGgpIHtcclxuICAgICAgICAgIGNvbnRlbnRfZWxlbS5hcHBlbmRDaGlsZChyb3dzX25vZGVzLnNoaWZ0KCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb250ZW50X2VsZW0uaW5uZXJIVE1MID0gZGF0YTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGdldENoaWxkTm9kZXM6IGZ1bmN0aW9uICh0YWcpIHtcclxuICAgICAgdmFyIGNoaWxkX25vZGVzID0gdGFnLmNoaWxkcmVuLCBub2RlcyA9IFtdO1xyXG4gICAgICBmb3IgKHZhciBpID0gMCwgaWkgPSBjaGlsZF9ub2Rlcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XHJcbiAgICAgICAgbm9kZXMucHVzaChjaGlsZF9ub2Rlc1tpXSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG5vZGVzO1xyXG4gICAgfSxcclxuICAgIGNoZWNrQ2hhbmdlczogZnVuY3Rpb24gKHR5cGUsIHZhbHVlLCBjYWNoZSkge1xyXG4gICAgICB2YXIgY2hhbmdlZCA9IHZhbHVlICE9IGNhY2hlW3R5cGVdO1xyXG4gICAgICBjYWNoZVt0eXBlXSA9IHZhbHVlO1xyXG4gICAgICByZXR1cm4gY2hhbmdlZDtcclxuICAgIH1cclxuICB9XHJcblxyXG4vLyBzdXBwb3J0IGZ1bmN0aW9uc1xyXG4gIGZ1bmN0aW9uIG9uKGV2dCwgZWxlbWVudCwgZm5jKSB7XHJcbiAgICByZXR1cm4gZWxlbWVudC5hZGRFdmVudExpc3RlbmVyID8gZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2dCwgZm5jLCBmYWxzZSkgOiBlbGVtZW50LmF0dGFjaEV2ZW50KFwib25cIiArIGV2dCwgZm5jKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG9mZihldnQsIGVsZW1lbnQsIGZuYykge1xyXG4gICAgcmV0dXJuIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciA/IGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldnQsIGZuYywgZmFsc2UpIDogZWxlbWVudC5kZXRhY2hFdmVudChcIm9uXCIgKyBldnQsIGZuYyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpc0FycmF5KGFycikge1xyXG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcnIpID09PSAnW29iamVjdCBBcnJheV0nO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaXNGdW5jdGlvbihmbmMpIHtcclxuICAgIC8vaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzczNTY1MjgvMTM5NTk3M1xyXG4gICAgcmV0dXJuIGZuYyAmJiB7fS50b1N0cmluZy5jYWxsKGZuYykgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBnZXRTdHlsZShwcm9wLCBlbGVtKSB7XHJcbiAgICByZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUgPyB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtKVtwcm9wXSA6IGVsZW0uY3VycmVudFN0eWxlW3Byb3BdO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIENsdXN0ZXJpemU7XHJcbn0pKVxyXG47IiwiLypcclxucmV1c2FibGUgRDMuanMgY2xhc3MgZm9yIChMQVJHRSkgdGFibGVzXHJcbiogZWZmaWNpZW50IHdpdGggbGFyZ2UgZGF0YSB0aGFua3MgdG8gaHR0cHM6Ly9jbHVzdGVyaXplLmpzLm9yZy9cclxuKiBmaWx0ZXJhYmxlIHRoYW5rcyB0byBEM1xyXG4qIHNvcnRhYmxlIHRoYW5rcyB0byBodHRwOi8vYmwub2Nrcy5vcmcvQU1EUy80YTYxNDk3MTgyYjhmY2IwNTkwNlxyXG4qIGFuZCBodHRwczovL3d3dy5rcnlvZ2VuaXgub3JnL2NvZGUvYnJvd3Nlci9zb3J0dGFibGUvKVxyXG5cclxuQGF1dGhvciAgUGhpbGlwcGUgR3VnbGllbG1ldHRpIGh0dHBzOi8vZ2l0aHViLmNvbS9nb3VsdS9cclxuICovXHJcblxyXG5pbXBvcnQgKiBhcyBDbHVzdGVyaXplIGZyb20gJy4vY2x1c3Rlcml6ZS5qcydcclxuaW1wb3J0ICogYXMgZDMgZnJvbSAnZDMnXHJcblxyXG5leHBvcnQgY2xhc3MgVGFibGUgZXh0ZW5kcyBDbHVzdGVyaXplIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBoZWlnaHQgPSA0MDApIHtcclxuICAgICAgICAvKiBidWlsZCBET00gc3RydWN0dXJlIGxpa2UgdGhpczpcclxuICAgICAgICAgICAgPHRhYmxlPlxyXG4gICAgICAgICAgICAgICAgPHRoZWFkPlxyXG4gICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0aD5IZWFkZXJzPC90aD5cclxuICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICA8L3RoZWFkPlxyXG4gICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgICA8ZGl2IGlkPVwic2Nyb2xsQXJlYVwiIGNsYXNzPVwiY2x1c3Rlcml6ZS1zY3JvbGxcIj5cclxuICAgICAgICAgICAgICAgIDx0YWJsZT5cclxuICAgICAgICAgICAgICAgICAgICA8dGJvZHkgaWQ9XCJjb250ZW50QXJlYVwiIGNsYXNzPVwiY2x1c3Rlcml6ZS1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRyIGNsYXNzPVwiY2x1c3Rlcml6ZS1uby1kYXRhXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5Mb2FkaW5nIGRhdGHigKY8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cclxuICAgICAgICAgICAgICAgIDwvdGFibGU+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0eXBlb2YoZWxlbWVudCk9PSdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQ9ZDMuc2VsZWN0KGVsZW1lbnQpIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRoZWFkID0gZWxlbWVudC5hcHBlbmQoXCJ0YWJsZVwiKS5hcHBlbmQoXCJ0aGVhZFwiKTtcclxuICAgICAgICB0aGVhZC5pbnNlcnQoXCJ0aFwiKS5hcHBlbmQoXCJ0clwiKS50ZXh0KFwiSGVhZGVyc1wiKTtcclxuXHJcbiAgICAgICAgbGV0IHNjcm9sbCA9IGVsZW1lbnQuYXBwZW5kKFwiZGl2XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgdW5pcXVlSWQpXHJcbiAgICAgICAgICAgIC5zdHlsZShcIm1heC1oZWlnaHRcIiwgaGVpZ2h0ICsgJ3B4JylcclxuICAgICAgICAgICAgLmNsYXNzZWQoXCJjbHVzdGVyaXplLXNjcm9sbFwiLCB0cnVlKVxyXG4gICAgICAgICAgICAub24oJ3Njcm9sbCcsIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJldlNjcm9sbExlZnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc2Nyb2xsTGVmdCA9IHRoaXMuc2Nyb2xsTGVmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzY3JvbGxMZWZ0ID09IHByZXZTY3JvbGxMZWZ0KSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldlNjcm9sbExlZnQgPSBzY3JvbGxMZWZ0O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGhlYWQuc3R5bGUoJ21hcmdpbi1sZWZ0JywgLXNjcm9sbExlZnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICBsZXQgcm93cyA9IHNjcm9sbC5hcHBlbmQoXCJ0YWJsZVwiKS5hcHBlbmQoXCJ0Ym9keVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIHVuaXF1ZUlkKVxyXG4gICAgICAgICAgICAuY2xhc3NlZChcImNsdXN0ZXJpemUtY29udGVudFwiLCB0cnVlKTtcclxuXHJcbiAgICAgICAgc3VwZXIoe1xyXG4gICAgICAgICAgICAvLyByb3dzOiBbXSwgLy8gZG8gbm90IHNwZWNpZnkgaXQgaGVyZVxyXG4gICAgICAgICAgICBzY3JvbGxJZDogc2Nyb2xsLmF0dHIoXCJpZFwiKSxcclxuICAgICAgICAgICAgY29udGVudElkOiByb3dzLmF0dHIoXCJpZFwiKSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICB0aGlzLnRoZWFkID0gdGhlYWQ7XHJcbiAgICAgICAgdGhpcy5zY3JvbGwgPSBzY3JvbGw7XHJcbiAgICAgICAgdGhpcy5yb3dzID0gZWxlbWVudC5zZWxlY3QoXCJ0Ym9keVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5mb3JtYXQoZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHY7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLnJvd2lkKGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgIC8vIGJ5IGRlZmF1bHQsIHJvd2lkIGlzIHJvdyBudW1iZXIgaW4gZGF0YVxyXG4gICAgICAgICAgICAvLyBub3QgYmFkLCBidXQgZG9lbnMndCBzdXJ2aXZlIGEgdGFibGUuc29ydCAuLi5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YSgpLmluZGV4T2YoZClcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICB0aGlzLm9wdGlvbnMuY2FsbGJhY2tzID0ge1xyXG4gICAgICAgICAgICBjbHVzdGVyQ2hhbmdlZDogdGhpcy5yZXNpemUuYmluZCh0aGlzKVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHRoaXMucmVzaXplLmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICBsZXQgdHIgPSByb3dzLmFwcGVuZChcInRyXCIpLmNsYXNzZWQoXCJjbHVzdGVyaXplLW5vLWRhdGFcIiwgdHJ1ZSk7XHJcbiAgICAgICAgdHIuYXBwZW5kKFwidGRcIikudGV4dChcIkxvYWRpbmcgZGF0YS4uLlwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5fX2RhdGFfXyA9IFtdOyAvLyBkb24ndCBjYWxsIGRhdGEoKSBzaW5jZSBpdCB3b3VsZCBjbGVhciBhbnkgZXhpc3RpbmcgRE9NIHRhYmxlXHJcblxyXG4gICAgICAgIHRoaXMuX2ZpbHRlciA9IGZ1bmN0aW9uIChkLCBpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWQgPSBuZXcgU2V0KFtdKTtcclxuICAgICAgICB0aGlzLnNvcnRBc2NlbmRpbmcgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGZvcm1hdChmKSB7XHJcbiAgICAgICAgdGhpcy5fZm9ybWF0ID0gZjtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvLyBjb25maWdcclxuXHJcbiAgICBoZWFkZXIoY29scykge1xyXG4gICAgICAgIGxldCB0YWJsZSA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5jb2x1bW5zID0gY29scztcclxuICAgICAgICB0aGlzLnRoZWFkLnNlbGVjdEFsbChcInRoXCIpXHJcbiAgICAgICAgICAgIC5yZW1vdmUoKTtcclxuICAgICAgICB0aGlzLnRoZWFkLnNlbGVjdEFsbChcInRoXCIpXHJcbiAgICAgICAgICAgIC5kYXRhKHRoaXMuY29sdW1ucylcclxuICAgICAgICAgICAgLmVudGVyKClcclxuICAgICAgICAgICAgLmFwcGVuZChcInRoXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGZ1bmN0aW9uIChjb2x1bW4pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb2x1bW47XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vbignY2xpY2snLCBmdW5jdGlvbiAoZCwgaSkge1xyXG4gICAgICAgICAgICAgICAgdGFibGUuc29ydChpLCB0YWJsZS5zb3J0QXNjZW5kaW5nKTtcclxuICAgICAgICAgICAgICAgIHRhYmxlLnNvcnRBc2NlbmRpbmcgPSAhdGFibGUuc29ydEFzY2VuZGluZzsgLy8gZm9yIHRoZSBuZXh0IHRpbWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7IC8vIGZvciBjaGFpbmluZ1xyXG4gICAgfVxyXG5cclxuICAgIHNvcnQoaSwgYXNjZW5kaW5nID0gdHJ1ZSwgc3RhYmxlID0gZmFsc2UpIHtcclxuICAgICAgICAvLyBzb3J0IGRhdGEgYnkgaS10aCBjb2x1bW4sIGFzY2VuZGluZyBvciBkZXNjZW5kaW5nXHJcbiAgICAgICAgLy8gb3B0aW9uYWxseSB3aXRoIHN0YWJsZSBzb3J0IGFsZ28gKHNsb3dlci4uLilcclxuICAgICAgICBsZXQgdGggPSB0aGlzLnRoZWFkLnNlbGVjdEFsbCgndGgnKTtcclxuICAgICAgICB0aC5jbGFzc2VkKCdhZXMnLCBmYWxzZSkuY2xhc3NlZCgnZGVzJywgZmFsc2UpO1xyXG4gICAgICAgIGQzLnNlbGVjdCh0aFswXVtpXSkuY2xhc3NlZCgnYWVzJywgIWFzY2VuZGluZykuY2xhc3NlZCgnZGVzJywgYXNjZW5kaW5nKTtcclxuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuZGF0YSgpO1xyXG4gICAgICAgIGlmIChkYXRhLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzOyAvLyBmb3IgY2hhaW5pbmdcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghaXNBcnJheShkYXRhWzBdKSkgeyAvLyByb3dzIGFyZSBkaWN0c1xyXG4gICAgICAgICAgICBpID0gdGhpcy5jb2x1bW5zW2ldOyAvLyBpbmRleCBieSBmaWVsZFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGljID0gbmV3IEludGwuQ29sbGF0b3IoJ2VuJywgeyAnc2Vuc2l0aXZpdHknOiAnYmFzZScgfSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGYoeCwgeSkge1xyXG4gICAgICAgICAgICAvLyB1bml2ZXJzYWwgKD8pIGNvbXBhcmlzb25cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHggPSB4W2ldXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHggPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHkgPSB5W2ldXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHkgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh4ID09PSB5KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHggPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaWMuY29tcGFyZSh4LCB5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgdCA9PT0gJ251bWJlcicpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB4IC0geTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB4ID4geSA/IDEgOiAtMVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWFzY2VuZGluZykge1xyXG4gICAgICAgICAgICBsZXQgZmYgPSBmO1xyXG4gICAgICAgICAgICBmID0gZnVuY3Rpb24gKHgsIHkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmZih5LCB4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcGVyZm9ybWFuY2UgPSB3aW5kb3cucGVyZm9ybWFuY2UsXHJcbiAgICAgICAgICAgIHQwID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICAgICAgaWYgKHN0YWJsZSkge1xyXG4gICAgICAgICAgICBzaGFrZXJfc29ydChkYXRhLCBmKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkYXRhLnNvcnQoZik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZHJhdygpO1xyXG4gICAgICAgIGxldCBkdCA9IE1hdGgucm91bmQocGVyZm9ybWFuY2Uubm93KCkgLSB0MClcclxuICAgICAgICBpZiAoZHQgPiAxMDAwKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidGFibGUuc29ydCB0b29rIFwiICsgZHQgKyBcIiBtaWxsaXNlY29uZHMuXCIpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzOyAvLyBmb3IgY2hhaW5pbmdcclxuICAgIH1cclxuXHJcbiAgICByb3dBc0FycmF5KHJvdykge1xyXG4gICAgICAgIC8vIHJldHVybiByb3cgYXMgdGhlIGFycmF5IG9mIHZpc2libGUgY2VsbHNcclxuICAgICAgICBpZiAoIWlzQXJyYXkocm93KSkgeyAvLyBzdXBwb3NlIGl0J3MgYSBkaWN0XHJcbiAgICAgICAgICAgIHJvdyA9IHRoaXMuY29sdW1ucy5tYXAoZnVuY3Rpb24gKGQsIGkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByb3dbZF1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJvdztcclxuICAgIH1cclxuXHJcbiAgICByb3dBc1N0cmluZyhkLCBzZXAgPSAnXFx1MzAwMCcpIHtcclxuICAgICAgICAvLyBzZXAgaXMgYSB2ZXJ5IHVubGlrZWx5IGNoYXIgdG8gbWluaW1pemUgdGhlIHJpc2sgb2Ygd3JvbmcgcG9zaXRpdmUgd2hlbiBzZWFyY2hpbmdcclxuICAgICAgICByZXR1cm4gdGhpcy5yb3dBc0FycmF5KGQpLm1hcCh0aGlzLl9mb3JtYXQpLmpvaW4oc2VwKTtcclxuICAgIH1cclxuXHJcbiAgICBmaW5kSW5Sb3coZCwgd2hhdCkge1xyXG4gICAgICAgIC8vIHdoYXQgbXVzdCBiZSBpbiBsb3dlcmNhc2UgZm9yXHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm93QXNTdHJpbmcoZCkudG9Mb3dlckNhc2UoKS5pbmRleE9mKHdoYXQpXHJcbiAgICB9XHJcblxyXG4gICAgZmlsdGVyKGYpIHtcclxuICAgICAgICBpZiAoaXNGdW5jdGlvbihmKSkge1xyXG4gICAgICAgICAgICB0aGlzLl9maWx0ZXIgPSBmO1xyXG4gICAgICAgICAgICB0aGlzLmRyYXcoKTsgLy8gYXBwbHkgZmlsdGVyXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzOyAvLyBmb3IgY2hhaW5pbmdcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gYXNzdW1lIGYgaXMgYSBzZWxlY3Rpb24gb2YgYW4gaW5wdXQgZmllbGRcclxuICAgICAgICBsZXQgdGFibGUgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmZpbHRlcihmdW5jdGlvbiAoZCwgaSkge1xyXG4gICAgICAgICAgICAvLyBoZXJlLCB0aGlzIGlzIHRoZSBpbnB1dCBmaWVsZCwgd2hpY2ggaXMgLmJvdW5kXHJcbiAgICAgICAgICAgIGxldCBzID0gdGhpcy5wcm9wZXJ0eShcInZhbHVlXCIpOyAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzEzNjk3NTkvMTM5NTk3M1xyXG4gICAgICAgICAgICBpZiAocyA9PT0gJycpIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gdGFibGUuZmluZEluUm93KGQsIHMudG9Mb3dlckNhc2UoKSkgIT09IC0xXHJcbiAgICAgICAgfS5iaW5kKGYpKSAvLyBiaW5kIHRvIHRoZSBpbnB1dCBmaWVsZFxyXG5cclxuICAgICAgICBmLm9uKFwiaW5wdXRcIiwgZnVuY3Rpb24gKCkgeyAvLyBzZXQgdGhlIHVwZGF0ZSBldmVudCBvZiB0aGUgaW5wdXQgZmllbGRcclxuICAgICAgICAgICAgdGFibGUuZHJhdygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzOyAvLyBmb3IgY2hhaW5pbmdcclxuICAgIH1cclxuXHJcbiAgICByb3dpZChkKSB7XHJcbiAgICAgICAgLy8gcmV0dXJucyBhIHVuaXF1ZSBpZCBvZiByb3cgYXNzb2NpYXRlZCB0byBkYXRhIGRcclxuICAgICAgICBpZiAoaXNGdW5jdGlvbihkKSkge1xyXG4gICAgICAgICAgICB0aGlzLl9yb3dpZCA9IGQ7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzOyAvLyBmb3IgY2hhaW5pbmdcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9yb3dpZChkKVxyXG4gICAgfVxyXG5cclxuICAgIG9uKGUsIGYpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuY2FsbGJhY2tzW2VdID0gZi5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHJldHVybiB0aGlzOyAvLyBmb3IgY2hhaW5pbmdcclxuICAgIH1cclxuXHJcbiAgICAvLyBydW5cclxuICAgIGRhdGEoZCkge1xyXG4gICAgICAgIGlmIChkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX19kYXRhX187XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX19kYXRhX18gPSBkO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRyYXcoKTtcclxuICAgIH1cclxuXHJcbiAgICBkcmF3KCkge1xyXG4gICAgICAgIGxldCB0YWJsZSA9IHRoaXM7XHJcbiAgICAgICAgbGV0IGQgPSB0aGlzLmRhdGEoKTtcclxuICAgICAgICBpZiAoZC5sZW5ndGggPT09IDApIHJldHVybiB0YWJsZTtcclxuICAgICAgICBkID0gZC5maWx0ZXIodGFibGUuX2ZpbHRlcik7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoZnVuY3Rpb24gKGkpIHtcclxuICAgICAgICAgICAgbGV0IHJvdyA9IHRhYmxlLnJvd0FzQXJyYXkoZFtpXSk7XHJcbiAgICAgICAgICAgIHJldHVybiAnPHRyICdcclxuICAgICAgICAgICAgICAgICsgJ2lkPVwicicgKyB0YWJsZS5yb3dpZChkW2ldKSArICdcIiAnIC8vIHdheSB0byBmaW5kIHRoZSBkYXRhIGJhY2sgZm9yIHNlbGVjdGlvbi4gaWQgbXVzdCBzdGFydCB3aXRoIG5vbiBudW1lcmljXHJcbiAgICAgICAgICAgICAgICArICgoaSBpbiB0YWJsZS5fc2VsZWN0ZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgPyAnY2xhc3M9XCJoaWdobGlnaHRcIidcclxuICAgICAgICAgICAgICAgICAgICA6ICcnKSAgLy8gbm8gaGFuZGllciB3YXkgdG8gc2VsZWN0IGEgaGlkZGVuIHJvdyAuLi5cclxuICAgICAgICAgICAgICAgICsgJz4nXHJcbiAgICAgICAgICAgICAgICArIHJvdy5tYXAoZnVuY3Rpb24gKGNlbGwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJzx0ZD4nICsgKGNlbGwgPT09IHVuZGVmaW5lZCA/ICcnIDogdGFibGUuX2Zvcm1hdChjZWxsKSkgKyAnPC90ZD4nO1xyXG4gICAgICAgICAgICAgICAgfSkuam9pbignJylcclxuICAgICAgICAgICAgICAgICsgJzwvdHI+J1xyXG4gICAgICAgIH1cclxuICAgICAgICAgICAgLFxyXG4gICAgICAgICAgICBkLmxlbmd0aFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRhYmxlLnJlc2l6ZSgpOyAvLyByZWRyYXdcclxuICAgICAgICByZXR1cm4gdGFibGU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZXZlbnRzXHJcblxyXG4gICAgcmVzaXplKCkge1xyXG4gICAgICAgIGxldCB0YWJsZSA9IHRoaXM7XHJcbiAgICAgICAgLy8gTWFrZXMgaGVhZGVyIGNvbHVtbnMgZXF1YWwgd2lkdGggdG8gY29udGVudCBjb2x1bW5zXHJcbiAgICAgICAgbGV0IHNjcm9sbEJhcldpZHRoID0gd2lkdGgodGhpcy5lbGVtZW50KVswXSAtIHdpZHRoKHRoaXMucm93cylbMF0sXHJcbiAgICAgICAgICAgIHRkID0gdGhpcy5yb3dzLnNlbGVjdCgndHI6bm90KC5jbHVzdGVyaXplLWV4dHJhLXJvdyknKS5zZWxlY3RBbGwoJ3RkJyksXHJcbiAgICAgICAgICAgIHcgPSB3aWR0aCh0ZCk7XHJcbiAgICAgICAgd1t3Lmxlbmd0aCAtIDFdICs9IHNjcm9sbEJhcldpZHRoO1xyXG4gICAgICAgIHdpZHRoKHRoaXMudGhlYWQuc2VsZWN0QWxsKCd0aCcpLCB3KTtcclxuXHJcbiAgICAgICAgLy8gKHJlKWF0dGFjaCBldmVudHMgdG8gcm93c1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBmZXZlbnQoKSB7XHJcbiAgICAgICAgICAgIGxldCBlID0gZDMuZXZlbnQ7XHJcbiAgICAgICAgICAgIGlmIChlLnR5cGUgaW4gdGFibGUub3B0aW9ucy5jYWxsYmFja3MpIHsgLy8gaGFuZGxlIGl0XHJcbiAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0ID0gZS50YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0LnRhZ05hbWUgPT0gJ1REJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnRFbGVtZW50OyAvLyBldmVudHMgYXJlIG9uIHJvd3MgKGZvciBub3cpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyByZXRyaWV2ZSB0aGUgZGF0YSAoVE9ETzogdGhlcmUgc2hvdWxkIGJlIGEgcXVpY2tlciB3YXkuLi4pXHJcbiAgICAgICAgICAgICAgICBsZXQgaSA9IHRhcmdldC5pZC5zdWJzdHIoMSksICAvL2dldCB0ciAjaWRcclxuICAgICAgICAgICAgICAgICAgICBkID0gdGFibGUuZGF0YSgpLmZpbmQoZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhYmxlLnJvd2lkKGQpID09IGlcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0YWJsZS5vcHRpb25zLmNhbGxiYWNrc1tlLnR5cGVdKGQsIGkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJvd3Muc2VsZWN0QWxsKFwidHJcIilcclxuICAgICAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsIGZldmVudClcclxuICAgICAgICAgICAgLm9uKFwibW91c2VsZWF2ZVwiLCBmZXZlbnQpXHJcbiAgICAgICAgICAgIC5vbihcImNsaWNrXCIsIGZldmVudClcclxuICAgICAgICAgICAgLm9uKFwiZGJsY2xpY2tcIiwgZmV2ZW50KVxyXG4gICAgICAgICAgICAuY2xhc3NlZChcImhpZ2hsaWdodFwiLCBmdW5jdGlvbiAoZCwgaSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhYmxlLl9zZWxlY3RlZC5oYXMoaSk7XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgIHJldHVybiB0YWJsZTtcclxuICAgIH1cclxuXHJcbiAgICBhZGQobmV3ZGF0YSwgaSA9IC0xKSB7XHJcbiAgICAgICAgLy8gbWVyZ2UgYW5kIHNvcnQgZGF0YSB3aXRoIGN1cnJlbnRcclxuICAgICAgICAvLyBkb24ndCByZW5hbWUgaXQgXCJhcHBlbmRcIiB0byBhdm9pZCBjb25mbGljdHMgd2l0aCBDbHVzdGVyaXplIGFuZC9vciBEM1xyXG4gICAgICAgIHRoaXMuX19kYXRhX18gPSB0aGlzLmRhdGEoKS5jb25jYXQobmV3ZGF0YSk7XHJcbiAgICAgICAgaWYgKGkgPj0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnNvcnQoaSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgc2Nyb2xsVG8oZCwgbXMgPSAxMDAwKSB7XHJcbiAgICAgICAgLy8gc21vb3RoIHNjcm9sbCB0byBkYXRhIGQgaW4gbXMgbWlsbGlzZWNvbmRzXHJcbiAgICAgICAgbGV0IHRhYmxlID0gdGhpcyxcclxuICAgICAgICAgICAgbGVuZ3RoID0gdGhpcy5kYXRhKCkuZmlsdGVyKHRoaXMuX2ZpbHRlcikubGVuZ3RoLFxyXG4gICAgICAgICAgICBub2RlID0gdGhpcy5zY3JvbGwubm9kZSgpLFxyXG4gICAgICAgICAgICBmID0gbm9kZS5zY3JvbGxIZWlnaHQgLyBsZW5ndGgsXHJcbiAgICAgICAgICAgIG5saW5lcyA9IG5vZGUuY2xpZW50SGVpZ2h0IC8gZixcclxuICAgICAgICAgICAgbGluZSA9IHRoaXMuZmluZEluZGV4KGQpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBzY3JvbGxUd2VlbihvZmZzZXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGxldCBpID0gZDMuaW50ZXJwb2xhdGVOdW1iZXIobm9kZS5zY3JvbGxUb3AsIG9mZnNldCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBub2RlLnNjcm9sbFRvcCA9IGkodCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yb3dzLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAuZHVyYXRpb24obXMpXHJcbiAgICAgICAgICAgIC5lYWNoKFwiZW5kXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRhYmxlLnNlbGVjdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICAgLnR3ZWVuKFwic2Nyb2xsXCIsIHNjcm9sbFR3ZWVuKFxyXG4gICAgICAgICAgICAgICAgKGxpbmUgLSBNYXRoLnJvdW5kKG5saW5lcyAvIDIpKSAqIGZcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICAgIDtcclxuICAgICAgICByZXR1cm4gdGhpczsgLy8gZm9yIGNoYWluaW5nXHJcbiAgICB9XHJcblxyXG4gICAgaW5kZXhPZihkKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YSgpLmZpbHRlcih0aGlzLl9maWx0ZXIpLmluZGV4T2YoZCk7XHJcbiAgICB9XHJcblxyXG4gICAgZmluZChkKSB7XHJcbiAgICAgICAgbGV0IHRhYmxlID0gdGhpcyxcclxuICAgICAgICAgICAgaWQgPSB0YWJsZS5yb3dpZChkKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhKCkuZmlsdGVyKHRoaXMuX2ZpbHRlcikuZmluZChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0YWJsZS5yb3dpZChlKSA9PT0gaWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApXHJcbiAgICB9XHJcbiAgICBmaW5kSW5kZXgoZCkge1xyXG4gICAgICAgIGxldCB0YWJsZSA9IHRoaXMsXHJcbiAgICAgICAgICAgIGlkID0gdGFibGUucm93aWQoZCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YSgpLmZpbHRlcih0aGlzLl9maWx0ZXIpLmZpbmRJbmRleChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0YWJsZS5yb3dpZChlKSA9PT0gaWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApXHJcbiAgICB9XHJcblxyXG5cclxuICAgIHNlbGVjdChkLCBpKSB7XHJcbiAgICAgICAgbGV0IHRhYmxlID0gdGhpcztcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGlnaGxpZ2h0KGkpIHtcclxuICAgICAgICAgICAgdGFibGUuX3NlbGVjdGVkLmFkZChpKTtcclxuICAgICAgICAgICAgbGV0IHRyID0gdGFibGUucm93cy5zZWxlY3QoXCIjclwiICsgaSk7XHJcbiAgICAgICAgICAgIHRyLmNsYXNzZWQoXCJoaWdobGlnaHRcIiwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmIChkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkLmZvckVhY2goaGlnaGxpZ2h0KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaSA9IHRoaXMucm93aWQoZClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGhpZ2hsaWdodChpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7IC8vIGZvciBjaGFpbmluZ1xyXG4gICAgfVxyXG5cclxuICAgIGRlc2VsZWN0KGQsIGkpIHtcclxuICAgICAgICBpZiAoaSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmIChkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkLmNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaSA9IHRoaXMucm93aWQoZClcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWQuZGVsZXRlKGkpO1xyXG4gICAgICAgIGxldCB0ciA9IHRoaXMucm93cy5zZWxlY3QoXCIjclwiICsgaSk7XHJcbiAgICAgICAgdHIuY2xhc3NlZChcImhpZ2hsaWdodFwiLCBmYWxzZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7IC8vIGZvciBjaGFpbmluZ1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8gZmlyc3QgYW5kIGxhc3Qgb2YgYSBzZWxlY3Rpb25cclxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI1NDEzNTM0LzEzOTU5NzNcclxuZDNcclxuICAgIC5zZWxlY3Rpb25cclxuICAgIC5wcm90b3R5cGVcclxuICAgIC5maXJzdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gZDMuc2VsZWN0KHRoaXNbMF1bMF0pO1xyXG4gICAgfTtcclxuZDNcclxuICAgIC5zZWxlY3Rpb25cclxuICAgIC5wcm90b3R5cGVcclxuICAgIC5sYXN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBsYXN0ID0gdGhpcy5zaXplKCkgLSAxO1xyXG4gICAgICAgIHJldHVybiBkMy5zZWxlY3QodGhpc1swXVtsYXN0XSk7XHJcbiAgICB9O1xyXG5cclxuLy8gdXRpbGl0eSBmdW5jdGlvbnNcclxuXHJcbmZ1bmN0aW9uIHdpZHRoKHNlbCwgdmFsdWUpIHtcclxuICAgIC8vIG1pbWljcyBqUXVlcnkgZm9yIEQzIGh0dHBzOi8vYXBpLmpxdWVyeS5jb20vY2F0ZWdvcnkvZGltZW5zaW9ucy9cclxuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7IC8vIGdldFxyXG4gICAgICAgIGxldCB3ID0gW107XHJcbiAgICAgICAgc2VsLmVhY2goZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgdy5wdXNoKHRoaXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB3O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7IC8vIHNldFxyXG4gICAgICAgIHNlbC5zdHlsZShcIndpZHRoXCIsIGZ1bmN0aW9uIChkLCBpKSB7XHJcbiAgICAgICAgICAgIGxldCB3ID0gdmFsdWVbaV07XHJcbiAgICAgICAgICAgIHJldHVybiB3ICsgXCJweFwiO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzZWw7IC8vIGZvciBjaGFpbmluZ1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gdW5pcXVlSWQoKSB7XHJcbiAgICAvLyBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9nb3Jkb25icmFuZGVyLzIyMzAzMTdcclxuICAgIC8vIE1hdGgucmFuZG9tIHNob3VsZCBiZSB1bmlxdWUgYmVjYXVzZSBvZiBpdHMgc2VlZGluZyBhbGdvcml0aG0uXHJcbiAgICAvLyBDb252ZXJ0IGl0IHRvIGJhc2UgMzYgKG51bWJlcnMgKyBsZXR0ZXJzKSwgYW5kIGdyYWIgdGhlIGZpcnN0IDkgY2hhcmFjdGVyc1xyXG4gICAgLy8gYWZ0ZXIgdGhlIGRlY2ltYWwuXHJcbiAgICByZXR1cm4gXCJfXCIgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHIoMiwgOSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNoYWtlcl9zb3J0KGxpc3QsIGNvbXBfZnVuYykge1xyXG4gICAgLy8gQSBzdGFibGUgc29ydCBmdW5jdGlvbiB0byBhbGxvdyBtdWx0aS1sZXZlbCBzb3J0aW5nIG9mIGRhdGFcclxuICAgIC8vIHNlZTogaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Db2NrdGFpbF9zb3J0XHJcbiAgICAvLyB0aGFua3MgdG8gSm9zZXBoIE5haG1pYXNcclxuICAgIGxldCBiID0gMDtcclxuICAgIGxldCB0ID0gbGlzdC5sZW5ndGggLSAxO1xyXG4gICAgbGV0IHN3YXAgPSB0cnVlO1xyXG5cclxuICAgIHdoaWxlIChzd2FwKSB7XHJcbiAgICAgICAgc3dhcCA9IGZhbHNlO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSBiOyBpIDwgdDsgKytpKSB7XHJcbiAgICAgICAgICAgIGlmIChjb21wX2Z1bmMobGlzdFtpXSwgbGlzdFtpICsgMV0pID4gMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHEgPSBsaXN0W2ldO1xyXG4gICAgICAgICAgICAgICAgbGlzdFtpXSA9IGxpc3RbaSArIDFdO1xyXG4gICAgICAgICAgICAgICAgbGlzdFtpICsgMV0gPSBxO1xyXG4gICAgICAgICAgICAgICAgc3dhcCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IC8vIGZvclxyXG4gICAgICAgIHQtLTtcclxuXHJcbiAgICAgICAgaWYgKCFzd2FwKSBicmVhaztcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IHQ7IGkgPiBiOyAtLWkpIHtcclxuICAgICAgICAgICAgaWYgKGNvbXBfZnVuYyhsaXN0W2ldLCBsaXN0W2kgLSAxXSkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcSA9IGxpc3RbaV07XHJcbiAgICAgICAgICAgICAgICBsaXN0W2ldID0gbGlzdFtpIC0gMV07XHJcbiAgICAgICAgICAgICAgICBsaXN0W2kgLSAxXSA9IHE7XHJcbiAgICAgICAgICAgICAgICBzd2FwID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gLy8gZm9yXHJcbiAgICAgICAgYisrO1xyXG5cclxuICAgIH0gLy8gd2hpbGUoc3dhcClcclxuICAgIHJldHVybiBsaXN0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGZuYykge1xyXG4gICAgLy9odHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNzM1NjUyOC8xMzk1OTczXHJcbiAgICByZXR1cm4gZm5jICYmIHt9LnRvU3RyaW5nLmNhbGwoZm5jKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcclxufVxyXG5cclxuZnVuY3Rpb24gaXNBcnJheShhcnIpIHtcclxuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJyKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcclxufVxyXG5cclxuZnVuY3Rpb24gZGljdFZhbHVlcyhkKSB7XHJcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoZCkubWFwKGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICByZXR1cm4gZFtrZXldO1xyXG4gICAgfSlcclxufSIsIm1vZHVsZS5leHBvcnRzID0gZDM7Il0sInNvdXJjZVJvb3QiOiIifQ==