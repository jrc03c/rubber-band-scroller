# Intro

This little tool adds rubber-band-like scrolling to a web page.

# Installation

```bash
npm install --save @jrc03c/rubber-band-scroller
```

# Usage

Add the script to your HTML:

<!-- prettier-ignore -->
```html
<script
  src="node_modules/@jrc03c/rubber-band-scroller/dist/rubber-band-scroller.js">
</script>
```

Or import for use with bundlers:

```js
const RubberBandScroller = require("rubber-band-scroller")
```

Then:

```js
const band = new RubberBandScroller({
  damping: 0.6,
  delay: 0,
  k: 0.3,
  mass: 1.5,
  maxSpeed: 1000,
  sensitivity: 1,
  target: { x: 0, y: 0 },
})

band.on("start", () => console.log("Started!"))
band.on("stop", () => console.log("Stopped!"))
band.on("arrive", () => console.log("Arrived!"))

band.start()
// band.stop()
```

Note that the `.stop()` method will _immediately_ stop the scrolling of the page regardless of whether the scroller has arrived at its target or not.

# Notes

- This is only designed to scroll the entire page, not particular elements. Maybe I'll add that functionality at some point.
