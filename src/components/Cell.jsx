export default function Cell({ cell, status, isAgent, row, col }) {
  const getBg = () => {
    if (isAgent) return 'cell-agent'
    if (status === 'safe') return 'cell-safe'
    if (status === 'inferred-safe') return 'cell-inferred'
    return 'cell-unknown'
  }

  const getContent = () => {
    if (isAgent) return <span style={{ fontSize: '1.1rem' }}>◈</span>
    if (cell?.hasPit && status === 'safe') return <span style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>PIT</span>
    if (cell?.hasWumpus && status === 'safe') return <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>WMP</span>
    if (cell?.hasGold && status === 'safe') return <span style={{ color: '#ffd700', fontSize: '0.9rem' }}>GLD</span>
    if (status === 'unknown') return <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>—</span>
    if (status === 'inferred-safe') return <span style={{ color: 'var(--accent2)', fontSize: '0.7rem' }}>SAFE</span>
    return null
  }

  const getPercepts = () => {
    if (status !== 'safe' && !isAgent) return null
    const p = []
    if (cell?.breeze) p.push(<span key="b" style={{ color: 'var(--info)', fontSize: '0.55rem' }}>BRZ</span>)
    if (cell?.stench) p.push(<span key="s" style={{ color: '#aa44ff', fontSize: '0.55rem' }}>STN</span>)
    return p.length ? <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>{p}</div> : null
  }

  return (
    <div className={getBg()} style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      aspectRatio: '1',
      border: '1px solid var(--border)',
      borderRadius: '4px',
      transition: 'all 0.2s ease',
      fontFamily: 'IBM Plex Mono, monospace',
    }}>
      <span style={{
        position: 'absolute', top: 3, left: 4,
        fontSize: '0.5rem', color: 'var(--muted)',
        fontFamily: 'IBM Plex Mono, monospace',
        letterSpacing: '0.05em'
      }}>
        {row},{col}
      </span>
      {getContent()}
      {getPercepts()}
    </div>
  )
}