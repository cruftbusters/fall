import useScreen from '../useScreen'
import { CanvasLayer } from './CanvasLayer'
import { Screen } from '../Types'
import {
  screenPointToWorldPoint,
  worldPointToScreenPoint,
} from '../ScreenUtils'
import { useEffect, useRef } from 'react'

export function BaseLayer() {
  const ref = useRef<HTMLCanvasElement>(null)
  const screen = useScreen()
  useEffect(() => {
    if (!ref.current) return
    const context = ref.current.getContext('2d')!

    const [worldLeft, worldTop] = screenPointToWorldPoint(screen, 0, 0)
    const [worldRight, worldBottom] = screenPointToWorldPoint(
      screen,
      screen.size.x,
      screen.size.y,
    )

    const zoom = 7
    const n = Math.pow(2, zoom)

    const [xTileStart, yTileStart] = latLonToTile(worldLeft, worldTop, n)
    const [xTileEnd, yTileEnd] = latLonToTile(worldRight, worldBottom, n)

    for (let xTile = xTileStart; xTile <= xTileEnd; xTile++) {
      for (let yTile = yTileStart; yTile <= yTileEnd; yTile++) {
        fetchBaseTile(xTile, yTile, zoom).then((image) => {
          const [screenLeft, screenTop, screenRight, screenBottom] =
            tileToScreenEnvelope(screen, xTile, yTile, n)
          context.drawImage(
            image,
            screenLeft,
            screenTop,
            screenRight - screenLeft,
            screenBottom - screenTop,
          )
        })
      }
    }
  }, [ref, screen])
  return <CanvasLayer _ref={ref} />
}

const latLonToTile = (longitude: number, latitude: number, n: number) => {
  const latitudeRadians = (latitude / 180) * Math.PI
  return [
    Math.floor(n * ((longitude + 180) / 360)),
    Math.floor(
      (n *
        (1 -
          Math.log(
            Math.tan(latitudeRadians) + 1 / Math.cos(latitudeRadians),
          ) /
            Math.PI)) /
        2,
    ),
  ]
}

const fetchBaseTile = (tx: number, ty: number, tz: number) =>
  new Promise<HTMLImageElement>((resolve) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.src = `https://mt0.google.com/vt/lyrs=y&hl=en&x=${tx}&y=${ty}&z=${tz}`
  })

const tileToScreenEnvelope = (
  screen: Screen,
  xTile: number,
  yTile: number,
  n: number,
) => [
  ...tileTopLeftToScreenPoint(screen, xTile, yTile, n),
  ...tileTopLeftToScreenPoint(screen, xTile + 1, yTile + 1, n),
]

const tileTopLeftToScreenPoint = (
  screen: Screen,
  xTile: number,
  yTile: number,
  n: number,
) =>
  worldPointToScreenPoint(
    screen,
    (xTile / n) * 360 - 180,
    (Math.atan(Math.sinh(Math.PI * (1 - (2 * yTile) / n))) * 180) /
      Math.PI,
  )
