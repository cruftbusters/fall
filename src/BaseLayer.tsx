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
    (tx / n) * 360 - 180,
    (Math.atan(Math.sinh(Math.PI * (1 - (2 * ty) / n))) * 180) / Math.PI,
  )
  const [right, bottom] = worldPointToScreenPoint(
    screen,
    ((tx + 1) / n) * 360 - 180,
    (Math.atan(Math.sinh(Math.PI * (1 - (2 * (ty + 1)) / n))) * 180) /
      Math.PI,
  )
  image.onload = () =>
    context.drawImage(image, left, top, right - left, bottom - top)
  image.src = `https://mt0.google.com/vt/lyrs=y&hl=en&x=${tx}&y=${ty}&z=${tz}`
}
