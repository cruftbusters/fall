import { useEffect, useRef } from 'react'
import { Screen } from './Types'
import { CanvasLayer } from './CanvasLayer'
import { worldPointToScreenPoint } from './ScreenUtils'
import snapshot from './latest.json'

export default function StationLayer({ screen }: { screen: Screen }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const context = ref.current.getContext('2d')!

    drawStationLayer(context, screen)
  }, [ref, screen])
  return <CanvasLayer screen={screen} _ref={ref} />
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
