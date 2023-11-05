const lodash = require("lodash")
const Vector2 = require("@jrc03c/vector2")

class RubberBandScroller {
  damping = 0.6
  delay = 0
  isPaused = false
  isRunning = false
  k = 3
  mass = 15
  onScrollStartListeners = []
  onScrollStopListeners = []
  onScrollVelocityIsZeroListeners = []
  sensitivity = 0.001
  target = new Vector2(0, 0)
  velocity = new Vector2(0, 0)

  constructor(options) {
    if (options && options instanceof HTMLElement) {
      const rect = options.getBoundingClientRect()

      options = {
        target: new Vector2(rect.left, rect.top),
      }
    }

    if (options) {
      this.damping = options.damping || this.damping
      this.delay = options.delay || this.delay
      this.k = options.k || this.k
      this.mass = options.mass || this.mass
      this.sensitivity = options.sensitivity || this.sensitivity
      this.target = options.target || this.target
    }
  }

  on(event, callback) {
    if (typeof callback !== "function") {
      throw new Error(
        "The second argument passed into the `on` method must be a callback function!",
      )
    }

    if (event === "start") {
      this.onScrollStartListeners.push(callback)
    }

    if (event === "stop") {
      this.onScrollStopListeners.push(callback)
    }

    if (event === "zero-velocity") {
      this.onScrollVelocityIsZeroListeners.push(callback)
    }

    return this
  }

  off(event, callback) {
    if (event === "start") {
      this.onScrollStartListeners.splice(
        this.onScrollStartListeners.indexOf(callback),
        1,
      )
    }

    if (event === "stop") {
      this.onScrollStopListeners.splice(
        this.onScrollStopListeners.indexOf(callback),
        1,
      )
    }

    if (event === "zero-velocity") {
      this.onScrollVelocityIsZeroListeners.splice(
        this.onScrollVelocityIsZeroListeners.indexOf(callback),
        1,
      )
    }

    return this
  }

  start() {
    this.isRunning = true

    const boundOnMouseDown = this.onMouseDown.bind(this)
    const boundOnMouseUp = this.onMouseUp.bind(this)
    const boundOnTouchStart = this.onTouchStart.bind(this)
    const boundOnTouchEnd = this.onTouchEnd.bind(this)
    const onWheelStart = () => (this.isPaused = true)

    const onWheelEnd = lodash.debounce(
      () => (this.isPaused = false),
      this.delay,
    )

    const onWheel = () => {
      onWheelStart()
      onWheelEnd()
    }

    window.addEventListener("mousedown", boundOnMouseDown)
    window.addEventListener("mouseup", boundOnMouseUp)
    window.addEventListener("touchstart", boundOnTouchStart)
    window.addEventListener("touchend", boundOnTouchEnd)
    window.addEventListener("wheel", onWheel)

    const loop = () => {
      if (this.isRunning) {
        window.requestAnimationFrame(loop)
        if (this.isPaused) return

        const current = new Vector2(window.scrollX, window.scrollY)
        const displacement = Vector2.subtract(current, this.target)
        const force = Vector2.scale(displacement, -this.k)
        const acceleration = Vector2.scale(force, 1 / this.mass)
        this.velocity.add(acceleration).scale(this.damping)
        const newPosition = Vector2.add(current, this.velocity)

        window.scrollTo({
          left: newPosition.x,
          top: newPosition.y,
        })

        if (this.velocity.magnitude < this.sensitivity) {
          this.velocity.scale(0)
          this.onScrollVelocityIsZeroListeners.forEach(callback => callback())
        }
      } else {
        window.removeEventListener("mousedown", boundOnMouseDown)
        window.removeEventListener("mouseup", boundOnMouseUp)
        window.removeEventListener("touchstart", boundOnTouchStart)
        window.removeEventListener("touchend", boundOnTouchEnd)
        window.removeEventListener("wheel", onWheel)
      }
    }

    loop()
    this.onScrollStartListeners.forEach(callback => callback())
    return this
  }

  stop() {
    this.isRunning = false
    this.onScrollStopListeners.forEach(callback => callback())
    return this
  }

  onMouseDown(event) {
    if (event.button === 0) this.isPaused = true
    return this
  }

  onMouseUp(event) {
    if (event.button === 0) this.isPaused = false
    return this
  }

  onTouchStart() {
    this.isPaused = true
    return this
  }

  onTouchEnd(event) {
    if (event.touches.length === 0) this.isPaused = false
    return this
  }
}

if (typeof module !== "undefined") {
  module.exports = RubberBandScroller
}

if (typeof window !== "undefined") {
  window.RubberBandScroller = RubberBandScroller
}
