import { useEffect, useState } from 'react'
import { Screen, Vector2 } from './Types'

export function useScreen(initialScreen: Screen) {
  const [screen, setScreen] = useState(initialScreen)
  const screenSize = useScreenSize()
  useEffect(
    () => setScreen((screen) => ({ ...screen, size: screenSize })),
    [screenSize],
  )
  return screen
}

function useScreenSize() {
  const [screenSize, setScreenSize] = useState<Vector2>({
    x: window.innerWidth,
    y: window.innerHeight,
  })

  useEffect(() => {
    const onResize = () => {
      setScreenSize({
        x: window.innerWidth,
        y: window.innerHeight,
      })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return screenSize
}
