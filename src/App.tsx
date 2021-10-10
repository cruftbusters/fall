import FallLayer from './layer/FallLayer'
import StationLayer from './layer/StationLayer'
import snapshot from './layer/latest.json'
import { BaseLayer } from './layer/BaseLayer'
import { PaneProvider } from './usePane'
import { paneFromPoints } from './PaneUtils'

const initialPane = paneFromPoints(
  { x: window.innerWidth, y: window.innerHeight },
  snapshot.features,
  (it) => it.geometry.coordinates[0],
  (it) => it.geometry.coordinates[1],
)

function App() {
  return (
    <PaneProvider initialPane={initialPane}>
      <BaseLayer />
      <FallLayer />
      <StationLayer />
    </PaneProvider>
  )
}

export default App
