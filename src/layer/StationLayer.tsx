import snapshot from './latest.json'
import usePane from '../usePane'
import { CanvasLayer } from './CanvasLayer'
import { Pane } from '../Types'
import { useEffect, useRef } from 'react'
import { worldPointToPanePoint } from '../PaneUtils'

export default function StationLayer() {
  const pane = usePane()
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const context = ref.current.getContext('2d')!

    drawStationLayer(context, pane)
  }, [ref, pane])
  return <CanvasLayer _ref={ref} />
}

function drawStationLayer(context: CanvasRenderingContext2D, pane: Pane) {
  snapshot.features.forEach(
    ({
      geometry: {
        coordinates: [xWorld, yWorld],
      },
    }) => {
      context.beginPath()
      const [xPane, yPane] = worldPointToPanePoint(pane, xWorld, yWorld)
      context.arc(xPane, yPane, 5, 0, 2 * Math.PI)
      context.stroke()
    },
  )
}
