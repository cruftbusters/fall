import FallLayer from './layer/FallLayer'
import StationLayer from './layer/StationLayer'
import snapshot from './layer/latest.json'
import { BaseLayer } from './layer/BaseLayer'
import { Pane } from './usePane'
import { Vector2 } from './Types'
import { paneStateFromPoints } from './PaneUtils'
import { useCallback } from 'react'

function App() {
  const getInitialPaneState = useCallback(
    (size: Vector2) =>
      paneStateFromPoints(
        size,
        snapshot.features,
        (it) => it.geometry.coordinates[0],
        (it) => it.geometry.coordinates[1],
      ),
    [],
  )
  return (
    <Pane getInitialPaneState={getInitialPaneState}>
      <BaseLayer />
      <FallLayer />
      <StationLayer />
    </Pane>
  )
}

export default App
