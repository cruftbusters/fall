import { ScreenProvider } from './useScreen'
import FallLayer from './FallLayer'
import StationLayer from './StationLayer'
import { screenFromPoints } from './ScreenUtils'
import snapshot from './latest.json'
import { BaseLayer } from './BaseLayer'

const initialScreen = screenFromPoints(
  { x: window.innerWidth, y: window.innerHeight },
  snapshot.features,
  (it) => it.geometry.coordinates[0],
  (it) => it.geometry.coordinates[1],
)

function App() {
  return (
    <ScreenProvider initialScreen={initialScreen}>
      <BaseLayer />
      <FallLayer />
      <StationLayer />
    </ScreenProvider>
  )
}

export default App
