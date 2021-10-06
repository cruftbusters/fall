import { useEffect, useRef } from 'react'
import { CanvasLayer } from './CanvasLayer'
import { worldPointToScreenPoint } from './ScreenUtils'
import { Screen } from './Types'
import useScreen from './useScreen'

export function BaseLayer() {
  const ref = useRef<HTMLCanvasElement>(null)
  const screen = useScreen()
  useEffect(() => {
    if (!ref.current) return
    const context = ref.current.getContext('2d')!
    for (let x = 28; x < 33; x++) {
      for (let y = 43; y < 48; y++) {
        drawBaseTile(context, screen, x, y, 7)
      }
    }
  }, [ref, screen])
  return <CanvasLayer _ref={ref} />
}

async function drawBaseTile(
  context: CanvasRenderingContext2D,
  screen: Screen,
  tx: number,
  ty: number,
  tz: number,
) {
  const n = Math.pow(2, tz)

  const image = new Image()
  const [left, top] = worldPointToScreenPoint(
    screen,
    xTileToLongitude(tx, n),
    yTileToLatitude(ty, n),
  )
  const [right, bottom] = worldPointToScreenPoint(
    screen,
    xTileToLongitude(tx + 1, n),
    yTileToLatitude(ty + 1, n),
  )
  image.onload = () =>
    context.drawImage(image, left, top, right - left, bottom - top)
  image.src = `https://mt0.google.com/vt/lyrs=y&hl=en&x=${tx}&y=${ty}&z=${tz}`
}

const xTileToLongitude = (xTile: number, n: number) =>
  (xTile / n) * 360 - 180

const yTileToLatitude = (yTile: number, n: number) =>
  (Math.atan(Math.sinh(Math.PI * (1 - (2 * yTile) / n))) * 180) / Math.PI
