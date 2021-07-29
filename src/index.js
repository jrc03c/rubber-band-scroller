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
