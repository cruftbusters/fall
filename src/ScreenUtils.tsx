import { Screen, Vector2 } from './Types'

export function screenFromPoints<CoordinateType>(
  size: Vector2,
  coordinates: Array<CoordinateType>,
  fx: (coordinate: CoordinateType) => number,
  fy: (coordinate: CoordinateType) => number,
) {
  const xs = coordinates.map(fx)
  const ys = coordinates.map(fy)
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

export function screenPointToCoordinatePoint(
  { size: screenSize, zoom, center }: Screen,
  x: number,
  y: number,
) {
  return [
    (x - screenSize.x / 2) * zoom + center.x,
    (-y + screenSize.y / 2) * zoom + center.y,
  ]
}

export function coordinatePointToScreenPoint(
  { size: screenSize, zoom, center }: Screen,
  a: number,
  b: number,
) {
  return [
    (a - center.x) / zoom + screenSize.x / 2,
    (-b + center.y) / zoom + screenSize.y / 2,
  ]
}
