const Vector2 = require("vector2")

function lerp(a, b, f) {
  return f * (b - a) + a
}

class RubberBandScroller {
  target = new Vector2(0, 0)
  k = 3
  mass = 10
  damping = 0.6
  maxDisplacement = new Vector2(50, 50)
  isRunning = false

  constructor(options) {
    const self = this

    if (options && options instanceof HTMLElement) {
      const rect = options.getBoundingClientRect()

      options = {
        target: new Vector2(rect.left, rect.top),
      }
    }

    if (options) {
      if (options.target) self.target = options.target
      if (options.k) self.k = options.k
      if (options.mass) self.mass = options.mass
      if (options.damping) self.damping = options.damping

      if (options.maxDisplacement) {
        self.maxDisplacement.x = options.maxDisplacement.x
        self.maxDisplacement.y = options.maxDisplacement.y
      }
    }
  }

  start() {
    const self = this
    self.isRunning = true

    function loop() {
      if (self.isRunning) {
        window.requestAnimationFrame(loop)

        window.scrollTo({
          left: lerp(window.pageXOffset, self.target.x, 0.1),
          top: lerp(window.pageYOffset, self.target.y, 0.1),
        })
      }
    }

    loop()

    return self
  }

  stop() {
    const self = this
    self.isRunning = false
    return self
  }
}

if (typeof module !== "undefined") {
  module.exports = RubberBandScroller
}

if (typeof window !== "undefined") {
  window.RubberBandScroller = RubberBandScroller
}
