import { ReactNode, useContext, useEffect, useState } from 'react'
import { Screen, Vector2 } from './Types'
import { createContext } from 'react'

const context = createContext<Screen>({
  center: { x: 0, y: 0 },
  zoom: 1,
  size: { x: window.innerWidth, y: window.innerHeight },
})

export function ScreenProvider({
  initialScreen,
  children,
}: {
  initialScreen: Screen
  children: ReactNode
}) {
  const [screen, setScreen] = useState<Screen>(initialScreen)
  const size = useScreenSize()
  useEffect(() => setScreen((screen) => ({ ...screen, size })), [size])
  return <context.Provider value={screen} children={children} />
}

function useScreenSize() {
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

export default function useScreen() {
  return useContext(context)
}
