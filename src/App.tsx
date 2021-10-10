import FallLayer from './layer/FallLayer'
import StationLayer from './layer/StationLayer'
import snapshot from './layer/latest.json'
import { BaseLayer } from './layer/BaseLayer'
import { ScreenProvider } from './useScreen'
import { screenFromPoints } from './ScreenUtils'

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
