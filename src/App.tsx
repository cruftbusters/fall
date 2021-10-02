import KDBush from 'kdbush'
import geokdbush from 'geokdbush'
import { useEffect, useRef } from 'react'
import snapshot from './latest.json'

const index = new KDBush(
  snapshot.content.locations,
  (l) => l.lon,
  (l) => l.lat,
)

function lookupRgb(value :  string) {
  switch(value) {
    case '0': return 'rgb(255, 255, 255)'
    case '1': return 'rgb(98, 138, 72)'
    case '2': return 'rgb(175, 167, 61)'
    case '3': return 'rgb(249, 203, 1)'
    case '4': return 'rgb(250, 165, 38)'
    case '5': return 'rgb(203, 52, 48)'
    case '6': return 'rgb(113, 33, 26)'
  }
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')!
    context.fillStyle = '#004400'

    const lons = snapshot.content.locations.map((it) => it.lon)
    const lats = snapshot.content.locations.map((it) => it.lat)
    const left = Math.min(...lons)
    const right = Math.max(...lons)
    const top = Math.max(...lats)
    const bottom = Math.min(...lats)
    const pixelSize = 5
    for (let x = 0; x < window.innerWidth; x+=pixelSize) {
      for (let y = 0; y < window.innerHeight; y+=pixelSize) {
        const [nearest] = geokdbush.around(
          index,
          (x / window.innerWidth) * (right - left) + left,
          (-y / window.innerHeight) * (top - bottom) + top,
          1,
        )
        context.fillStyle = lookupRgb(nearest.leaves)!
        context.fillRect(x, y, pixelSize, pixelSize)
      }
    }

    snapshot.content.locations.forEach(({ lat, lon }) => {
      context.beginPath()
      context.arc(
        ((lon - left) / (right - left)) * window.innerWidth,
        ((-lat + top) / (top - bottom)) * window.innerHeight,
        5,
        0,
        2 * Math.PI,
      )
      context.stroke()
    })
  }, [canvasRef])
  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
      }}
    />
  )
}

export default App
