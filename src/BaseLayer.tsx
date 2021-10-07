import { useEffect, useRef } from 'react'
import { CanvasLayer } from './CanvasLayer'
import {
  screenPointToWorldPoint,
  worldPointToScreenPoint,
} from './ScreenUtils'
import { Screen } from './Types'
import useScreen from './useScreen'

export function BaseLayer() {
  const ref = useRef<HTMLCanvasElement>(null)
  const screen = useScreen()
  useEffect(() => {
    if (!ref.current) return
    const context = ref.current.getContext('2d')!

    const [left, top] = screenPointToWorldPoint(screen, 0, 0)
    const [right, bottom] = screenPointToWorldPoint(
      screen,
      screen.size.x,
      screen.size.y,
    )

    const zoom = 7
    const n = Math.pow(2, zoom)

    const slippyLeft = Math.floor(longitudeToXTile(left, n))
    const slippyTop = Math.floor(latitudeToYTile(top, n))
    const slippyRight = Math.ceil(longitudeToXTile(right, n))
    const slippyBottom = Math.ceil(latitudeToYTile(bottom, n))

    for (let x = slippyLeft; x <= slippyRight; x++) {
      for (let y = slippyTop; y <= slippyBottom; y++) {
        drawBaseTile(context, screen, x, y, zoom)
      }
    }
  }, [ref, screen])
  return <CanvasLayer _ref={ref} />
}

const longitudeToXTile = (longitude: number, n: number) =>
  n * ((longitude + 180) / 360)

const latitudeToYTile = (latitude: number, n: number) => {
  const latitudeRadians = (latitude / 180) * Math.PI
  return (
    (n *
      (1 -
        Math.log(
          Math.tan(latitudeRadians) + 1 / Math.cos(latitudeRadians),
        ) /
          Math.PI)) /
    2
  )
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
