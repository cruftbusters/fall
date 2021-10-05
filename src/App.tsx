import KDBush from 'kdbush'
import geokdbush from 'geokdbush'
import { useEffect, useRef } from 'react'
import snapshot from './latest.json'
import {
  screenFromPoints,
  screenPointToWorldPoint,
  worldPointToScreenPoint,
} from './ScreenUtils'
import { Screen } from './Types'
import minnesota from './minnesota.json'
import { polygonContains } from 'd3-polygon'
import { useScreen } from './useScreen'

const index = new KDBush(
  snapshot.features,
  (it) => it.geometry.coordinates[0],
  (it) => it.geometry.coordinates[1],
)

const initialScreen = screenFromPoints(
  { x: window.innerWidth, y: window.innerHeight },
  snapshot.features,
  (it) => it.geometry.coordinates[0],
  (it) => it.geometry.coordinates[1],
)

const minnesotaLoop = minnesota.features[0].geometry.coordinates[0][0] as [
  number,
  number,
][]

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const detailTimeoutRef = useRef<NodeJS.Timeout>()
  const screen = useScreen(initialScreen)
  useEffect(() => {
    if (!canvasRef.current) return
    const context = canvasRef.current.getContext('2d')!

    drawFallLayer(context, screen, 25)
    drawStationLayer(context, screen)

    if (detailTimeoutRef.current) clearTimeout(detailTimeoutRef.current)
    detailTimeoutRef.current = setTimeout(() => {
      drawFallLayer(context, screen, 5)
      drawStationLayer(context, screen)
    }, 125)
  }, [canvasRef, screen])
  return (
    <canvas
      ref={canvasRef}
      width={screen.size.x}
      height={screen.size.y}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
      }}
    />
  )
}

function drawFallLayer(
  context: CanvasRenderingContext2D,
  screen: Screen,
  pixelSize: number,
) {
  for (let xScreen = 0; xScreen < screen.size.x; xScreen += pixelSize) {
    for (let yScreen = 0; yScreen < screen.size.y; yScreen += pixelSize) {
      const [xWorld, yWorld] = screenPointToWorldPoint(
        screen,
        xScreen + pixelSize / 2,
        yScreen + pixelSize / 2,
      )
      if (polygonContains(minnesotaLoop, [xWorld, yWorld])) {
        const [nearest] = geokdbush.around(index, xWorld, yWorld, 1)
        context.fillStyle = lookupRgb(nearest.properties.leaves)!
        context.fillRect(xScreen, yScreen, pixelSize, pixelSize)
      }
    }
  }
}

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

function drawStationLayer(
  context: CanvasRenderingContext2D,
  screen: Screen,
) {
  snapshot.features.forEach(
    ({
      geometry: {
        coordinates: [xWorld, yWorld],
      },
    }) => {
      context.beginPath()
      const [xScreen, yScreen] = worldPointToScreenPoint(
        screen,
        xWorld,
        yWorld,
      )
      context.arc(xScreen, yScreen, 5, 0, 2 * Math.PI)
      context.stroke()
    },
  )
}

export default App
