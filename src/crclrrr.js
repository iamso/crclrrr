const defaults = {
  size: 40,
  border: 3,
  round: true,
  bg: 'ghostwhite',
  progress: 'lightgreen',
  duration: 1500,
  baseClass: 'crclrrr',
  initial: 0,
  easing: t => t,
};

export default class Crclrrr {
  constructor(element, options = {}) {
    this.el = element instanceof Node ? element : document.querySelector(element);

    this.options = Object.assign({}, defaults, options);
    this._defaults = defaults;
    this.callbacks = {};
    this.ns = "http://www.w3.org/2000/svg";

    this.svg = this.el.querySelector(`.${this.options.baseClass}`);
    this.bg = this.el.querySelector(`.${this.options.baseClass}-bg`);
    this.progress = this.el.querySelector(`.${this.options.baseClass}-progress`);


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
    this.svg.setAttribute('viewBox', `0 0 ${this.options.size} ${this.options.size}`);
    this.svg.style.transform = 'rotate(-90deg)';

    this.bg.setAttribute('class', `${this.options.baseClass}-bg`)
    this.bg.setAttribute('cx', (this.options.size / 2))
    this.bg.setAttribute('cy', (this.options.size / 2))
    this.bg.setAttribute('r', Math.floor((this.options.size - this.options.border) / 2))
    this.bg.style.fill = 'transparent';
    this.bg.style.opacity = 1;
    this.bg.style.stroke = this.options.bg;
    this.bg.style.strokeWidth = this.options.border;
    this.bg.style.strokeLinecap = this.options.round ? 'round' : 'butt';

    this.progress.setAttribute('class', `${this.options.baseClass}-progress`)
    this.progress.setAttribute('cx', (this.options.size / 2))
    this.progress.setAttribute('cy', (this.options.size / 2))
    this.progress.setAttribute('r', Math.floor((this.options.size - this.options.border) / 2))
    this.progress.style.fill = 'transparent';
    this.progress.style.opacity = 0;
    this.progress.style.stroke = this.options.progress;
    this.progress.style.strokeWidth = this.options.border;
    this.progress.style.strokeLinecap = this.options.round ? 'round' : 'butt';

    this.init();
  }

  init(value = this.options.initial) {
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

  set value(value) {
    this.from = Math.max(this.current, 0);
    this.to = Math.min(+value, 100);
    this.up = this.from < this.to;
    this.start = Date.now();

    if (this.up) {
      this.duration = (this.to - this.from) * (this.options.duration / 100);
    }
    else {
      this.duration = (this.from - this.to) * (this.options.duration / 100);
    }

    this.el.classList.add('loading');
    window.cancelAnimationFrame(this.frame);
    this._animate();
  }

  get value() {
    return this.current;
  }

  _animate() {
    const now = Date.now();
    const p = (now - this.start) / this.duration || 0;
    const eased = this.options.easing(p);

    if (this.current === this.to) {
      return false;
    }
    else if (this.current > this.to) {
      if (this.up) {
        return false;
      }
      this.current = Math.max(Math.min(Math.round(this.from - (this.from - this.to) * eased), this.from), this.to);
    }
    else if (this.current < this.to) {
      if (!this.up) {
        return false;
      }
      this.current = Math.max(Math.min(Math.round(this.from + (this.to - this.from) * eased), this.to), this.from);
    }

    this._draw();
    this.frame = window.requestAnimationFrame(this._animate.bind(this));
  }

  _draw() {
    const percent = ((100 - this.current) / 100) * this.totalLength;
    this.progress.style.opacity = Math.max(Math.min(this.current, 1), 0);
    this.progress.style.strokeDashoffset = Math.min(Math.max(percent, 0), this.totalLength);

    if ((this.up && this.current >= 100) || (!this.up && this.current <= 0)) {
      this.el.classList.remove('loading');

      if (Array.isArray(this.callbacks.complete)) {
        for (let fn of this.callbacks.complete) {
          /^f/.test(typeof fn) && fn.apply(this, [this]);
        }
      }
    }
  }

  on(e, fn) {
    if (!Array.isArray(this.callbacks[e])) {
      this.callbacks[e] = [];
    }
    this.callbacks[e].push(fn);
    return this;
  }

  reset(value) {
    this.init(value);
    this.el.classList.remove('loading');
    return this;
  }

  destroy() {
    this.el.classList.remove('loading');
    this.el.removeChild(this.svg);
  }
}
