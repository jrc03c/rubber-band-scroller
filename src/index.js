const lodash = require("lodash")
const Vector2 = require("@jrc03c/vector2")

class RubberBandScroller {
  damping = 0.6
  delay = 0
  isPaused = false
  isRunning = false
  k = 0.3
  mass = 1.5
  maxSpeed = 1000
  onScrollStartListeners = []
  onScrollStopListeners = []
  onArriveListeners = []
  sensitivity = 1
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
      this.maxSpeed = options.maxSpeed || this.maxSpeed
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

    if (event === "arrive") {
      this.onArriveListeners.push(callback)
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

    if (event === "arrive") {
      this.onArriveListeners.splice(this.onArriveListeners.indexOf(callback), 1)
    }

    return this
  }

  start() {
    if (this.isRunning) {
      return this
    }

    this.isRunning = true

    const onStart = lodash.debounce(
      () => {
        this.onScrollStartListeners.forEach(callback => callback())
      },
      1000,
      { leading: true },
    )

    const onStop = lodash.debounce(
      () => {
        this.onScrollStopListeners.forEach(callback => callback())
      },
      1000,
      { leading: true },
    )

    const onArrive = lodash.debounce(
      () => {
        this.onArriveListeners.forEach(callback => callback())
      },
      1000,
      { leading: true },
    )

    const onMouseDown = event => {
      if (event.button === 0) {
        this.isPaused = true
      }
    }

    const onMouseUp = event => {
      if (event.button === 0) {
        onWheelEnd()
      }
    }

    const onTouchStart = () => {
      this.isPaused = true
    }

    const onTouchEnd = event => {
      if (event.touches.length === 0) {
        onWheelEnd()
      }
    }

    const onWheelStart = () => {
      this.isPaused = true
    }

    const onWheelEnd = lodash.debounce(() => {
      this.isPaused = false
    }, this.delay)

    const onWheel = () => {
      onWheelStart()
      onWheelEnd()
    }

    window.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mouseup", onMouseUp)
    window.addEventListener("touchstart", onTouchStart)
    window.addEventListener("touchend", onTouchEnd)
    window.addEventListener("wheel", onWheel)

    let then
    let hasArrived = false

    const interval = setInterval(() => {
      if (this.isRunning) {
        if (this.isPaused) return

        const now = new Date()
        const delta = then ? (now - then) / (1000 / 60) : 1
        then = now

        const current = new Vector2(window.scrollX, window.scrollY)
        const displacement = Vector2.subtract(current, this.target)
        const force = Vector2.scale(displacement, -this.k)
        const acceleration = Vector2.scale(force, delta / this.mass)
        this.velocity.add(acceleration).scale(this.damping)

        if (this.velocity.magnitude > this.maxSpeed) {
          this.velocity.normalize().scale(this.maxSpeed)
        }

        const newPosition = Vector2.add(current, this.velocity)

        window.scrollTo({
          left: newPosition.x,
          top: newPosition.y,
        })

        if (this.velocity.magnitude < this.sensitivity) {
          if (!hasArrived) {
            hasArrived = true
            this.velocity.scale(0)
            this.isPaused = true
            window.scrollTo({ left: this.target.x, top: this.target.y })
            onArrive()
          }
        } else {
          hasArrived = false
        }
      } else {
        clearInterval(interval)
        window.removeEventListener("mousedown", onMouseDown)
        window.removeEventListener("mouseup", onMouseUp)
        window.removeEventListener("touchstart", onTouchStart)
        window.removeEventListener("touchend", onTouchEnd)
        window.removeEventListener("wheel", onWheel)
        onStop()
      }
    }, 1000 / 60)

    onStart()
    return this
  }

  stop() {
    this.isRunning = false
    return this
  }
}

if (typeof module !== "undefined") {
  module.exports = RubberBandScroller
}

if (typeof window !== "undefined") {
  window.RubberBandScroller = RubberBandScroller
}
