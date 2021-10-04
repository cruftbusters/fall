import KDBush from 'kdbush'
import geokdbush from 'geokdbush'
import { useEffect, useRef } from 'react'
import snapshot from './latest.json'
import { ScreenProjector } from './ScreenProjector'

const index = new KDBush(
  snapshot.features,
  (it) => it.geometry.coordinates[0],
  (it) => it.geometry.coordinates[1],
)

const screenProjector = new ScreenProjector(
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

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')!
    context.fillStyle = '#004400'

    const pixelSize = 5
    for (
      let xScreen = 0;
      xScreen < screenProjector.screenSize.x;
      xScreen += pixelSize
    ) {
      for (
        let yScreen = 0;
        yScreen < screenProjector.screenSize.y;
        yScreen += pixelSize
      ) {
        const [xWorld, yWorld] =
          screenProjector.screenPointToCoordinatePoint(xScreen, yScreen)
        const [nearest] = geokdbush.around(index, xWorld, yWorld, 1)
        context.fillStyle = lookupRgb(nearest.properties.leaves)!
        context.fillRect(xScreen, yScreen, pixelSize, pixelSize)
      }
    }

    snapshot.features.forEach(
      ({
        geometry: {
          coordinates: [xWorld, yWorld],
        },
      }) => {
        context.beginPath()
        const [xScreen, yScreen] =
          screenProjector.coordinatePointToScreenPoint(xWorld, yWorld)
        context.arc(xScreen, yScreen, 5, 0, 2 * Math.PI)
        context.stroke()
      },
    )
  }, [canvasRef])
  return (
    <canvas
      ref={canvasRef}
      width={screenProjector.screenSize.x}
      height={screenProjector.screenSize.y}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
      }}
    />
  )
}

export default App
