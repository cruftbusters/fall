import { Screen, Vector2 } from './Types'

export function fromPoints<CoordinateType>(
  screenSize: Vector2,
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

  return new ScreenProjector({
    center: {
      x: (right - left) / 2 + left,
      y: (top - bottom) / 2 + bottom,
    },
    zoom: Math.pow(
      Math.max(
        (right - left) / screenSize.x,
        (top - bottom) / screenSize.y,
      ),
      0.975,
    ),
    screenSize,
  })
}

export class ScreenProjector {
  screen: Screen

  constructor(screen: Screen) {
    this.screen = screen
  }

  setScreenSize(screenSize: Vector2) {
    this.screen.screenSize = screenSize
  }

  screenPointToCoordinatePoint(x: number, y: number) {
    const { screenSize, zoom, center } = this.screen
    return [
      (x - screenSize.x / 2) * zoom + center.x,
      (-y + screenSize.y / 2) * zoom + center.y,
    ]
  }

  coordinatePointToScreenPoint(a: number, b: number) {
    const { screenSize, zoom, center } = this.screen
    return [
      (a - center.x) / zoom + screenSize.x / 2,
      (-b + center.y) / zoom + screenSize.y / 2,
    ]
  }
}
