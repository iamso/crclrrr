/*!
 * crclrrr - version 0.4.0
 *
 * Made with ❤ by Steve Ottoz so@dev.so
 *
 * Copyright (c) 2020 Steve Ottoz
 */
"use strict";const t={size:40,border:3,round:!0,bg:"ghostwhite",progress:"lightgreen",duration:1500,baseClass:"crclrrr",initial:0,easing:t=>t};module.exports=class{constructor(s,i={}){this.el=s instanceof Node?s:document.querySelector(s),this.options=Object.assign({},t,i),this._defaults=t,this.callbacks={},this.ns="http://www.w3.org/2000/svg",this.svg=this.el.querySelector("."+this.options.baseClass),this.bg=this.el.querySelector(`.${this.options.baseClass}-bg`),this.progress=this.el.querySelector(`.${this.options.baseClass}-progress`),this.svg||(this.svg=document.createElementNS(this.ns,"svg"),this.el.appendChild(this.svg)),this.bg||(this.bg=document.createElementNS(this.ns,"circle"),this.svg.appendChild(this.bg)),this.progress||(this.progress=document.createElementNS(this.ns,"circle"),this.svg.appendChild(this.progress)),this.svg.setAttribute("class",this.options.baseClass),this.svg.setAttribute("viewBox",`0 0 ${this.options.size} ${this.options.size}`),this.svg.style.transform="rotate(-90deg)",this.bg.setAttribute("class",this.options.baseClass+"-bg"),this.bg.setAttribute("cx",this.options.size/2),this.bg.setAttribute("cy",this.options.size/2),this.bg.setAttribute("r",Math.floor((this.options.size-this.options.border)/2)),this.bg.style.fill="transparent",this.bg.style.opacity=1,this.bg.style.stroke=this.options.bg,this.bg.style.strokeWidth=this.options.border,this.bg.style.strokeLinecap=this.options.round?"round":"butt",this.progress.setAttribute("class",this.options.baseClass+"-progress"),this.progress.setAttribute("cx",this.options.size/2),this.progress.setAttribute("cy",this.options.size/2),this.progress.setAttribute("r",Math.floor((this.options.size-this.options.border)/2)),this.progress.style.fill="transparent",this.progress.style.opacity=0,this.progress.style.stroke=this.options.progress,this.progress.style.strokeWidth=this.options.border,this.progress.style.strokeLinecap=this.options.round?"round":"butt",this.init()}init(t=this.options.initial){return this.radius=this.progress.getAttribute("r"),this.totalLength=Math.PI*(2*this.radius),this.current=t,this.from=0,this.to=0,this.start=0,this.frame=0,this.progress.style.strokeDasharray=this.totalLength,this._draw(),this}set value(t){this.from=Math.max(this.current,0),this.to=Math.min(+t,100),this.up=this.from<this.to,this.start=Date.now(),this.up?this.duration=(this.to-this.from)*(this.options.duration/100):this.duration=(this.from-this.to)*(this.options.duration/100),this.el.classList.add("loading"),window.cancelAnimationFrame(this.frame),this._animate()}get value(){return this.current}_animate(){const t=(Date.now()-this.start)/this.duration||0,s=this.options.easing(t);if(this.current===this.to){if((this.up&&100!==this.to||!this.up&&0!==this.to)&&Array.isArray(this.callbacks.animated))for(let t of this.callbacks.animated)/^f/.test(typeof t)&&t.apply(this,[this]);return!1}if(this.current>this.to){if(this.up)return!1;this.current=Math.max(Math.min(Math.round(this.from-(this.from-this.to)*s),this.from),this.to)}else if(this.current<this.to){if(!this.up)return!1;this.current=Math.max(Math.min(Math.round(this.from+(this.to-this.from)*s),this.to),this.from)}this._draw(),this.frame=window.requestAnimationFrame(this._animate.bind(this))}_draw(){const t=(100-this.current)/100*this.totalLength;if(this.progress.style.opacity=Math.max(Math.min(this.current,1),0),this.progress.style.strokeDashoffset=Math.min(Math.max(t,0),this.totalLength),(this.up&&this.current>=100||!this.up&&this.current<=0)&&(this.el.classList.remove("loading"),Array.isArray(this.callbacks.complete)))for(let t of this.callbacks.complete)/^f/.test(typeof t)&&t.apply(this,[this])}on(t,s){return Array.isArray(this.callbacks[t])||(this.callbacks[t]=[]),this.callbacks[t].push(s),this}reset(t){return this.init(t),this.el.classList.remove("loading"),this}destroy(){this.el.classList.remove("loading"),this.el.removeChild(this.svg)}};
