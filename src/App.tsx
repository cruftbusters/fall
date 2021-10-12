import FallLayer from './layer/FallLayer'
import StationLayer from './layer/StationLayer'
import snapshot from './layer/latest.json'
import { BaseLayer } from './layer/BaseLayer'
import { PaneProvider } from './usePane'
import { Vector2 } from './Types'
import { paneStateFromPoints } from './PaneUtils'

function App() {
  return (
    <PaneProvider
      getInitialPaneState={(size: Vector2) =>
        paneStateFromPoints(
          size,
          snapshot.features,
          (it) => it.geometry.coordinates[0],
          (it) => it.geometry.coordinates[1],
        )
      }
    >
      <BaseLayer />
      <FallLayer />
      <StationLayer />
    </PaneProvider>
  )
}

export default App
