import Cell from './Cell'

export default function Grid({ gridState, agentPos, cellStatuses, rows, cols }) {
  if (!gridState) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '260px', color: 'var(--muted)',
        fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem',
        letterSpacing: '0.1em', border: '1px dashed var(--border)',
        borderRadius: '6px'
      }}>
        AWAITING INITIALIZATION
      </div>
    )
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      gap: '6px',
      width: '100%',
    }}>
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const key = `${r},${c}`
          return (
            <Cell
              key={key}
              row={r} col={c}
              cell={gridState[r]?.[c]}
              status={cellStatuses[key] || 'unknown'}
              isAgent={agentPos[0] === r && agentPos[1] === c}
            />
          )
        })
      )}
    </div>
  )
}