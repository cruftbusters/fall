import { useEffect, useRef } from 'react'
import { Screen } from './Types'
import { CanvasLayer } from './CanvasLayer'
import { screenPointToWorldPoint } from './ScreenUtils'
import { polygonContains } from 'd3-polygon'
import minnesota from './minnesota.json'
import snapshot from './latest.json'
import KDBush from 'kdbush'
import geokdbush from 'geokdbush'
import useScreen from './useScreen'

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
  const screen = useScreen()
  const ref = useRef<HTMLCanvasElement>(null)
  const detailTimeoutRef = useRef<NodeJS.Timeout>()
  useEffect(() => {
    if (!ref.current) return
    const context = ref.current.getContext('2d')!

    drawFallLayer(context, screen, 25)

    if (detailTimeoutRef.current) clearTimeout(detailTimeoutRef.current)
    detailTimeoutRef.current = setTimeout(() => {
      drawFallLayer(context, screen, 5)
    }, 125)
  }, [ref, screen])

  return <CanvasLayer _ref={ref} />
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
