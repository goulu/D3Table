var d3table =
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kM3RhYmxlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2QzdGFibGUvLi9zcmMvY2x1c3Rlcml6ZS5qcyIsIndlYnBhY2s6Ly9kM3RhYmxlLy4vc3JjL3RhYmxlLmpzIiwid2VicGFjazovL2QzdGFibGUvZXh0ZXJuYWwgXCJkM1wiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7QUNsRkE7QUFDQTtBQUNBLGdDQUFnQzs7QUFFaEMsQ0FBQztBQUNELE1BQU0sSUFBNEI7QUFDbEMsT0FBTyxFQUMwQjtBQUNqQyxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLHFCQUFxQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHdCQUF3QixpQkFBaUI7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrQkFBa0I7QUFDbEI7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixlQUFlO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSw4Q0FBOEMsUUFBUTtBQUN0RDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxD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dUIsT0FBTztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUEsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEM7Ozs7Ozs7Ozs7O0FDbGhCQSxvQiIsImZpbGUiOiJ0YWJsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3RhYmxlLmpzXCIpO1xuIiwiLyogQ2x1c3Rlcml6ZS5qcyAtIHYwLjE5LjAgLSAyMDIwLTA1LTE4XHJcbiBodHRwOi8vTmVYVHMuZ2l0aHViLmNvbS9DbHVzdGVyaXplLmpzL1xyXG4gQ29weXJpZ2h0IChjKSAyMDE1IERlbmlzIEx1a292OyBMaWNlbnNlZCBHUEx2MyAqL1xyXG5cclxuOyhmdW5jdGlvbiAobmFtZSwgZGVmaW5pdGlvbikge1xyXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnKSBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKTtcclxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT0gJ29iamVjdCcpIGRlZmluZShkZWZpbml0aW9uKTtcclxuICBlbHNlIHRoaXNbbmFtZV0gPSBkZWZpbml0aW9uKCk7XHJcbn0oJ0NsdXN0ZXJpemUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbiAgLy8gZGV0ZWN0IGllOSBhbmQgbG93ZXJcclxuICAvLyBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9wYWRvbHNleS81Mjc2ODMjY29tbWVudC03ODY2ODJcclxuICB2YXIgaWUgPSAoZnVuY3Rpb24oKXtcclxuICAgIGZvciggdmFyIHYgPSAzLFxyXG4gICAgICAgICAgICAgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdiJyksXHJcbiAgICAgICAgICAgICBhbGwgPSBlbC5hbGwgfHwgW107XHJcbiAgICAgICAgIGVsLmlubmVySFRNTCA9ICc8IS0tW2lmIGd0IElFICcgKyAoKyt2KSArICddPjxpPjwhW2VuZGlmXS0tPicsXHJcbiAgICAgICAgIGFsbFswXTtcclxuICAgICAgICl7fVxyXG4gICAgcmV0dXJuIHYgPiA0ID8gdiA6IGRvY3VtZW50LmRvY3VtZW50TW9kZTtcclxuICB9KCkpLFxyXG4gIGlzX21hYyA9IG5hdmlnYXRvci5wbGF0Zm9ybS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ21hYycpICsgMTtcclxuICBcclxuICB2YXIgQ2x1c3Rlcml6ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgIGlmKCAhICh0aGlzIGluc3RhbmNlb2YgQ2x1c3Rlcml6ZSkpXHJcbiAgICAgIHJldHVybiBuZXcgQ2x1c3Rlcml6ZShkYXRhKTtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICB2YXIgZGVmYXVsdHMgPSB7XHJcbiAgICAgIHJvd3NfaW5fYmxvY2s6IDUwLFxyXG4gICAgICBibG9ja3NfaW5fY2x1c3RlcjogNCxcclxuICAgICAgdGFnOiBudWxsLFxyXG4gICAgICBzaG93X25vX2RhdGFfcm93OiB0cnVlLFxyXG4gICAgICBub19kYXRhX2NsYXNzOiAnY2x1c3Rlcml6ZS1uby1kYXRhJyxcclxuICAgICAgbm9fZGF0YV90ZXh0OiAnTm8gZGF0YScsXHJcbiAgICAgIGtlZXBfcGFyaXR5OiB0cnVlLFxyXG4gICAgICBjYWxsYmFja3M6IHt9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHVibGljIHBhcmFtZXRlcnNcclxuICAgIHNlbGYub3B0aW9ucyA9IHt9O1xyXG4gICAgdmFyIG9wdGlvbnMgPSBbJ3Jvd3NfaW5fYmxvY2snLCAnYmxvY2tzX2luX2NsdXN0ZXInLCAnc2hvd19ub19kYXRhX3JvdycsICdub19kYXRhX2NsYXNzJywgJ25vX2RhdGFfdGV4dCcsICdrZWVwX3Bhcml0eScsICd0YWcnLCAnY2FsbGJhY2tzJ107XHJcbiAgICBmb3IodmFyIGkgPSAwLCBvcHRpb247IG9wdGlvbiA9IG9wdGlvbnNbaV07IGkrKykge1xyXG4gICAgICBzZWxmLm9wdGlvbnNbb3B0aW9uXSA9IHR5cGVvZiBkYXRhW29wdGlvbl0gIT0gJ3VuZGVmaW5lZCcgJiYgZGF0YVtvcHRpb25dICE9IG51bGxcclxuICAgICAgICA/IGRhdGFbb3B0aW9uXVxyXG4gICAgICAgIDogZGVmYXVsdHNbb3B0aW9uXTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZWxlbXMgPSBbJ3Njcm9sbCcsICdjb250ZW50J107XHJcbiAgICBmb3IodmFyIGkgPSAwLCBlbGVtOyBlbGVtID0gZWxlbXNbaV07IGkrKykge1xyXG4gICAgICBzZWxmW2VsZW0gKyAnX2VsZW0nXSA9IGRhdGFbZWxlbSArICdJZCddXHJcbiAgICAgICAgPyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkYXRhW2VsZW0gKyAnSWQnXSlcclxuICAgICAgICA6IGRhdGFbZWxlbSArICdFbGVtJ107XHJcbiAgICAgIGlmKCAhIHNlbGZbZWxlbSArICdfZWxlbSddKVxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkVycm9yISBDb3VsZCBub3QgZmluZCBcIiArIGVsZW0gKyBcIiBlbGVtZW50XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHRhYmluZGV4IGZvcmNlcyB0aGUgYnJvd3NlciB0byBrZWVwIGZvY3VzIG9uIHRoZSBzY3JvbGxpbmcgbGlzdCwgZml4ZXMgIzExXHJcbiAgICBpZiggISBzZWxmLmNvbnRlbnRfZWxlbS5oYXNBdHRyaWJ1dGUoJ3RhYmluZGV4JykpXHJcbiAgICAgIHNlbGYuY29udGVudF9lbGVtLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAwKTtcclxuXHJcbiAgICAvLyBwcml2YXRlIHBhcmFtZXRlcnNcclxuXHJcbiAgICB2YXIgbnJvd3MgPSAoZGF0YS5ucm93cyAhPT0gdW5kZWZpbmVkKSA/IGRhdGEubnJvd3MgOiAwXHJcbiAgICB2YXIgZnJvdyA9IGZ1bmN0aW9uIChpKSB7XHJcbiAgICAgIHJldHVybiAnJ1xyXG4gICAgfTsgLy8gZnVuY3Rpb24gdGhhdCByZXR1cm5zIGktdGggcm93IGFzIEhUTUwgdGV4dFxyXG5cclxuICAgIHZhciBfcm93cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgLy8gcHJpdmF0ZSBmdW5jdGlvbiB0aGF0IHJlYnVpbGRzIHRoZSBhcnJheSBmb3IgYXBwZW5kK3ByZXBlbmQrZGVzdHJveVxyXG4gICAgICB2YXIgYXJyID0gQXJyYXkuYXBwbHkobnVsbCwgQXJyYXkobnJvd3MpKTtcclxuICAgICAgYXJyID0gYXJyLm1hcChmdW5jdGlvbiAoeCwgaSkge1xyXG4gICAgICAgIHJldHVybiBmcm93KGkpXHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gYXJyXHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGFkZCA9IGZ1bmN0aW9uIChuZXdfcm93cywgd2hlcmUgPSBcImFwcGVuZFwiKSB7XHJcbiAgICAgIGlmIChpc0FycmF5KG5ld19yb3dzKSkgeyAvLyB0aGUgXCJjbGFzc2ljXCIgY2FzZVxyXG4gICAgICAgIHZhciBhcnIgPSAod2hlcmUgPT0gJ2FwcGVuZCcpXHJcbiAgICAgICAgICA/IF9yb3dzKCkuY29uY2F0KG5ld19yb3dzKVxyXG4gICAgICAgICAgOiBuZXdfcm93cy5jb25jYXQoX3Jvd3MoKSk7XHJcbiAgICAgICAgZnJvdyA9IGZ1bmN0aW9uIChpKSB7XHJcbiAgICAgICAgICByZXR1cm4gYXJyW2ldXHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5yb3dzICs9IG5ld19yb3dzLmxlbmd0aDtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmIChpc0Z1bmN0aW9uKG5ld19yb3dzKSkgeyAvLyByb3dzIGRlZmluZWQgYnkgYSBmdW5jdGlvblxyXG4gICAgICAgIGZyb3cgPSBuZXdfcm93cztcclxuICAgICAgICAvLyBucm93cyBzaG91bGQgYmUgYXNzaWduZWQgc2VwYXJhdGVseVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGRhdGEucm93cyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGFkZChkYXRhLnJvd3MpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGFkZCh0aGlzLmZldGNoTWFya3VwKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBjYWNoZSA9IHt9LFxyXG4gICAgICBzY3JvbGxfdG9wID0gc2VsZi5zY3JvbGxfZWxlbS5zY3JvbGxUb3A7XHJcblxyXG4gICAgLy8gYXBwZW5kIGluaXRpYWwgZGF0YVxyXG4gICAgc2VsZi5pbnNlcnRUb0RPTShmcm93LCBucm93cywgY2FjaGUpO1xyXG5cclxuICAgIC8vIHJlc3RvcmUgdGhlIHNjcm9sbCBwb3NpdGlvblxyXG4gICAgc2VsZi5zY3JvbGxfZWxlbS5zY3JvbGxUb3AgPSBzY3JvbGxfdG9wO1xyXG5cclxuICAgIC8vIGFkZGluZyBzY3JvbGwgaGFuZGxlclxyXG4gICAgdmFyIGxhc3RfY2x1c3RlciA9IGZhbHNlLFxyXG4gICAgc2Nyb2xsX2RlYm91bmNlID0gMCxcclxuICAgIHBvaW50ZXJfZXZlbnRzX3NldCA9IGZhbHNlLFxyXG4gICAgc2Nyb2xsRXYgPSBmdW5jdGlvbigpIHtcclxuICAgICAgLy8gZml4ZXMgc2Nyb2xsaW5nIGlzc3VlIG9uIE1hYyAjM1xyXG4gICAgICBpZiAoaXNfbWFjKSB7XHJcbiAgICAgICAgICBpZiggISBwb2ludGVyX2V2ZW50c19zZXQpIHNlbGYuY29udGVudF9lbGVtLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XHJcbiAgICAgICAgICBwb2ludGVyX2V2ZW50c19zZXQgPSB0cnVlO1xyXG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHNjcm9sbF9kZWJvdW5jZSk7XHJcbiAgICAgICAgICBzY3JvbGxfZGVib3VuY2UgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICBzZWxmLmNvbnRlbnRfZWxlbS5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ2F1dG8nO1xyXG4gICAgICAgICAgICAgIHBvaW50ZXJfZXZlbnRzX3NldCA9IGZhbHNlO1xyXG4gICAgICAgICAgfSwgNTApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobGFzdF9jbHVzdGVyICE9IChsYXN0X2NsdXN0ZXIgPSBzZWxmLmdldENsdXN0ZXJOdW0oKSkpXHJcbiAgICAgICAgICBzZWxmLmluc2VydFRvRE9NKGZyb3csIG5yb3dzLCBjYWNoZSk7XHJcbiAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5jYWxsYmFja3Muc2Nyb2xsaW5nUHJvZ3Jlc3MpXHJcbiAgICAgICAgICBzZWxmLm9wdGlvbnMuY2FsbGJhY2tzLnNjcm9sbGluZ1Byb2dyZXNzKHNlbGYuZ2V0U2Nyb2xsUHJvZ3Jlc3MoKSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIHJlc2l6ZV9kZWJvdW5jZSA9IDAsXHJcbiAgICAgIHJlc2l6ZUV2ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNsZWFyVGltZW91dChyZXNpemVfZGVib3VuY2UpO1xyXG4gICAgICAgIHJlc2l6ZV9kZWJvdW5jZSA9IHNldFRpbWVvdXQoc2VsZi5yZWZyZXNoLCAxMDApO1xyXG4gICAgICB9XHJcbiAgICBvbignc2Nyb2xsJywgc2VsZi5zY3JvbGxfZWxlbSwgc2Nyb2xsRXYpO1xyXG4gICAgb24oJ3Jlc2l6ZScsIHdpbmRvdywgcmVzaXplRXYpO1xyXG5cclxuICAgIC8vIHB1YmxpYyBtZXRob2RzXHJcbiAgICBzZWxmLmRlc3Ryb3kgPSBmdW5jdGlvbiAoY2xlYW4pIHtcclxuICAgICAgb2ZmKCdzY3JvbGwnLCBzZWxmLnNjcm9sbF9lbGVtLCBzY3JvbGxFdik7XHJcbiAgICAgIG9mZigncmVzaXplJywgd2luZG93LCByZXNpemVFdik7XHJcbiAgICAgIHNlbGYuaHRtbCgoY2xlYW4gPyBzZWxmLmdlbmVyYXRlRW1wdHlSb3coKSA6IF9yb3dzKCkpLmpvaW4oJycpKTtcclxuICAgIH1cclxuICAgIHNlbGYucmVmcmVzaCA9IGZ1bmN0aW9uIChmb3JjZSkge1xyXG4gICAgICBpZiAoc2VsZi5nZXRSb3dzSGVpZ2h0KG5yb3dzKSB8fCBmb3JjZSkgc2VsZi51cGRhdGUoZnJvdyxucm93cyk7XHJcbiAgICB9XHJcbiAgICBzZWxmLnVwZGF0ZSA9IGZ1bmN0aW9uIChuZXdfcm93cywgbmV3X25yb3dzID0gMCkge1xyXG4gICAgICAvLyBhIG5ld19ucm93cyBzaG91bGQgYmUgc3BlY2lmaWVkIGlmIG5ld19yb3dzIGlzIGEgZnVuY3Rpb24sIG90aGVyd2lzZSBpdCdzIHJlY2FsY3VsYXRlZFxyXG4gICAgICBucm93cyA9IG5ld19ucm93cztcclxuICAgICAgYWRkKG5ld19yb3dzKTtcclxuICAgICAgdmFyIHNjcm9sbF90b3AgPSBzZWxmLnNjcm9sbF9lbGVtLnNjcm9sbFRvcDtcclxuICAgICAgLy8gZml4ZXMgIzM5XHJcbiAgICAgIGlmIChucm93cyAqIHNlbGYub3B0aW9ucy5pdGVtX2hlaWdodCA8IHNjcm9sbF90b3ApIHtcclxuICAgICAgICBzZWxmLnNjcm9sbF9lbGVtLnNjcm9sbFRvcCA9IDA7XHJcbiAgICAgICAgbGFzdF9jbHVzdGVyID0gMDtcclxuICAgICAgfVxyXG4gICAgICBzZWxmLmluc2VydFRvRE9NKGZyb3csIG5yb3dzLCBjYWNoZSk7XHJcbiAgICAgIHNlbGYuc2Nyb2xsX2VsZW0uc2Nyb2xsVG9wID0gc2Nyb2xsX3RvcDtcclxuICAgIH1cclxuICAgIHNlbGYuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHNlbGYudXBkYXRlKFtdLDApO1xyXG4gICAgfVxyXG4gICAgc2VsZi5nZXRSb3dzQW1vdW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gbnJvd3M7XHJcbiAgICB9XHJcbiAgICBzZWxmLmdldFNjcm9sbFByb2dyZXNzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnNjcm9sbF90b3AgLyAobnJvd3MgKiB0aGlzLm9wdGlvbnMuaXRlbV9oZWlnaHQpICogMTAwIHx8IDA7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5hcHBlbmQgPSBmdW5jdGlvbiAocm93cykge1xyXG4gICAgICBhZGQocm93cywgJ2FwcGVuZCcsKTtcclxuICAgICAgc2VsZi5pbnNlcnRUb0RPTShmcm93LCBucm93cywgY2FjaGUpO1xyXG4gICAgfVxyXG4gICAgc2VsZi5wcmVwZW5kID0gZnVuY3Rpb24gKHJvd3MpIHtcclxuICAgICAgYWRkKHJvd3MsICdwcmVwZW5kJyk7XHJcbiAgICAgIHNlbGYuaW5zZXJ0VG9ET00oZnJvdywgbnJvd3MsIGNhY2hlKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBDbHVzdGVyaXplLnByb3RvdHlwZSA9IHtcclxuICAgIGNvbnN0cnVjdG9yOiBDbHVzdGVyaXplLFxyXG4gICAgLy8gZmV0Y2ggZXhpc3RpbmcgbWFya3VwXHJcbiAgICBmZXRjaE1hcmt1cDogZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgcm93cyA9IFtdLCByb3dzX25vZGVzID0gdGhpcy5nZXRDaGlsZE5vZGVzKHRoaXMuY29udGVudF9lbGVtKTtcclxuICAgICAgd2hpbGUgKHJvd3Nfbm9kZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgcm93cy5wdXNoKHJvd3Nfbm9kZXMuc2hpZnQoKS5vdXRlckhUTUwpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiByb3dzO1xyXG4gICAgfSxcclxuICAgIC8vIGdldCB0YWcgbmFtZSwgY29udGVudCB0YWcgbmFtZSwgdGFnIGhlaWdodCwgY2FsYyBjbHVzdGVyIGhlaWdodFxyXG4gICAgZXhwbG9yZUVudmlyb25tZW50OiBmdW5jdGlvbiAoZnJvdywgbnJvd3MsIGNhY2hlKSB7XHJcbiAgICAgIHZhciBvcHRzID0gdGhpcy5vcHRpb25zO1xyXG4gICAgICBvcHRzLmNvbnRlbnRfdGFnID0gdGhpcy5jb250ZW50X2VsZW0udGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICBpZiAoIW5yb3dzKSByZXR1cm47XHJcbiAgICAgIGlmIChpZSAmJiBpZSA8PSA5ICYmICFvcHRzLnRhZykge1xyXG4gICAgICAgIG9wdHMudGFnID0gZnJvdygwKS5tYXRjaCgvPChbXj5cXHMvXSopLylbMV0udG9Mb3dlckNhc2UoKTtcclxuICAgICAgfVxyXG4gICAgICB2YXIgbmNoaWxkcmVuID0gdGhpcy5jb250ZW50X2VsZW0uY2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgICBpZiAoIW9wdHMudGFnKSB7XHJcbiAgICAgICAgb3B0cy50YWcgPSB0aGlzLmNvbnRlbnRfZWxlbS5jaGlsZHJlblswXS50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKG5jaGlsZHJlbiA8PSAxKSB7XHJcbiAgICAgICAgLy8gd2hhdCdzIHRoZSBwdXJwb3NlIG9mIHRoaXMgPz8/IGl0IG1heSBjbGVhciB0aGUgaHRtbCBjb250ZW50IC4uLlxyXG4gICAgICAgIGNhY2hlLmRhdGEgPSB0aGlzLmh0bWwoZnJvdygwKSArIGZyb3coMCkgKyBmcm93KDApKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmdldFJvd3NIZWlnaHQobnJvd3MpO1xyXG4gICAgfSxcclxuICAgIGdldFJvd3NIZWlnaHQ6IGZ1bmN0aW9uIChucm93cykge1xyXG4gICAgICB2YXIgb3B0cyA9IHRoaXMub3B0aW9ucyxcclxuICAgICAgICBwcmV2X2l0ZW1faGVpZ2h0ID0gb3B0cy5pdGVtX2hlaWdodDtcclxuICAgICAgb3B0cy5jbHVzdGVyX2hlaWdodCA9IDA7XHJcbiAgICAgIGlmICghbnJvd3MpIHJldHVybjtcclxuICAgICAgdmFyIG5vZGVzID0gdGhpcy5jb250ZW50X2VsZW0uY2hpbGRyZW47XHJcbiAgICAgIGlmICghbm9kZXMubGVuZ3RoKSByZXR1cm47XHJcbiAgICAgIHZhciBub2RlID0gbm9kZXNbTWF0aC5mbG9vcihub2Rlcy5sZW5ndGggLyAyKV07XHJcbiAgICAgIG9wdHMuaXRlbV9oZWlnaHQgPSBub2RlLm9mZnNldEhlaWdodDtcclxuICAgICAgLy8gY29uc2lkZXIgdGFibGUncyBib3JkZXItc3BhY2luZ1xyXG4gICAgICBpZiAob3B0cy50YWcgPT0gJ3RyJyAmJiBnZXRTdHlsZSgnYm9yZGVyQ29sbGFwc2UnLCB0aGlzLmNvbnRlbnRfZWxlbSkgIT0gJ2NvbGxhcHNlJylcclxuICAgICAgICBvcHRzLml0ZW1faGVpZ2h0ICs9IHBhcnNlSW50KGdldFN0eWxlKCdib3JkZXJTcGFjaW5nJywgdGhpcy5jb250ZW50X2VsZW0pLCAxMCkgfHwgMDtcclxuICAgICAgLy8gY29uc2lkZXIgbWFyZ2lucyAoYW5kIG1hcmdpbnMgY29sbGFwc2luZylcclxuICAgICAgaWYgKG9wdHMudGFnICE9ICd0cicpIHtcclxuICAgICAgICB2YXIgbWFyZ2luVG9wID0gcGFyc2VJbnQoZ2V0U3R5bGUoJ21hcmdpblRvcCcsIG5vZGUpLCAxMCkgfHwgMDtcclxuICAgICAgICB2YXIgbWFyZ2luQm90dG9tID0gcGFyc2VJbnQoZ2V0U3R5bGUoJ21hcmdpbkJvdHRvbScsIG5vZGUpLCAxMCkgfHwgMDtcclxuICAgICAgICBvcHRzLml0ZW1faGVpZ2h0ICs9IE1hdGgubWF4KG1hcmdpblRvcCwgbWFyZ2luQm90dG9tKTtcclxuICAgICAgfVxyXG4gICAgICBvcHRzLmJsb2NrX2hlaWdodCA9IG9wdHMuaXRlbV9oZWlnaHQgKiBvcHRzLnJvd3NfaW5fYmxvY2s7XHJcbiAgICAgIG9wdHMucm93c19pbl9jbHVzdGVyID0gb3B0cy5ibG9ja3NfaW5fY2x1c3RlciAqIG9wdHMucm93c19pbl9ibG9jaztcclxuICAgICAgb3B0cy5jbHVzdGVyX2hlaWdodCA9IG9wdHMuYmxvY2tzX2luX2NsdXN0ZXIgKiBvcHRzLmJsb2NrX2hlaWdodDtcclxuICAgICAgcmV0dXJuIHByZXZfaXRlbV9oZWlnaHQgIT0gb3B0cy5pdGVtX2hlaWdodDtcclxuICAgIH0sXHJcbiAgICAvLyBnZXQgY3VycmVudCBjbHVzdGVyIG51bWJlclxyXG4gICAgZ2V0Q2x1c3Rlck51bTogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsX3RvcCA9IHRoaXMuc2Nyb2xsX2VsZW0uc2Nyb2xsVG9wO1xyXG4gICAgICByZXR1cm4gTWF0aC5mbG9vcih0aGlzLm9wdGlvbnMuc2Nyb2xsX3RvcCAvICh0aGlzLm9wdGlvbnMuY2x1c3Rlcl9oZWlnaHQgLSB0aGlzLm9wdGlvbnMuYmxvY2tfaGVpZ2h0KSkgfHwgMDtcclxuICAgIH0sXHJcbiAgICAvLyBnZW5lcmF0ZSBlbXB0eSByb3cgaWYgbm8gZGF0YSBwcm92aWRlZFxyXG4gICAgZ2VuZXJhdGVFbXB0eVJvdzogZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgb3B0cyA9IHRoaXMub3B0aW9ucztcclxuICAgICAgaWYgKCFvcHRzLnRhZyB8fCAhb3B0cy5zaG93X25vX2RhdGFfcm93KSByZXR1cm4gW107XHJcbiAgICAgIHZhciBlbXB0eV9yb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG9wdHMudGFnKSxcclxuICAgICAgICBub19kYXRhX2NvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShvcHRzLm5vX2RhdGFfdGV4dCksIHRkO1xyXG4gICAgICBlbXB0eV9yb3cuY2xhc3NOYW1lID0gb3B0cy5ub19kYXRhX2NsYXNzO1xyXG4gICAgICBpZiAob3B0cy50YWcgPT0gJ3RyJykge1xyXG4gICAgICAgIHRkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcclxuICAgICAgICAvLyBmaXhlcyAjNTNcclxuICAgICAgICB0ZC5jb2xTcGFuID0gMTAwO1xyXG4gICAgICAgIHRkLmFwcGVuZENoaWxkKG5vX2RhdGFfY29udGVudCk7XHJcbiAgICAgIH1cclxuICAgICAgZW1wdHlfcm93LmFwcGVuZENoaWxkKHRkIHx8IG5vX2RhdGFfY29udGVudCk7XHJcbiAgICAgIHJldHVybiBbZW1wdHlfcm93Lm91dGVySFRNTF07XHJcbiAgICB9LFxyXG4gICAgLy8gZ2VuZXJhdGUgY2x1c3RlciBmb3IgY3VycmVudCBzY3JvbGwgcG9zaXRpb25cclxuICAgIGdlbmVyYXRlOiBmdW5jdGlvbiAoZnJvdywgbnJvd3MsIGNsdXN0ZXJfbnVtKSB7XHJcbiAgICAgIHZhciBvcHRzID0gdGhpcy5vcHRpb25zO1xyXG4gICAgICAvKlxyXG4gICAgICBpZiAobnJvd3MgPCBvcHRzLnJvd3NfaW5fYmxvY2spIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdG9wX29mZnNldDogMCxcclxuICAgICAgICAgIGJvdHRvbV9vZmZzZXQ6IDAsXHJcbiAgICAgICAgICByb3dzX2Fib3ZlOiAwLFxyXG4gICAgICAgICAgcm93czogbnJvd3MgPyBmcm93IDogdGhpcy5nZW5lcmF0ZUVtcHR5Um93XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgICovXHJcbiAgICAgIHZhciBpdGVtc19zdGFydCA9IE1hdGgubWF4KChvcHRzLnJvd3NfaW5fY2x1c3RlciAtIG9wdHMucm93c19pbl9ibG9jaykgKiBjbHVzdGVyX251bSwgMCksXHJcbiAgICAgICAgaXRlbXNfZW5kID0gTWF0aC5taW4oaXRlbXNfc3RhcnQgKyBvcHRzLnJvd3NfaW5fY2x1c3RlciwgbnJvd3MpLFxyXG4gICAgICAgIHRvcF9vZmZzZXQgPSBNYXRoLm1heChpdGVtc19zdGFydCAqIG9wdHMuaXRlbV9oZWlnaHQsIDApLFxyXG4gICAgICAgIGJvdHRvbV9vZmZzZXQgPSBNYXRoLm1heCgobnJvd3MgLSBpdGVtc19lbmQpICogb3B0cy5pdGVtX2hlaWdodCwgMCksXHJcbiAgICAgICAgdGhpc19jbHVzdGVyX3Jvd3MgPSBbXSxcclxuICAgICAgICByb3dzX2Fib3ZlID0gaXRlbXNfc3RhcnQ7XHJcbiAgICAgIGlmICh0b3Bfb2Zmc2V0IDwgMSkge1xyXG4gICAgICAgIHJvd3NfYWJvdmUrKztcclxuICAgICAgfVxyXG4gICAgICBmb3IgKHZhciBpID0gaXRlbXNfc3RhcnQ7IGkgPCBpdGVtc19lbmQ7IGkrKykge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICB0aGlzX2NsdXN0ZXJfcm93cy5wdXNoKGZyb3coaSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICB0aGlzX2NsdXN0ZXJfcm93cy5wdXNoKHRoaXMuZ2VuZXJhdGVFbXB0eVJvdygpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0b3Bfb2Zmc2V0OiB0b3Bfb2Zmc2V0LFxyXG4gICAgICAgIGJvdHRvbV9vZmZzZXQ6IGJvdHRvbV9vZmZzZXQsXHJcbiAgICAgICAgcm93c19hYm92ZTogcm93c19hYm92ZSxcclxuICAgICAgICByb3dzOiB0aGlzX2NsdXN0ZXJfcm93c1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgcmVuZGVyRXh0cmFUYWc6IGZ1bmN0aW9uIChjbGFzc19uYW1lLCBoZWlnaHQpIHtcclxuICAgICAgdmFyIHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGhpcy5vcHRpb25zLnRhZyksXHJcbiAgICAgICAgY2x1c3Rlcml6ZV9wcmVmaXggPSAnY2x1c3Rlcml6ZS0nO1xyXG4gICAgICB0YWcuY2xhc3NOYW1lID0gW2NsdXN0ZXJpemVfcHJlZml4ICsgJ2V4dHJhLXJvdycsIGNsdXN0ZXJpemVfcHJlZml4ICsgY2xhc3NfbmFtZV0uam9pbignICcpO1xyXG4gICAgICBoZWlnaHQgJiYgKHRhZy5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnKTtcclxuICAgICAgcmV0dXJuIHRhZy5vdXRlckhUTUw7XHJcbiAgICB9LFxyXG4gICAgLy8gaWYgbmVjZXNzYXJ5IHZlcmlmeSBkYXRhIGNoYW5nZWQgYW5kIGluc2VydCB0byBET01cclxuICAgIGluc2VydFRvRE9NOiBmdW5jdGlvbiAoZnJvdywgbnJvd3MsIGNhY2hlKSB7XHJcbiAgICAgIC8vIGV4cGxvcmUgcm93J3MgaGVpZ2h0XHJcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmNsdXN0ZXJfaGVpZ2h0KSB7XHJcbiAgICAgICAgdGhpcy5leHBsb3JlRW52aXJvbm1lbnQoZnJvdywgbnJvd3MsIGNhY2hlKTtcclxuICAgICAgfVxyXG4gICAgICB2YXIgZGF0YSA9IHRoaXMuZ2VuZXJhdGUoZnJvdywgbnJvd3MsIHRoaXMuZ2V0Q2x1c3Rlck51bSgpKSxcclxuICAgICAgICB0aGlzX2NsdXN0ZXJfcm93cyA9IGRhdGEucm93cy5qb2luKCcnKSxcclxuICAgICAgICB0aGlzX2NsdXN0ZXJfY29udGVudF9jaGFuZ2VkID0gdGhpcy5jaGVja0NoYW5nZXMoJ2RhdGEnLCB0aGlzX2NsdXN0ZXJfcm93cywgY2FjaGUpLFxyXG4gICAgICAgIHRvcF9vZmZzZXRfY2hhbmdlZCA9IHRoaXMuY2hlY2tDaGFuZ2VzKCd0b3AnLCBkYXRhLnRvcF9vZmZzZXQsIGNhY2hlKSxcclxuICAgICAgICBvbmx5X2JvdHRvbV9vZmZzZXRfY2hhbmdlZCA9IHRoaXMuY2hlY2tDaGFuZ2VzKCdib3R0b20nLCBkYXRhLmJvdHRvbV9vZmZzZXQsIGNhY2hlKSxcclxuICAgICAgICBjYWxsYmFja3MgPSB0aGlzLm9wdGlvbnMuY2FsbGJhY2tzLFxyXG4gICAgICAgIGxheW91dCA9IFtdO1xyXG5cclxuICAgICAgaWYgKHRoaXNfY2x1c3Rlcl9jb250ZW50X2NoYW5nZWQgfHwgdG9wX29mZnNldF9jaGFuZ2VkKSB7XHJcbiAgICAgICAgaWYgKGRhdGEudG9wX29mZnNldCkge1xyXG4gICAgICAgICAgdGhpcy5vcHRpb25zLmtlZXBfcGFyaXR5ICYmIGxheW91dC5wdXNoKHRoaXMucmVuZGVyRXh0cmFUYWcoJ2tlZXAtcGFyaXR5JykpO1xyXG4gICAgICAgICAgbGF5b3V0LnB1c2godGhpcy5yZW5kZXJFeHRyYVRhZygndG9wLXNwYWNlJywgZGF0YS50b3Bfb2Zmc2V0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxheW91dC5wdXNoKHRoaXNfY2x1c3Rlcl9yb3dzKTtcclxuICAgICAgICBkYXRhLmJvdHRvbV9vZmZzZXQgJiYgbGF5b3V0LnB1c2godGhpcy5yZW5kZXJFeHRyYVRhZygnYm90dG9tLXNwYWNlJywgZGF0YS5ib3R0b21fb2Zmc2V0KSk7XHJcbiAgICAgICAgY2FsbGJhY2tzLmNsdXN0ZXJXaWxsQ2hhbmdlICYmIGNhbGxiYWNrcy5jbHVzdGVyV2lsbENoYW5nZSgpO1xyXG4gICAgICAgIHRoaXMuaHRtbChsYXlvdXQuam9pbignJykpO1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5jb250ZW50X3RhZyA9PSAnb2wnICYmIHRoaXMuY29udGVudF9lbGVtLnNldEF0dHJpYnV0ZSgnc3RhcnQnLCBkYXRhLnJvd3NfYWJvdmUpO1xyXG4gICAgICAgIHRoaXMuY29udGVudF9lbGVtLnN0eWxlWydjb3VudGVyLWluY3JlbWVudCddID0gJ2NsdXN0ZXJpemUtY291bnRlciAnICsgKGRhdGEucm93c19hYm92ZSAtIDEpO1xyXG4gICAgICAgIGNhbGxiYWNrcy5jbHVzdGVyQ2hhbmdlZCAmJiBjYWxsYmFja3MuY2x1c3RlckNoYW5nZWQoKTtcclxuICAgICAgfSBlbHNlIGlmIChvbmx5X2JvdHRvbV9vZmZzZXRfY2hhbmdlZCkge1xyXG4gICAgICAgIHRoaXMuY29udGVudF9lbGVtLmxhc3RDaGlsZC5zdHlsZS5oZWlnaHQgPSBkYXRhLmJvdHRvbV9vZmZzZXQgKyAncHgnO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8gdW5mb3J0dW5hdGVseSBpZSA8PSA5IGRvZXMgbm90IGFsbG93IHRvIHVzZSBpbm5lckhUTUwgZm9yIHRhYmxlIGVsZW1lbnRzLCBzbyBtYWtlIGEgd29ya2Fyb3VuZFxyXG4gICAgaHRtbDogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgdmFyIGNvbnRlbnRfZWxlbSA9IHRoaXMuY29udGVudF9lbGVtO1xyXG4gICAgICBpZiAoaWUgJiYgaWUgPD0gOSAmJiB0aGlzLm9wdGlvbnMudGFnID09ICd0cicpIHtcclxuICAgICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksIGxhc3Q7XHJcbiAgICAgICAgZGl2LmlubmVySFRNTCA9ICc8dGFibGU+PHRib2R5PicgKyBkYXRhICsgJzwvdGJvZHk+PC90YWJsZT4nO1xyXG4gICAgICAgIHdoaWxlICgobGFzdCA9IGNvbnRlbnRfZWxlbS5sYXN0Q2hpbGQpKSB7XHJcbiAgICAgICAgICBjb250ZW50X2VsZW0ucmVtb3ZlQ2hpbGQobGFzdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByb3dzX25vZGVzID0gdGhpcy5nZXRDaGlsZE5vZGVzKGRpdi5maXJzdENoaWxkLmZpcnN0Q2hpbGQpO1xyXG4gICAgICAgIHdoaWxlIChyb3dzX25vZGVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgY29udGVudF9lbGVtLmFwcGVuZENoaWxkKHJvd3Nfbm9kZXMuc2hpZnQoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnRlbnRfZWxlbS5pbm5lckhUTUwgPSBkYXRhO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgZ2V0Q2hpbGROb2RlczogZnVuY3Rpb24gKHRhZykge1xyXG4gICAgICB2YXIgY2hpbGRfbm9kZXMgPSB0YWcuY2hpbGRyZW4sIG5vZGVzID0gW107XHJcbiAgICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IGNoaWxkX25vZGVzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcclxuICAgICAgICBub2Rlcy5wdXNoKGNoaWxkX25vZGVzW2ldKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbm9kZXM7XHJcbiAgICB9LFxyXG4gICAgY2hlY2tDaGFuZ2VzOiBmdW5jdGlvbiAodHlwZSwgdmFsdWUsIGNhY2hlKSB7XHJcbiAgICAgIHZhciBjaGFuZ2VkID0gdmFsdWUgIT0gY2FjaGVbdHlwZV07XHJcbiAgICAgIGNhY2hlW3R5cGVdID0gdmFsdWU7XHJcbiAgICAgIHJldHVybiBjaGFuZ2VkO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbi8vIHN1cHBvcnQgZnVuY3Rpb25zXHJcbiAgZnVuY3Rpb24gb24oZXZ0LCBlbGVtZW50LCBmbmMpIHtcclxuICAgIHJldHVybiBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIgPyBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZ0LCBmbmMsIGZhbHNlKSA6IGVsZW1lbnQuYXR0YWNoRXZlbnQoXCJvblwiICsgZXZ0LCBmbmMpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gb2ZmKGV2dCwgZWxlbWVudCwgZm5jKSB7XHJcbiAgICByZXR1cm4gZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyID8gZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2dCwgZm5jLCBmYWxzZSkgOiBlbGVtZW50LmRldGFjaEV2ZW50KFwib25cIiArIGV2dCwgZm5jKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGlzQXJyYXkoYXJyKSB7XHJcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFycikgPT09ICdbb2JqZWN0IEFycmF5XSc7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpc0Z1bmN0aW9uKGZuYykge1xyXG4gICAgLy9odHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNzM1NjUyOC8xMzk1OTczXHJcbiAgICByZXR1cm4gZm5jICYmIHt9LnRvU3RyaW5nLmNhbGwoZm5jKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGdldFN0eWxlKHByb3AsIGVsZW0pIHtcclxuICAgIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSA/IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW0pW3Byb3BdIDogZWxlbS5jdXJyZW50U3R5bGVbcHJvcF07XHJcbiAgfVxyXG5cclxuICByZXR1cm4gQ2x1c3Rlcml6ZTtcclxufSkpXHJcbjsiLCIvKlxyXG5yZXVzYWJsZSBEMy5qcyBjbGFzcyBmb3IgKExBUkdFKSB0YWJsZXNcclxuKiBlZmZpY2llbnQgd2l0aCBsYXJnZSBkYXRhIHRoYW5rcyB0byBodHRwczovL2NsdXN0ZXJpemUuanMub3JnL1xyXG4qIGZpbHRlcmFibGUgdGhhbmtzIHRvIEQzXHJcbiogc29ydGFibGUgdGhhbmtzIHRvIGh0dHA6Ly9ibC5vY2tzLm9yZy9BTURTLzRhNjE0OTcxODJiOGZjYjA1OTA2XHJcbiogYW5kIGh0dHBzOi8vd3d3LmtyeW9nZW5peC5vcmcvY29kZS9icm93c2VyL3NvcnR0YWJsZS8pXHJcblxyXG5AYXV0aG9yICBQaGlsaXBwZSBHdWdsaWVsbWV0dGkgaHR0cHM6Ly9naXRodWIuY29tL2dvdWx1L1xyXG4gKi9cclxuXHJcbmltcG9ydCAqIGFzIENsdXN0ZXJpemUgZnJvbSAnLi9jbHVzdGVyaXplLmpzJ1xyXG5pbXBvcnQgKiBhcyBkMyBmcm9tICdkMydcclxuXHJcbmV4cG9ydCBjbGFzcyBUYWJsZSBleHRlbmRzIENsdXN0ZXJpemUge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIGhlaWdodCA9IDQwMCkge1xyXG4gICAgICAgIC8qIGJ1aWxkIERPTSBzdHJ1Y3R1cmUgbGlrZSB0aGlzOlxyXG4gICAgICAgICAgICA8dGFibGU+XHJcbiAgICAgICAgICAgICAgICA8dGhlYWQ+XHJcbiAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRoPkhlYWRlcnM8L3RoPlxyXG4gICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgIDwvdGhlYWQ+XHJcbiAgICAgICAgICAgIDwvdGFibGU+XHJcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJzY3JvbGxBcmVhXCIgY2xhc3M9XCJjbHVzdGVyaXplLXNjcm9sbFwiPlxyXG4gICAgICAgICAgICAgICAgPHRhYmxlPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0Ym9keSBpZD1cImNvbnRlbnRBcmVhXCIgY2xhc3M9XCJjbHVzdGVyaXplLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8dHIgY2xhc3M9XCJjbHVzdGVyaXplLW5vLWRhdGFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPkxvYWRpbmcgZGF0YeKApjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxyXG4gICAgICAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHR5cGVvZihlbGVtZW50KT09J3N0cmluZycpIHtcclxuICAgICAgICAgICAgZWxlbWVudD1kMy5zZWxlY3QoZWxlbWVudCkgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdGhlYWQgPSBlbGVtZW50LmFwcGVuZChcInRhYmxlXCIpLmFwcGVuZChcInRoZWFkXCIpO1xyXG4gICAgICAgIHRoZWFkLmluc2VydChcInRoXCIpLmFwcGVuZChcInRyXCIpLnRleHQoXCJIZWFkZXJzXCIpO1xyXG5cclxuICAgICAgICBsZXQgc2Nyb2xsID0gZWxlbWVudC5hcHBlbmQoXCJkaXZcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCB1bmlxdWVJZClcclxuICAgICAgICAgICAgLnN0eWxlKFwibWF4LWhlaWdodFwiLCBoZWlnaHQgKyAncHgnKVxyXG4gICAgICAgICAgICAuY2xhc3NlZChcImNsdXN0ZXJpemUtc2Nyb2xsXCIsIHRydWUpXHJcbiAgICAgICAgICAgIC5vbignc2Nyb2xsJywgKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcmV2U2Nyb2xsTGVmdCA9IDA7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzY3JvbGxMZWZ0ID0gdGhpcy5zY3JvbGxMZWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNjcm9sbExlZnQgPT0gcHJldlNjcm9sbExlZnQpIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICBwcmV2U2Nyb2xsTGVmdCA9IHNjcm9sbExlZnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aGVhZC5zdHlsZSgnbWFyZ2luLWxlZnQnLCAtc2Nyb2xsTGVmdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIGxldCByb3dzID0gc2Nyb2xsLmFwcGVuZChcInRhYmxlXCIpLmFwcGVuZChcInRib2R5XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgdW5pcXVlSWQpXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKFwiY2x1c3Rlcml6ZS1jb250ZW50XCIsIHRydWUpO1xyXG5cclxuICAgICAgICBzdXBlcih7XHJcbiAgICAgICAgICAgIC8vIHJvd3M6IFtdLCAvLyBkbyBub3Qgc3BlY2lmeSBpdCBoZXJlXHJcbiAgICAgICAgICAgIHNjcm9sbElkOiBzY3JvbGwuYXR0cihcImlkXCIpLFxyXG4gICAgICAgICAgICBjb250ZW50SWQ6IHJvd3MuYXR0cihcImlkXCIpLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgIHRoaXMudGhlYWQgPSB0aGVhZDtcclxuICAgICAgICB0aGlzLnNjcm9sbCA9IHNjcm9sbDtcclxuICAgICAgICB0aGlzLnJvd3MgPSBlbGVtZW50LnNlbGVjdChcInRib2R5XCIpO1xyXG5cclxuICAgICAgICB0aGlzLmZvcm1hdChmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICByZXR1cm4gdjtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMucm93aWQoZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgLy8gYnkgZGVmYXVsdCwgcm93aWQgaXMgcm93IG51bWJlciBpbiBkYXRhXHJcbiAgICAgICAgICAgIC8vIG5vdCBiYWQsIGJ1dCBkb2Vucyd0IHN1cnZpdmUgYSB0YWJsZS5zb3J0IC4uLlxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhKCkuaW5kZXhPZihkKVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIHRoaXMub3B0aW9ucy5jYWxsYmFja3MgPSB7XHJcbiAgICAgICAgICAgIGNsdXN0ZXJDaGFuZ2VkOiB0aGlzLnJlc2l6ZS5iaW5kKHRoaXMpXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhpcy5yZXNpemUuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIGxldCB0ciA9IHJvd3MuYXBwZW5kKFwidHJcIikuY2xhc3NlZChcImNsdXN0ZXJpemUtbm8tZGF0YVwiLCB0cnVlKTtcclxuICAgICAgICB0ci5hcHBlbmQoXCJ0ZFwiKS50ZXh0KFwiTG9hZGluZyBkYXRhLi4uXCIpO1xyXG5cclxuICAgICAgICB0aGlzLl9fZGF0YV9fID0gW107IC8vIGRvbid0IGNhbGwgZGF0YSgpIHNpbmNlIGl0IHdvdWxkIGNsZWFyIGFueSBleGlzdGluZyBET00gdGFibGVcclxuXHJcbiAgICAgICAgdGhpcy5fZmlsdGVyID0gZnVuY3Rpb24gKGQsIGkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9zZWxlY3RlZCA9IG5ldyBTZXQoW10pO1xyXG4gICAgICAgIHRoaXMuc29ydEFzY2VuZGluZyA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgZm9ybWF0KGYpIHtcclxuICAgICAgICB0aGlzLl9mb3JtYXQgPSBmO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNvbmZpZ1xyXG5cclxuICAgIGhlYWRlcihjb2xzKSB7XHJcbiAgICAgICAgbGV0IHRhYmxlID0gdGhpcztcclxuICAgICAgICB0aGlzLmNvbHVtbnMgPSBjb2xzO1xyXG4gICAgICAgIHRoaXMudGhlYWQuc2VsZWN0QWxsKFwidGhcIilcclxuICAgICAgICAgICAgLnJlbW92ZSgpO1xyXG4gICAgICAgIHRoaXMudGhlYWQuc2VsZWN0QWxsKFwidGhcIilcclxuICAgICAgICAgICAgLmRhdGEodGhpcy5jb2x1bW5zKVxyXG4gICAgICAgICAgICAuZW50ZXIoKVxyXG4gICAgICAgICAgICAuYXBwZW5kKFwidGhcIilcclxuICAgICAgICAgICAgLnRleHQoZnVuY3Rpb24gKGNvbHVtbikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbHVtbjtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uIChkLCBpKSB7XHJcbiAgICAgICAgICAgICAgICB0YWJsZS5zb3J0KGksIHRhYmxlLnNvcnRBc2NlbmRpbmcpO1xyXG4gICAgICAgICAgICAgICAgdGFibGUuc29ydEFzY2VuZGluZyA9ICF0YWJsZS5zb3J0QXNjZW5kaW5nOyAvLyBmb3IgdGhlIG5leHQgdGltZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpczsgLy8gZm9yIGNoYWluaW5nXHJcbiAgICB9XHJcblxyXG4gICAgc29ydChpLCBhc2NlbmRpbmcgPSB0cnVlLCBzdGFibGUgPSBmYWxzZSkge1xyXG4gICAgICAgIC8vIHNvcnQgZGF0YSBieSBpLXRoIGNvbHVtbiwgYXNjZW5kaW5nIG9yIGRlc2NlbmRpbmdcclxuICAgICAgICAvLyBvcHRpb25hbGx5IHdpdGggc3RhYmxlIHNvcnQgYWxnbyAoc2xvd2VyLi4uKVxyXG4gICAgICAgIGxldCB0aCA9IHRoaXMudGhlYWQuc2VsZWN0QWxsKCd0aCcpO1xyXG4gICAgICAgIHRoLmNsYXNzZWQoJ2FlcycsIGZhbHNlKS5jbGFzc2VkKCdkZXMnLCBmYWxzZSk7XHJcbiAgICAgICAgZDMuc2VsZWN0KHRoWzBdW2ldKS5jbGFzc2VkKCdhZXMnLCAhYXNjZW5kaW5nKS5jbGFzc2VkKCdkZXMnLCBhc2NlbmRpbmcpO1xyXG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5kYXRhKCk7XHJcbiAgICAgICAgaWYgKGRhdGEubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7IC8vIGZvciBjaGFpbmluZ1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFpc0FycmF5KGRhdGFbMF0pKSB7IC8vIHJvd3MgYXJlIGRpY3RzXHJcbiAgICAgICAgICAgIGkgPSB0aGlzLmNvbHVtbnNbaV07IC8vIGluZGV4IGJ5IGZpZWxkXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaWMgPSBuZXcgSW50bC5Db2xsYXRvcignZW4nLCB7ICdzZW5zaXRpdml0eSc6ICdiYXNlJyB9KTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZih4LCB5KSB7XHJcbiAgICAgICAgICAgIC8vIHVuaXZlcnNhbCAoPykgY29tcGFyaXNvblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgeCA9IHhbaV1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgeCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgeSA9IHlbaV1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgeSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHggPT09IHkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgeCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpYy5jb21wYXJlKHgsIHkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiB0ID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHggLSB5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHggPiB5ID8gMSA6IC0xXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghYXNjZW5kaW5nKSB7XHJcbiAgICAgICAgICAgIGxldCBmZiA9IGY7XHJcbiAgICAgICAgICAgIGYgPSBmdW5jdGlvbiAoeCwgeSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZmKHksIHgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBwZXJmb3JtYW5jZSA9IHdpbmRvdy5wZXJmb3JtYW5jZSxcclxuICAgICAgICAgICAgdDAgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICBpZiAoc3RhYmxlKSB7XHJcbiAgICAgICAgICAgIHNoYWtlcl9zb3J0KGRhdGEsIGYpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGRhdGEuc29ydChmKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICAgICAgbGV0IGR0ID0gTWF0aC5yb3VuZChwZXJmb3JtYW5jZS5ub3coKSAtIHQwKVxyXG4gICAgICAgIGlmIChkdCA+IDEwMDApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ0YWJsZS5zb3J0IHRvb2sgXCIgKyBkdCArIFwiIG1pbGxpc2Vjb25kcy5cIilcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7IC8vIGZvciBjaGFpbmluZ1xyXG4gICAgfVxyXG5cclxuICAgIHJvd0FzQXJyYXkocm93KSB7XHJcbiAgICAgICAgLy8gcmV0dXJuIHJvdyBhcyB0aGUgYXJyYXkgb2YgdmlzaWJsZSBjZWxsc1xyXG4gICAgICAgIGlmICghaXNBcnJheShyb3cpKSB7IC8vIHN1cHBvc2UgaXQncyBhIGRpY3RcclxuICAgICAgICAgICAgcm93ID0gdGhpcy5jb2x1bW5zLm1hcChmdW5jdGlvbiAoZCwgaSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJvd1tkXVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcm93O1xyXG4gICAgfVxyXG5cclxuICAgIHJvd0FzU3RyaW5nKGQsIHNlcCA9ICdcXHUzMDAwJykge1xyXG4gICAgICAgIC8vIHNlcCBpcyBhIHZlcnkgdW5saWtlbHkgY2hhciB0byBtaW5pbWl6ZSB0aGUgcmlzayBvZiB3cm9uZyBwb3NpdGl2ZSB3aGVuIHNlYXJjaGluZ1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJvd0FzQXJyYXkoZCkubWFwKHRoaXMuX2Zvcm1hdCkuam9pbihzZXApO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmRJblJvdyhkLCB3aGF0KSB7XHJcbiAgICAgICAgLy8gd2hhdCBtdXN0IGJlIGluIGxvd2VyY2FzZSBmb3JcclxuICAgICAgICByZXR1cm4gdGhpcy5yb3dBc1N0cmluZyhkKS50b0xvd2VyQ2FzZSgpLmluZGV4T2Yod2hhdClcclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXIoZikge1xyXG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKGYpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZpbHRlciA9IGY7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhdygpOyAvLyBhcHBseSBmaWx0ZXJcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7IC8vIGZvciBjaGFpbmluZ1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBhc3N1bWUgZiBpcyBhIHNlbGVjdGlvbiBvZiBhbiBpbnB1dCBmaWVsZFxyXG4gICAgICAgIGxldCB0YWJsZSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuZmlsdGVyKGZ1bmN0aW9uIChkLCBpKSB7XHJcbiAgICAgICAgICAgIC8vIGhlcmUsIHRoaXMgaXMgdGhlIGlucHV0IGZpZWxkLCB3aGljaCBpcyAuYm91bmRcclxuICAgICAgICAgICAgbGV0IHMgPSB0aGlzLnByb3BlcnR5KFwidmFsdWVcIik7IC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zMTM2OTc1OS8xMzk1OTczXHJcbiAgICAgICAgICAgIGlmIChzID09PSAnJykgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybiB0YWJsZS5maW5kSW5Sb3coZCwgcy50b0xvd2VyQ2FzZSgpKSAhPT0gLTFcclxuICAgICAgICB9LmJpbmQoZikpIC8vIGJpbmQgdG8gdGhlIGlucHV0IGZpZWxkXHJcblxyXG4gICAgICAgIGYub24oXCJpbnB1dFwiLCBmdW5jdGlvbiAoKSB7IC8vIHNldCB0aGUgdXBkYXRlIGV2ZW50IG9mIHRoZSBpbnB1dCBmaWVsZFxyXG4gICAgICAgICAgICB0YWJsZS5kcmF3KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7IC8vIGZvciBjaGFpbmluZ1xyXG4gICAgfVxyXG5cclxuICAgIHJvd2lkKGQpIHtcclxuICAgICAgICAvLyByZXR1cm5zIGEgdW5pcXVlIGlkIG9mIHJvdyBhc3NvY2lhdGVkIHRvIGRhdGEgZFxyXG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKGQpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jvd2lkID0gZDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7IC8vIGZvciBjaGFpbmluZ1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jvd2lkKGQpXHJcbiAgICB9XHJcblxyXG4gICAgb24oZSwgZikge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5jYWxsYmFja3NbZV0gPSBmLmJpbmQodGhpcyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7IC8vIGZvciBjaGFpbmluZ1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHJ1blxyXG4gICAgZGF0YShkKSB7XHJcbiAgICAgICAgaWYgKGQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fX2RhdGFfXztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fX2RhdGFfXyA9IGQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZHJhdygpO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoKSB7XHJcbiAgICAgICAgbGV0IHRhYmxlID0gdGhpcztcclxuICAgICAgICBsZXQgZCA9IHRoaXMuZGF0YSgpO1xyXG4gICAgICAgIGlmIChkLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHRhYmxlO1xyXG4gICAgICAgIGQgPSBkLmZpbHRlcih0YWJsZS5fZmlsdGVyKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZShmdW5jdGlvbiAoaSkge1xyXG4gICAgICAgICAgICBsZXQgcm93ID0gdGFibGUucm93QXNBcnJheShkW2ldKTtcclxuICAgICAgICAgICAgcmV0dXJuICc8dHIgJ1xyXG4gICAgICAgICAgICAgICAgKyAnaWQ9XCJyJyArIHRhYmxlLnJvd2lkKGRbaV0pICsgJ1wiICcgLy8gd2F5IHRvIGZpbmQgdGhlIGRhdGEgYmFjayBmb3Igc2VsZWN0aW9uLiBpZCBtdXN0IHN0YXJ0IHdpdGggbm9uIG51bWVyaWNcclxuICAgICAgICAgICAgICAgICsgKChpIGluIHRhYmxlLl9zZWxlY3RlZClcclxuICAgICAgICAgICAgICAgICAgICA/ICdjbGFzcz1cImhpZ2hsaWdodFwiJ1xyXG4gICAgICAgICAgICAgICAgICAgIDogJycpICAvLyBubyBoYW5kaWVyIHdheSB0byBzZWxlY3QgYSBoaWRkZW4gcm93IC4uLlxyXG4gICAgICAgICAgICAgICAgKyAnPidcclxuICAgICAgICAgICAgICAgICsgcm93Lm1hcChmdW5jdGlvbiAoY2VsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnPHRkPicgKyAoY2VsbCA9PT0gdW5kZWZpbmVkID8gJycgOiB0YWJsZS5fZm9ybWF0KGNlbGwpKSArICc8L3RkPic7XHJcbiAgICAgICAgICAgICAgICB9KS5qb2luKCcnKVxyXG4gICAgICAgICAgICAgICAgKyAnPC90cj4nXHJcbiAgICAgICAgfVxyXG4gICAgICAgICAgICAsXHJcbiAgICAgICAgICAgIGQubGVuZ3RoXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGFibGUucmVzaXplKCk7IC8vIHJlZHJhd1xyXG4gICAgICAgIHJldHVybiB0YWJsZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBldmVudHNcclxuXHJcbiAgICByZXNpemUoKSB7XHJcbiAgICAgICAgbGV0IHRhYmxlID0gdGhpcztcclxuICAgICAgICAvLyBNYWtlcyBoZWFkZXIgY29sdW1ucyBlcXVhbCB3aWR0aCB0byBjb250ZW50IGNvbHVtbnNcclxuICAgICAgICBsZXQgc2Nyb2xsQmFyV2lkdGggPSB3aWR0aCh0aGlzLmVsZW1lbnQpWzBdIC0gd2lkdGgodGhpcy5yb3dzKVswXSxcclxuICAgICAgICAgICAgdGQgPSB0aGlzLnJvd3Muc2VsZWN0KCd0cjpub3QoLmNsdXN0ZXJpemUtZXh0cmEtcm93KScpLnNlbGVjdEFsbCgndGQnKSxcclxuICAgICAgICAgICAgdyA9IHdpZHRoKHRkKTtcclxuICAgICAgICB3W3cubGVuZ3RoIC0gMV0gKz0gc2Nyb2xsQmFyV2lkdGg7XHJcbiAgICAgICAgd2lkdGgodGhpcy50aGVhZC5zZWxlY3RBbGwoJ3RoJyksIHcpO1xyXG5cclxuICAgICAgICAvLyAocmUpYXR0YWNoIGV2ZW50cyB0byByb3dzXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGZldmVudCgpIHtcclxuICAgICAgICAgICAgbGV0IGUgPSBkMy5ldmVudDtcclxuICAgICAgICAgICAgaWYgKGUudHlwZSBpbiB0YWJsZS5vcHRpb25zLmNhbGxiYWNrcykgeyAvLyBoYW5kbGUgaXRcclxuICAgICAgICAgICAgICAgIGxldCB0YXJnZXQgPSBlLnRhcmdldDtcclxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQudGFnTmFtZSA9PSAnVEQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudEVsZW1lbnQ7IC8vIGV2ZW50cyBhcmUgb24gcm93cyAoZm9yIG5vdylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIHJldHJpZXZlIHRoZSBkYXRhIChUT0RPOiB0aGVyZSBzaG91bGQgYmUgYSBxdWlja2VyIHdheS4uLilcclxuICAgICAgICAgICAgICAgIGxldCBpID0gdGFyZ2V0LmlkLnN1YnN0cigxKSwgIC8vZ2V0IHRyICNpZFxyXG4gICAgICAgICAgICAgICAgICAgIGQgPSB0YWJsZS5kYXRhKCkuZmluZChmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFibGUucm93aWQoZCkgPT0gaVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhYmxlLm9wdGlvbnMuY2FsbGJhY2tzW2UudHlwZV0oZCwgaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucm93cy5zZWxlY3RBbGwoXCJ0clwiKVxyXG4gICAgICAgICAgICAub24oXCJtb3VzZW92ZXJcIiwgZmV2ZW50KVxyXG4gICAgICAgICAgICAub24oXCJtb3VzZWxlYXZlXCIsIGZldmVudClcclxuICAgICAgICAgICAgLm9uKFwiY2xpY2tcIiwgZmV2ZW50KVxyXG4gICAgICAgICAgICAub24oXCJkYmxjbGlja1wiLCBmZXZlbnQpXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKFwiaGlnaGxpZ2h0XCIsIGZ1bmN0aW9uIChkLCBpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFibGUuX3NlbGVjdGVkLmhhcyhpKTtcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgcmV0dXJuIHRhYmxlO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZChuZXdkYXRhLCBpID0gLTEpIHtcclxuICAgICAgICAvLyBtZXJnZSBhbmQgc29ydCBkYXRhIHdpdGggY3VycmVudFxyXG4gICAgICAgIC8vIGRvbid0IHJlbmFtZSBpdCBcImFwcGVuZFwiIHRvIGF2b2lkIGNvbmZsaWN0cyB3aXRoIENsdXN0ZXJpemUgYW5kL29yIEQzXHJcbiAgICAgICAgdGhpcy5fX2RhdGFfXyA9IHRoaXMuZGF0YSgpLmNvbmNhdChuZXdkYXRhKTtcclxuICAgICAgICBpZiAoaSA+PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc29ydChpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBzY3JvbGxUbyhkLCBtcyA9IDEwMDApIHtcclxuICAgICAgICAvLyBzbW9vdGggc2Nyb2xsIHRvIGRhdGEgZCBpbiBtcyBtaWxsaXNlY29uZHNcclxuICAgICAgICBsZXQgdGFibGUgPSB0aGlzLFxyXG4gICAgICAgICAgICBsZW5ndGggPSB0aGlzLmRhdGEoKS5maWx0ZXIodGhpcy5fZmlsdGVyKS5sZW5ndGgsXHJcbiAgICAgICAgICAgIG5vZGUgPSB0aGlzLnNjcm9sbC5ub2RlKCksXHJcbiAgICAgICAgICAgIGYgPSBub2RlLnNjcm9sbEhlaWdodCAvIGxlbmd0aCxcclxuICAgICAgICAgICAgbmxpbmVzID0gbm9kZS5jbGllbnRIZWlnaHQgLyBmLFxyXG4gICAgICAgICAgICBsaW5lID0gdGhpcy5maW5kSW5kZXgoZCk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNjcm9sbFR3ZWVuKG9mZnNldCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGkgPSBkMy5pbnRlcnBvbGF0ZU51bWJlcihub2RlLnNjcm9sbFRvcCwgb2Zmc2V0KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAodCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUuc2Nyb2xsVG9wID0gaSh0KTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJvd3MudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgIC5kdXJhdGlvbihtcylcclxuICAgICAgICAgICAgLmVhY2goXCJlbmRcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGFibGUuc2VsZWN0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAudHdlZW4oXCJzY3JvbGxcIiwgc2Nyb2xsVHdlZW4oXHJcbiAgICAgICAgICAgICAgICAobGluZSAtIE1hdGgucm91bmQobmxpbmVzIC8gMikpICogZlxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICAgO1xyXG4gICAgICAgIHJldHVybiB0aGlzOyAvLyBmb3IgY2hhaW5pbmdcclxuICAgIH1cclxuXHJcbiAgICBpbmRleE9mKGQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhKCkuZmlsdGVyKHRoaXMuX2ZpbHRlcikuaW5kZXhPZihkKTtcclxuICAgIH1cclxuXHJcbiAgICBmaW5kKGQpIHtcclxuICAgICAgICBsZXQgdGFibGUgPSB0aGlzLFxyXG4gICAgICAgICAgICBpZCA9IHRhYmxlLnJvd2lkKGQpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEoKS5maWx0ZXIodGhpcy5fZmlsdGVyKS5maW5kKFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhYmxlLnJvd2lkKGUpID09PSBpZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIClcclxuICAgIH1cclxuICAgIGZpbmRJbmRleChkKSB7XHJcbiAgICAgICAgbGV0IHRhYmxlID0gdGhpcyxcclxuICAgICAgICAgICAgaWQgPSB0YWJsZS5yb3dpZChkKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhKCkuZmlsdGVyKHRoaXMuX2ZpbHRlcikuZmluZEluZGV4KFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhYmxlLnJvd2lkKGUpID09PSBpZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIClcclxuICAgIH1cclxuXHJcblxyXG4gICAgc2VsZWN0KGQsIGkpIHtcclxuICAgICAgICBsZXQgdGFibGUgPSB0aGlzO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBoaWdobGlnaHQoaSkge1xyXG4gICAgICAgICAgICB0YWJsZS5fc2VsZWN0ZWQuYWRkKGkpO1xyXG4gICAgICAgICAgICBsZXQgdHIgPSB0YWJsZS5yb3dzLnNlbGVjdChcIiNyXCIgKyBpKTtcclxuICAgICAgICAgICAgdHIuY2xhc3NlZChcImhpZ2hsaWdodFwiLCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWYgKGQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWQuZm9yRWFjaChoaWdobGlnaHQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpID0gdGhpcy5yb3dpZChkKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaGlnaGxpZ2h0KGkpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpczsgLy8gZm9yIGNoYWluaW5nXHJcbiAgICB9XHJcblxyXG4gICAgZGVzZWxlY3QoZCwgaSkge1xyXG4gICAgICAgIGlmIChpID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWYgKGQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWQuY2xlYXIoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhdygpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpID0gdGhpcy5yb3dpZChkKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9zZWxlY3RlZC5kZWxldGUoaSk7XHJcbiAgICAgICAgbGV0IHRyID0gdGhpcy5yb3dzLnNlbGVjdChcIiNyXCIgKyBpKTtcclxuICAgICAgICB0ci5jbGFzc2VkKFwiaGlnaGxpZ2h0XCIsIGZhbHNlKTtcclxuICAgICAgICByZXR1cm4gdGhpczsgLy8gZm9yIGNoYWluaW5nXHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLyBmaXJzdCBhbmQgbGFzdCBvZiBhIHNlbGVjdGlvblxyXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjU0MTM1MzQvMTM5NTk3M1xyXG5kM1xyXG4gICAgLnNlbGVjdGlvblxyXG4gICAgLnByb3RvdHlwZVxyXG4gICAgLmZpcnN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBkMy5zZWxlY3QodGhpc1swXVswXSk7XHJcbiAgICB9O1xyXG5kM1xyXG4gICAgLnNlbGVjdGlvblxyXG4gICAgLnByb3RvdHlwZVxyXG4gICAgLmxhc3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGxhc3QgPSB0aGlzLnNpemUoKSAtIDE7XHJcbiAgICAgICAgcmV0dXJuIGQzLnNlbGVjdCh0aGlzWzBdW2xhc3RdKTtcclxuICAgIH07XHJcblxyXG4vLyB1dGlsaXR5IGZ1bmN0aW9uc1xyXG5cclxuZnVuY3Rpb24gd2lkdGgoc2VsLCB2YWx1ZSkge1xyXG4gICAgLy8gbWltaWNzIGpRdWVyeSBmb3IgRDMgaHR0cHM6Ly9hcGkuanF1ZXJ5LmNvbS9jYXRlZ29yeS9kaW1lbnNpb25zL1xyXG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHsgLy8gZ2V0XHJcbiAgICAgICAgbGV0IHcgPSBbXTtcclxuICAgICAgICBzZWwuZWFjaChmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICB3LnB1c2godGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHc7XHJcbiAgICB9XHJcbiAgICBlbHNlIHsgLy8gc2V0XHJcbiAgICAgICAgc2VsLnN0eWxlKFwid2lkdGhcIiwgZnVuY3Rpb24gKGQsIGkpIHtcclxuICAgICAgICAgICAgbGV0IHcgPSB2YWx1ZVtpXTtcclxuICAgICAgICAgICAgcmV0dXJuIHcgKyBcInB4XCI7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHNlbDsgLy8gZm9yIGNoYWluaW5nXHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiB1bmlxdWVJZCgpIHtcclxuICAgIC8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2dvcmRvbmJyYW5kZXIvMjIzMDMxN1xyXG4gICAgLy8gTWF0aC5yYW5kb20gc2hvdWxkIGJlIHVuaXF1ZSBiZWNhdXNlIG9mIGl0cyBzZWVkaW5nIGFsZ29yaXRobS5cclxuICAgIC8vIENvbnZlcnQgaXQgdG8gYmFzZSAzNiAobnVtYmVycyArIGxldHRlcnMpLCBhbmQgZ3JhYiB0aGUgZmlyc3QgOSBjaGFyYWN0ZXJzXHJcbiAgICAvLyBhZnRlciB0aGUgZGVjaW1hbC5cclxuICAgIHJldHVybiBcIl9cIiArIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cigyLCA5KTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2hha2VyX3NvcnQobGlzdCwgY29tcF9mdW5jKSB7XHJcbiAgICAvLyBBIHN0YWJsZSBzb3J0IGZ1bmN0aW9uIHRvIGFsbG93IG11bHRpLWxldmVsIHNvcnRpbmcgb2YgZGF0YVxyXG4gICAgLy8gc2VlOiBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0NvY2t0YWlsX3NvcnRcclxuICAgIC8vIHRoYW5rcyB0byBKb3NlcGggTmFobWlhc1xyXG4gICAgbGV0IGIgPSAwO1xyXG4gICAgbGV0IHQgPSBsaXN0Lmxlbmd0aCAtIDE7XHJcbiAgICBsZXQgc3dhcCA9IHRydWU7XHJcblxyXG4gICAgd2hpbGUgKHN3YXApIHtcclxuICAgICAgICBzd2FwID0gZmFsc2U7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IGI7IGkgPCB0OyArK2kpIHtcclxuICAgICAgICAgICAgaWYgKGNvbXBfZnVuYyhsaXN0W2ldLCBsaXN0W2kgKyAxXSkgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcSA9IGxpc3RbaV07XHJcbiAgICAgICAgICAgICAgICBsaXN0W2ldID0gbGlzdFtpICsgMV07XHJcbiAgICAgICAgICAgICAgICBsaXN0W2kgKyAxXSA9IHE7XHJcbiAgICAgICAgICAgICAgICBzd2FwID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gLy8gZm9yXHJcbiAgICAgICAgdC0tO1xyXG5cclxuICAgICAgICBpZiAoIXN3YXApIGJyZWFrO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gdDsgaSA+IGI7IC0taSkge1xyXG4gICAgICAgICAgICBpZiAoY29tcF9mdW5jKGxpc3RbaV0sIGxpc3RbaSAtIDFdKSA8IDApIHtcclxuICAgICAgICAgICAgICAgIGxldCBxID0gbGlzdFtpXTtcclxuICAgICAgICAgICAgICAgIGxpc3RbaV0gPSBsaXN0W2kgLSAxXTtcclxuICAgICAgICAgICAgICAgIGxpc3RbaSAtIDFdID0gcTtcclxuICAgICAgICAgICAgICAgIHN3YXAgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSAvLyBmb3JcclxuICAgICAgICBiKys7XHJcblxyXG4gICAgfSAvLyB3aGlsZShzd2FwKVxyXG4gICAgcmV0dXJuIGxpc3Q7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzRnVuY3Rpb24oZm5jKSB7XHJcbiAgICAvL2h0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS83MzU2NTI4LzEzOTU5NzNcclxuICAgIHJldHVybiBmbmMgJiYge30udG9TdHJpbmcuY2FsbChmbmMpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc0FycmF5KGFycikge1xyXG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcnIpID09PSAnW29iamVjdCBBcnJheV0nO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkaWN0VmFsdWVzKGQpIHtcclxuICAgIHJldHVybiBPYmplY3Qua2V5cyhkKS5tYXAoZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgIHJldHVybiBkW2tleV07XHJcbiAgICB9KVxyXG59IiwibW9kdWxlLmV4cG9ydHMgPSBkMzsiXSwic291cmNlUm9vdCI6IiJ9