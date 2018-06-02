/*!
 * crclrrr - version 0.1.0
 *
 * Made with ❤ by Steve Ottoz so@dev.so
 *
 * Copyright (c) 2018 Steve Ottoz
 */
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.Crclrrr = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var defaults = {
    size: 40,
    border: 3,
    round: true,
    bg: 'ghostwhite',
    progress: 'lightgreen',
    duration: 1500,
    baseClass: 'crclrrr',
    initial: 0,
    easing: function easing(t) {
      return t;
    }
  };

  var Crclrrr = function () {
    function Crclrrr(element) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Crclrrr);

      this.el = element instanceof Node ? element : document.querySelector(element);

      this.options = Object.assign({}, defaults, options);
      this._defaults = defaults;
      this.callbacks = {};
      this.ns = "http://www.w3.org/2000/svg";

      this.svg = this.el.querySelector('.' + this.options.baseClass);
      this.bg = this.el.querySelector('.' + this.options.baseClass + '-bg');
      this.progress = this.el.querySelector('.' + this.options.baseClass + '-progress');

      if (!this.svg) {
        this.svg = document.createElementNS(this.ns, 'svg');
        this.el.appendChild(this.svg);
      }

      if (!this.bg) {
        this.bg = document.createElementNS(this.ns, 'circle');
        this.svg.appendChild(this.bg);
      }

      if (!this.progress) {
        this.progress = document.createElementNS(this.ns, 'circle');
        this.svg.appendChild(this.progress);
      }

      this.svg.setAttribute('class', this.options.baseClass);
      this.svg.setAttribute('viewBox', '0 0 ' + this.options.size + ' ' + this.options.size);
      this.svg.style.transform = 'rotate(-90deg)';

      this.bg.setAttribute('class', this.options.baseClass + '-bg');
      this.bg.setAttribute('cx', this.options.size / 2);
      this.bg.setAttribute('cy', this.options.size / 2);
      this.bg.setAttribute('r', Math.floor((this.options.size - this.options.border) / 2));
      this.bg.style.fill = 'transparent';
      this.bg.style.opacity = 1;
      this.bg.style.stroke = this.options.bg;
      this.bg.style.strokeWidth = this.options.border;
      this.bg.style.strokeLinecap = this.options.round ? 'round' : 'butt';

      this.progress.setAttribute('class', this.options.baseClass + '-progress');
      this.progress.setAttribute('cx', this.options.size / 2);
      this.progress.setAttribute('cy', this.options.size / 2);
      this.progress.setAttribute('r', Math.floor((this.options.size - this.options.border) / 2));
      this.progress.style.fill = 'transparent';
      this.progress.style.opacity = 0;
      this.progress.style.stroke = this.options.progress;
      this.progress.style.strokeWidth = this.options.border;
      this.progress.style.strokeLinecap = this.options.round ? 'round' : 'butt';

      if (typeof window.CustomEvent === 'function') {
        this.event = new CustomEvent(this.options.baseClass + '-complete', { bubbles: true, cancelable: true });
      } else {
        this.event = document.createEvent('Event');
        this.event.initEvent(this.options.baseClass + '-complete', true, true); //can bubble, and is cancellable
      }

      this.init();
    }

    _createClass(Crclrrr, [{
      key: 'init',
      value: function init() {
        var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.options.initial;

        this.radius = this.progress.getAttribute('r');
        this.totalLength = Math.PI * (this.radius * 2);
        this.current = value;
        this.from = 0;
        this.to = 0;
        this.start = 0;
        this.frame = 0;
        this.progress.style.strokeDasharray = this.totalLength;
        this._draw();
        return this;
      }
    }, {
      key: '_animate',
      value: function _animate() {
        var now = Date.now();
        var p = (now - this.start) / this.duration || 0;
        var eased = this.options.easing(p);

        if (this.current >= this.to) {
          if (this.up) {
            return false;
          }
          this.current = Math.round(this.from - (this.from - this.to) * eased);
        } else if (this.current <= this.to) {
          if (!this.up) {
            return false;
          }
          this.current = Math.round(this.from + (this.to - this.from) * eased);
        }

        this._draw();
        this.frame = window.requestAnimationFrame(this._animate.bind(this));
      }
    }, {
      key: '_draw',
      value: function _draw() {
        var percent = (100 - this.current) / 100 * this.totalLength;
        this.progress.style.opacity = 1;
        this.progress.style.strokeDashoffset = Math.min(Math.max(percent, 0), this.totalLength);

        if (this.current >= 100) {
          this.el.classList.remove('loading');
          this.el.dispatchEvent(this.event);

          if (Array.isArray(this.callbacks.complete)) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = this.callbacks.complete[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var fn = _step.value;

                /^f/.test(typeof fn === 'undefined' ? 'undefined' : _typeof(fn)) && fn.apply(this, [this]);
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }
          }
        }
      }
    }, {
      key: 'on',
      value: function on(e, fn) {
        if (!Array.isArray(this.callbacks[e])) {
          this.callbacks[e] = [];
        }
        this.callbacks[e].push(fn);
        return this;
      }
    }, {
      key: 'reset',
      value: function reset(value) {
        this.init(value);
        this.el.classList.remove('loading');
        return this;
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        this.el.classList.remove('loading');
        this.el.removeChild(this.svg);
      }
    }, {
      key: 'value',
      set: function set(value) {
        this.from = Math.max(this.current, 0);
        this.to = Math.min(+value, 100);
        this.up = this.from < this.to;
        this.start = Date.now();

        if (this.up) {
          this.duration = (this.to - this.from) * (this.options.duration / 100);
        } else {
          this.duration = (this.from - this.to) * (this.options.duration / 100);
        }

        this.el.classList.add('loading');
        window.cancelAnimationFrame(this.frame);
        this._animate();
      },
      get: function get() {
        return this.current;
      }
    }]);

    return Crclrrr;
  }();

  exports.default = Crclrrr;
  module.exports = exports['default'];
});