import KDBush from 'kdbush'
import geokdbush from 'geokdbush'
import { useEffect, useRef } from 'react'
import snapshot from './latest.json'

const index = new KDBush(
  snapshot.features,
  (it) => it.geometry.coordinates[0],
  (it) => it.geometry.coordinates[1],
)

function lookupRgb(value: string) {
  switch (value) {
    case '0':
      return 'rgb(255, 255, 255)'
    case '1':
      return 'rgb(98, 138, 72)'
    case '2':
      return 'rgb(175, 167, 61)'
    case '3':
      return 'rgb(249, 203, 1)'
    case '4':
      return 'rgb(250, 165, 38)'
    case '5':
      return 'rgb(203, 52, 48)'
    case '6':
      return 'rgb(113, 33, 26)'
  }
}

class ScreenProjector {
  xCenter: number = 0
  yCenter: number = 0
  zoom: number = 0

  static fromCoordinates<CoordinateType>(
    coordinates: Array<CoordinateType>,
    fx: (coordinate: CoordinateType) => number,
    fy: (coordinate: CoordinateType) => number,
  ) {
    const xs = coordinates.map(fx)
    const ys = coordinates.map(fy)
    const left = Math.min(...xs)
    const right = Math.max(...xs)
    const top = Math.max(...ys)
    const bottom = Math.min(...ys)
    const zoom = Math.pow(
      Math.max(
        (right - left) / window.innerWidth,
        (top - bottom) / window.innerHeight,
      ),
      0.975,
    )
    const screenProjector = new ScreenProjector()
    screenProjector.xCenter = (right - left) / 2 + left
    screenProjector.yCenter = (top - bottom) / 2 + bottom
    screenProjector.zoom = zoom
    return screenProjector
  }

  screenPointToCoordinatePoint(x: number, y: number) {
    return [
      (x - window.innerWidth / 2) * this.zoom + this.xCenter,
      (-y + window.innerHeight / 2) * this.zoom + this.yCenter,
    ]
  }

  coordinatePointToScreenPoint(a: number, b: number) {
    return [
      (a - this.xCenter) / this.zoom + window.innerWidth / 2,
      (-b + this.yCenter) / this.zoom + window.innerHeight / 2,
    ]
  }
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')!
    context.fillStyle = '#004400'

    const screenProjector = ScreenProjector.fromCoordinates(
      snapshot.features,
      (it) => it.geometry.coordinates[0],
      (it) => it.geometry.coordinates[1],
    )

    const pixelSize = 5
    for (let x = 0; x < window.innerWidth; x += pixelSize) {
      for (let y = 0; y < window.innerHeight; y += pixelSize) {
        const [lon, lat] = screenProjector.screenPointToCoordinatePoint(
          x,
          y,
        )
        const [nearest] = geokdbush.around(index, lon, lat, 1)
        context.fillStyle = lookupRgb(nearest.properties.leaves)!
        context.fillRect(x, y, pixelSize, pixelSize)
      }
    }

    snapshot.features.forEach(
      ({
        geometry: {
          coordinates: [lon, lat],
        },
      }) => {
        context.beginPath()
        const [x, y] = screenProjector.coordinatePointToScreenPoint(
          lon,
          lat,
        )
        context.arc(x, y, 5, 0, 2 * Math.PI)
        context.stroke()
      },
    )
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
