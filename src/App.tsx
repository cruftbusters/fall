import FallLayer from './layer/FallLayer'
import StationLayer from './layer/StationLayer'
import snapshot from './layer/latest.json'
import { BaseLayer } from './layer/BaseLayer'
import { Pane } from './usePane'
import { Vector2 } from './Types'
import { paneStateFromPoints } from './PaneUtils'

function App() {
  return (
    <Pane
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
    </Pane>
  )
}

export default App
