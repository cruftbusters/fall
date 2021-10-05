import { useEffect, useRef } from 'react'
import { Screen } from './Types'
import { CanvasLayer } from './CanvasLayer'
import { worldPointToScreenPoint } from './ScreenUtils'
import snapshot from './latest.json'
import useScreen from './useScreen'

export default function StationLayer() {
  const screen = useScreen()
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const context = ref.current.getContext('2d')!

    drawStationLayer(context, screen)
  }, [ref, screen])
  return <CanvasLayer _ref={ref} />
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
