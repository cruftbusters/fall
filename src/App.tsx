import { useEffect, useRef } from 'react'
import snapshot from './latest.json'
import {
  screenFromPoints,
  worldPointToScreenPoint,
} from './ScreenUtils'
import { Screen } from './Types'
import { useScreen } from './useScreen'
import { CanvasLayer } from './CanvasLayer'
import FallLayer from './FallLayer'

const initialScreen = screenFromPoints(
  { x: window.innerWidth, y: window.innerHeight },
  snapshot.features,
  (it) => it.geometry.coordinates[0],
  (it) => it.geometry.coordinates[1],
)

function App() {
  const screen = useScreen(initialScreen)

  const stationLayerRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!stationLayerRef.current) return
    const context = stationLayerRef.current.getContext('2d')!

    drawStationLayer(context, screen)
  }, [stationLayerRef, screen])
  return (
    <>
      <FallLayer screen={screen} />
      <CanvasLayer screen={screen} _ref={stationLayerRef} />
    </>
  )
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
