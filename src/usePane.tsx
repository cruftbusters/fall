import { Pane, Vector2 } from './Types'
import { ReactNode, useContext, useEffect, useState } from 'react'
import { createContext } from 'react'

const context = createContext<Pane>({
  center: { x: 0, y: 0 },
  zoom: 1,
  size: { x: window.innerWidth, y: window.innerHeight },
})

interface PaneProviderProps {
  initialPane: Pane
  children: ReactNode
}

export function PaneProvider({
  initialPane,
  children,
}: PaneProviderProps) {
  const [pane, setPane] = useState<Pane>(initialPane)
  const size = useWindowSize()
  useEffect(() => setPane((pane) => ({ ...pane, size })), [size])
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
