import FallLayer from './layer/FallLayer'
import StationLayer from './layer/StationLayer'
import snapshot from './layer/latest.json'
import { BaseLayer } from './layer/BaseLayer'
import { Pane } from './usePane'
import { Vector2 } from './Types'
import { paneStateFromPoints } from './PaneUtils'
import { CSSProperties, useCallback } from 'react'

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
    <div style={{ height: '100%', display: 'flex' }}>
      <Sidebar
        style={{
          flex: '0 1 auto',
          maxWidth: '40vw',
          height: '100%',
          overflowY: 'auto',
          margin: '0 1em',
        }}
      />
      <Pane
        getInitialPaneState={getInitialPaneState}
        style={{ position: 'relative', flex: '1 1 auto' }}
      >
        <BaseLayer />
        <FallLayer />
        <StationLayer />
      </Pane>
    </div>
  )
}

interface SidebarProps {
  style: CSSProperties
}

function Sidebar({ style }: SidebarProps) {
  return (
    <div style={style}>
      <h1>Fall Color Map</h1>
      <p>
        This map estimates the state of fall colors in Minnesota for tree
        leaves. Temporarily it is hard-coded to a snapshot of a day in
        September 2021. Measurements are taken at many Minnesota state
        parks and the measurements between them are interpolated in your
        browser using only the value of the nearest state park measurement.
      </p>
    </div>
  )
}

export default App
