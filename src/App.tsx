import KDBush from 'kdbush'
import geokdbush from 'geokdbush'
import { useEffect, useRef } from 'react'
import snapshot from './latest.json'

const index = new KDBush(
  snapshot.content.locations,
  (l) => l.lon,
  (l) => l.lat,
)

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
        const value = (parseInt(nearest.leaves) / 6) * 255
        context.fillStyle = `rgb(${value}, ${value}, ${value})`
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
