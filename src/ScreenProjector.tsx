import { Vector2 } from './Types'

export class ScreenProjector<CoordinateType> {
  center: Vector2
  zoom: number
  screenSize: Vector2

  constructor(
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

    const screenSize = { x: window.innerWidth, y: window.innerHeight }

    this.center = {
      x: (right - left) / 2 + left,
      y: (top - bottom) / 2 + bottom,
    }

    this.zoom = Math.pow(
      Math.max(
        (right - left) / screenSize.x,
        (top - bottom) / screenSize.y,
      ),
      0.975,
    )

    this.screenSize = screenSize
  }

  screenPointToCoordinatePoint(x: number, y: number) {
    return [
      (x - this.screenSize.x / 2) * this.zoom + this.center.x,
      (-y + this.screenSize.y / 2) * this.zoom + this.center.y,
    ]
  }

  coordinatePointToScreenPoint(a: number, b: number) {
    return [
      (a - this.center.x) / this.zoom + this.screenSize.x / 2,
      (-b + this.center.y) / this.zoom + this.screenSize.y / 2,
    ]
  }
}
