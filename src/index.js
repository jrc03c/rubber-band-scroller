const Vector2 = require("vector2")

class RubberBandScroller {
  target = new Vector2(0, 0)
  k = 3
  mass = 15
  damping = 0.6
  velocity = new Vector2(0, 0)
  isRunning = false
  isPaused = false

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
    }
  }

  start() {
    const self = this
    self.isRunning = true

    const boundOnMouseDown = self.onMouseDown.bind(self)
    const boundOnMouseUp = self.onMouseUp.bind(self)
    const boundOnTouchStart = self.onTouchStart.bind(self)
    const boundOnTouchEnd = self.onTouchEnd.bind(self)

    window.addEventListener("mousedown", boundOnMouseDown)
    window.addEventListener("mouseup", boundOnMouseUp)
    window.addEventListener("touchstart", boundOnTouchStart)
    window.addEventListener("touchend", boundOnTouchEnd)

    function loop() {
      if (self.isRunning) {
        window.requestAnimationFrame(loop)
        if (self.isPaused) return

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
      } else {
        window.removeEventListener("mousedown", boundOnMouseDown)
        window.removeEventListener("mouseup", boundOnMouseUp)
        window.removeEventListener("touchstart", boundOnTouchStart)
        window.removeEventListener("touchend", boundOnTouchEnd)
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

  onMouseDown(event) {
    const self = this
    if (event.button === 0) self.isPaused = true
    return self
  }

  onMouseUp(event) {
    const self = this
    if (event.button === 0) self.isPaused = false
    return self
  }

  onTouchStart(event) {
    const self = this
    self.isPaused = true
    return self
  }

  onTouchEnd(event) {
    const self = this
    if (event.touches.length === 0) self.isPaused = false
    return self
  }
}

if (typeof module !== "undefined") {
  module.exports = RubberBandScroller
}

if (typeof window !== "undefined") {
  window.RubberBandScroller = RubberBandScroller
}
