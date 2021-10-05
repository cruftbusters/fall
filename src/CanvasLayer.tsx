import { RefObject } from 'react'
import { Screen } from './Types'

export function CanvasLayer({
  screen: {
    size: { x: width, y: height },
  },
  _ref,
}: {
  screen: Screen
  _ref: RefObject<HTMLCanvasElement>
}) {
  return (
    <canvas
      width={width}
      height={height}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        position: 'absolute',
      }}
      ref={_ref}
    />
  )
}
