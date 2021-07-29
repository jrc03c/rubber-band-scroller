(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
class Vector2 {
  x = 0
  y = 0

  constructor(x, y) {
    const self = this
    self.x = x
    self.y = y
  }

  add(v) {
    const self = this
    self.x += v.x
    self.y += v.y
    return self
  }

  subtract(v) {
    const self = this
    self.x -= v.x
    self.y -= v.y
    return self
  }

  dot(v) {
    const self = this
    return self.x * v.x + self.y * v.y
  }

  get magnitude() {
    const self = this
    return Math.sqrt(Math.pow(self.x, 2) + Math.pow(self.y, 2))
  }

  set magnitude(m) {
    const self = this
    self.normalize().scale(m)
  }

  scale(s) {
    const self = this
    self.x *= s
    self.y *= s
    return self
  }

  normalize() {
    const self = this
    return self.scale(1 / self.magnitude)
  }

  copy() {
    const self = this
    return new Vector2(self.x, self.y)
  }

  clone() {
    const self = this
    return self.copy()
  }

  static add(a, b) {
    return a.copy().add(b)
  }

  static subtract(a, b) {
    return a.copy().subtract(b)
  }

  static dot(a, b) {
    return a.copy().dot(b)
  }

  static scale(v, s) {
    return v.copy().scale(s)
  }

  static normalize(v) {
    return v.copy().normalize()
  }

  static copy(v) {
    return v.copy()
  }

  static clone(v) {
    return v.copy()
  }
}

if (typeof module !== "undefined") {
  module.exports = Vector2
}

if (typeof window !== "undefined") {
  window.Vector2 = Vector2
}

},{}],2:[function(require,module,exports){
const Vector2 = require("vector2")

class RubberBandScroller {
  k = 3
  mass = 10
  damping = 0.6
  maxDisplacement = new Vector2(50, 50)

  constructor(options) {
    const self = this
  }
}

if (typeof module !== "undefined") {
  module.exports = RubberBandScroller
}

if (typeof window !== "undefined") {
  window.RubberBandScroller = RubberBandScroller
}

},{"vector2":1}]},{},[2]);