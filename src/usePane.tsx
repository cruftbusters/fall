import { PaneState, Vector2 } from './Types'
import {
  CSSProperties,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { createContext } from 'react'

const defaultPaneState = {
  center: { x: 0, y: 0 },
  zoom: 1,
  size: { x: window.innerWidth, y: window.innerHeight },
}

const context = createContext<PaneState>(defaultPaneState)

interface PaneProviderProps {
  getInitialPaneState: (size: Vector2) => PaneState
  children: ReactNode
  style?: CSSProperties
}

export function Pane({
  getInitialPaneState,
  children,
  style = { height: '100%' },
}: PaneProviderProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [paneState, setPaneState] = useState<PaneState>(defaultPaneState)

  useEffect(() => {
    if (!ref.current) return
    const pane = ref.current

    const onResize = () => {
      setPaneState((paneState) => ({
        ...paneState,
        size: {
          x: pane.clientWidth,
          y: pane.clientHeight,
        },
      }))
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [ref, paneState])

  useEffect(() => {
    if (!ref.current) return
    const pane = ref.current

    if (paneStateEquals(paneState, defaultPaneState))
      setPaneState(
        getInitialPaneState({ x: pane.clientWidth, y: pane.clientHeight }),
      )
  }, [ref, paneState, getInitialPaneState])

  return (
    <div ref={ref} style={style}>
      <context.Provider value={paneState} children={children} />
    </div>
  )
}

function paneStateEquals(p1: PaneState, p2: PaneState) {
  return (
    vector2Equals(p1.center, p2.center) &&
    vector2Equals(p1.size, p2.size) &&
    p1.zoom === p2.zoom
  )
}

function vector2Equals(v1: Vector2, v2: Vector2) {
  return v1.x === v2.x && v1.y === v2.y
}

export default function usePane() {
  return useContext(context)
}
