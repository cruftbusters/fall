import { RefObject } from 'react'
import useScreen from './useScreen'

export function CanvasLayer({
  _ref,
}: {
  _ref: RefObject<HTMLCanvasElement>
}) {
  const {
    size: { x: width, y: height },
  } = useScreen()
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
