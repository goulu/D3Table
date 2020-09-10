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
/******/ 	return __webpack_require__(__webpack_require__.s = "./table.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/clusterize.js/clusterize.js":
/*!**************************************************!*\
  !*** ./node_modules/clusterize.js/clusterize.js ***!
  \**************************************************/
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

/***/ "./node_modules/webpack/buildin/harmony-module.js":
/*!*******************************************!*\
  !*** (webpack)/buildin/harmony-module.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(originalModule) {
	if (!originalModule.webpackPolyfill) {
		var module = Object.create(originalModule);
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		Object.defineProperty(module, "exports", {
			enumerable: true
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./table.js":
/*!******************!*\
  !*** ./table.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var clusterize_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! clusterize.js */ "./node_modules/clusterize.js/clusterize.js");
/* harmony import */ var clusterize_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(clusterize_js__WEBPACK_IMPORTED_MODULE_0__);
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




module.exports=class Table extends clusterize_js__WEBPACK_IMPORTED_MODULE_0__["Clusterize"] {

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
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

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
//# sourceMappingURL=table.js.map