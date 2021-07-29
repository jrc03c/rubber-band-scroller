```js
const RubberBandScroller = require("rubber-band-scroller")

const band = new RubberBandScroller({
  target: { x: 0, y: 0 },
  k: 1,
  mass: 1,
  damping: 0.6,
})

band.start()
// band.stop()
```
