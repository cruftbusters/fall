import usePane from '../usePane'
import { CanvasLayer } from './CanvasLayer'
import { Pane } from '../Types'
import { panePointToWorldPoint, worldPointToPanePoint } from '../PaneUtils'
import { useEffect, useRef } from 'react'

export function BaseLayer() {
  const ref = useRef<HTMLCanvasElement>(null)
  const pane = usePane()
  useEffect(() => {
    if (!ref.current) return
    const context = ref.current.getContext('2d')!

    const [worldLeft, worldTop] = panePointToWorldPoint(pane, 0, 0)
    const [worldRight, worldBottom] = panePointToWorldPoint(
      pane,
      pane.size.x,
      pane.size.y,
    )

    const zoom = 7
    const n = Math.pow(2, zoom)

    const [xTileStart, yTileStart] = latLonToTile(worldLeft, worldTop, n)
    const [xTileEnd, yTileEnd] = latLonToTile(worldRight, worldBottom, n)

    for (let xTile = xTileStart; xTile <= xTileEnd; xTile++) {
      for (let yTile = yTileStart; yTile <= yTileEnd; yTile++) {
        fetchBaseTile(xTile, yTile, zoom).then((image) => {
          const [paneLeft, paneTop, paneRight, paneBottom] =
            tileToPaneEnvelope(pane, xTile, yTile, n)
          context.drawImage(
            image,
            paneLeft,
            paneTop,
            paneRight - paneLeft,
            paneBottom - paneTop,
          )
        })
      }
    }
  }, [ref, pane])
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

const tileToPaneEnvelope = (
  pane: Pane,
  xTile: number,
  yTile: number,
  n: number,
) => [
  ...tileTopLeftToPanePoint(pane, xTile, yTile, n),
  ...tileTopLeftToPanePoint(pane, xTile + 1, yTile + 1, n),
]

const tileTopLeftToPanePoint = (
  pane: Pane,
  xTile: number,
  yTile: number,
  n: number,
) =>
  worldPointToPanePoint(
    pane,
    (xTile / n) * 360 - 180,
    (Math.atan(Math.sinh(Math.PI * (1 - (2 * yTile) / n))) * 180) /
      Math.PI,
  )
