import { Pane, Vector2 } from './Types'
import { ReactNode, useContext, useEffect, useState } from 'react'
import { createContext } from 'react'

const defaultPane = {
  center: { x: 0, y: 0 },
  zoom: 1,
  size: { x: window.innerWidth, y: window.innerHeight },
}

const context = createContext<Pane>(defaultPane)

interface PaneProviderProps {
  getInitialPane: (size: Vector2) => Pane
  children: ReactNode
}

export function PaneProvider({
  getInitialPane,
  children,
}: PaneProviderProps) {
  const [pane, setPane] = useState<Pane>(defaultPane)
  const size = useWindowSize()
  useEffect(
    () =>
      setPane((pane) =>
        pane === defaultPane ? getInitialPane(size) : { ...pane, size },
      ),
    [getInitialPane, size],
  )
  return <context.Provider value={pane} children={children} />
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
