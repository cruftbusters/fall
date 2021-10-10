import KDBush from 'kdbush'
import geokdbush from 'geokdbush'
import minnesota from './minnesota.json'
import snapshot from './latest.json'
import usePane from '../usePane'
import { CanvasLayer } from './CanvasLayer'
import { Pane } from '../Types'
import { panePointToWorldPoint } from '../PaneUtils'
import { polygonContains } from 'd3-polygon'
import { useEffect, useRef } from 'react'

const index = new KDBush(
  snapshot.features,
  (it) => it.geometry.coordinates[0],
  (it) => it.geometry.coordinates[1],
)

const minnesotaLoop = minnesota.features[0].geometry.coordinates[0][0] as [
  number,
  number,
][]

export default function FallLayer() {
  const pane = usePane()
  const ref = useRef<HTMLCanvasElement>(null)
  const detailTimeoutRef = useRef<NodeJS.Timeout>()
  useEffect(() => {
    if (!ref.current) return
    const context = ref.current.getContext('2d')!

    drawFallLayer(context, pane, 25)

    if (detailTimeoutRef.current) clearTimeout(detailTimeoutRef.current)
    detailTimeoutRef.current = setTimeout(() => {
      drawFallLayer(context, pane, 5)
    }, 125)
  }, [ref, pane])

  return <CanvasLayer _ref={ref} style={{ opacity: 0.675 }} />
}

function drawFallLayer(
  context: CanvasRenderingContext2D,
  pane: Pane,
  pixelSize: number,
) {
  for (let xPane = 0; xPane < pane.size.x; xPane += pixelSize) {
    for (let yPane = 0; yPane < pane.size.y; yPane += pixelSize) {
      const [xWorld, yWorld] = panePointToWorldPoint(
        pane,
        xPane + pixelSize / 2,
        yPane + pixelSize / 2,
      )
      if (polygonContains(minnesotaLoop, [xWorld, yWorld])) {
        const [nearest] = geokdbush.around(index, xWorld, yWorld, 1)
        context.fillStyle = lookupRgb(nearest.properties.leaves)!
        context.fillRect(xPane, yPane, pixelSize, pixelSize)
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
