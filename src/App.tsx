import { useEffect, useRef } from 'react'
import snapshot from './latest.json'

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
