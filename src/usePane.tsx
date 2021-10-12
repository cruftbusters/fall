import { PaneState, Vector2 } from './Types'
import { ReactNode, useContext, useEffect, useState } from 'react'
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
}

export function PaneProvider({
  getInitialPaneState,
  children,
}: PaneProviderProps) {
  const [paneState, setPaneState] = useState<PaneState>(defaultPaneState)
  const size = useWindowSize()
  useEffect(
    () =>
      setPaneState((pane) =>
        pane === defaultPaneState
          ? getInitialPaneState(size)
          : { ...pane, size },
      ),
    [getInitialPaneState, size],
  )
  return <context.Provider value={paneState} children={children} />
}

function useWindowSize() {
  const [size, setSize] = useState<Vector2>({
    x: window.innerWidth,
    y: window.innerHeight,
  })

  useEffect(() => {
    const onResize = () => {
      setSize({
        x: window.innerWidth,
        y: window.innerHeight,
      })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return size
}

export default function usePane() {
  return useContext(context)
}
