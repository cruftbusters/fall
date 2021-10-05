import { Screen, Vector2 } from './Types'

export function screenFromPoints<PointType>(
  size: Vector2,
  points: Array<PointType>,
  fx: (point: PointType) => number,
  fy: (point: PointType) => number,
) {
  const xs = points.map(fx)
  const ys = points.map(fy)
  const left = Math.min(...xs)
  const right = Math.max(...xs)
  const top = Math.max(...ys)
  const bottom = Math.min(...ys)

  return {
    center: {
      x: (right - left) / 2 + left,
      y: (top - bottom) / 2 + bottom,
    },
    zoom: Math.pow(
      Math.max((right - left) / size.x, (top - bottom) / size.y),
      0.975,
    ),
    size,
  } as Screen
}

export function screenPointToWorldPoint(
  { size, zoom, center }: Screen,
  x: number,
  y: number,
) {
  return [
    (x - size.x / 2) * zoom + center.x,
    (-y + size.y / 2) * zoom + center.y,
  ]
}

export function worldPointToScreenPoint(
  { size, zoom, center }: Screen,
  a: number,
  b: number,
) {
  return [
    (a - center.x) / zoom + size.x / 2,
    (-b + center.y) / zoom + size.y / 2,
  ]
}
