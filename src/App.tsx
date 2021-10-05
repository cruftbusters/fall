import snapshot from './latest.json'
import { screenFromPoints } from './ScreenUtils'
import { useScreen } from './useScreen'
import FallLayer from './FallLayer'
import StationLayer from './StationLayer'

const initialScreen = screenFromPoints(
  { x: window.innerWidth, y: window.innerHeight },
  snapshot.features,
  (it) => it.geometry.coordinates[0],
  (it) => it.geometry.coordinates[1],
)

function App() {
  const screen = useScreen(initialScreen)
  return (
    <>
      <FallLayer screen={screen} />
      <StationLayer screen={screen} />
    </>
  )
}

export default App
