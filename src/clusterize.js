/* Clusterize.js - v0.19.0 - 2020-05-18
 http://NeXTs.github.com/Clusterize.js/
 Copyright (c) 2015 Denis Lukov; Licensed GPLv3 */

;(function (name, definition) {
  if (typeof module != 'undefined') module.exports = definition();
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
  else this[name] = definition();
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