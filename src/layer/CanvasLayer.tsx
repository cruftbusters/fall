import useScreen from '../useScreen'
import { CSSProperties, RefObject } from 'react'

interface CanvasLayerProps {
  _ref: RefObject<HTMLCanvasElement>
  style?: CSSProperties
}

export function CanvasLayer({ _ref, style }: CanvasLayerProps) {
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
        ...style,
      }}
      ref={_ref}
    />
  )
}
