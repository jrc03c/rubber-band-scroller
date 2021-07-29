const Vector2 = require("vector2")

class RubberBandScroller {
  target = new Vector2(0, 0)
  k = 3
  mass = 10
  damping = 0.6
  maxDisplacement = new Vector2(50, 50)
  velocity = new Vector2(0, 0)
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

        const current = new Vector2(window.pageXOffset, window.pageYOffset)
        const displacement = Vector2.subtract(current, self.target)
        const force = Vector2.scale(displacement, -self.k)
        const acceleration = Vector2.scale(force, 1 / self.mass)
        self.velocity.add(acceleration).scale(self.damping)
        const newPosition = Vector2.add(current, self.velocity)

        window.scrollTo({
          left: newPosition.x,
          top: newPosition.y,
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
