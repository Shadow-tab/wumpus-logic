export default function Dashboard({ percepts, kbStats, agentPos, gameStatus, message }) {
  const statusColor = {
    idle: 'var(--muted)',
    running: 'var(--accent)',
    won: '#ffd700',
    dead: 'var(--danger)',
    stuck: 'var(--warn)',
  }

  const Divider = () => (
    <div style={{ borderTop: '1px solid var(--border)', margin: '12px 0' }} />
  )

  const Label = ({ children }) => (
    <p style={{
      fontSize: '0.6rem', color: 'var(--muted)',
      letterSpacing: '0.15em', textTransform: 'uppercase',
      fontFamily: 'IBM Plex Mono, monospace', marginBottom: 4
    }}>
      {children}
    </p>
  )

  const Metric = ({ label, value, color }) => (
    <div style={{
      background: 'var(--surface2)', border: '1px solid var(--border)',
      borderRadius: 4, padding: '8px 10px'
    }}>
      <p style={{ fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em', fontFamily: 'IBM Plex Mono, monospace' }}>{label}</p>
      <p style={{ fontSize: '1.3rem', fontWeight: 600, color: color || 'var(--text)', fontFamily: 'IBM Plex Mono, monospace', lineHeight: 1.2, marginTop: 2 }}>{value}</p>
    </div>
  )

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 6, padding: 16,
      fontFamily: 'IBM Plex Mono, monospace'
    }}>
      <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 12 }}>
        System Status
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: statusColor[gameStatus] || 'var(--muted)',
          boxShadow: gameStatus === 'running' ? `0 0 8px var(--accent)` : 'none'
        }} />
        <span style={{ fontSize: '0.75rem', color: statusColor[gameStatus], fontWeight: 600, letterSpacing: '0.1em' }}>
          {gameStatus.toUpperCase()}
        </span>
      </div>
      <p style={{ fontSize: '0.7rem', color: 'var(--text2)', lineHeight: 1.5 }}>{message}</p>

      <Divider />

      <Label>Agent Position</Label>
      <p style={{ fontSize: '1rem', color: 'var(--text)', fontWeight: 500 }}>
        [{agentPos[0]}, {agentPos[1]}]
      </p>

      <Divider />

      <Label>Active Percepts</Label>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <span style={{
          padding: '2px 8px', borderRadius: 3, fontSize: '0.65rem',
          letterSpacing: '0.08em',
          background: percepts.breeze ? '#0d2a4a' : 'var(--surface2)',
          color: percepts.breeze ? 'var(--info)' : 'var(--muted)',
          border: `1px solid ${percepts.breeze ? 'var(--info)' : 'var(--border)'}`,
        }}>BREEZE</span>
        <span style={{
          padding: '2px 8px', borderRadius: 3, fontSize: '0.65rem',
          letterSpacing: '0.08em',
          background: percepts.stench ? '#1a0d3a' : 'var(--surface2)',
          color: percepts.stench ? '#aa44ff' : 'var(--muted)',
          border: `1px solid ${percepts.stench ? '#aa44ff' : 'var(--border)'}`,
        }}>STENCH</span>
        {percepts.gold && (
          <span style={{
            padding: '2px 8px', borderRadius: 3, fontSize: '0.65rem',
            letterSpacing: '0.08em',
            background: '#2a2000', color: '#ffd700',
            border: '1px solid #ffd700',
          }}>GOLD</span>
        )}
      </div>

      <Divider />

      <Label>KB Metrics</Label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        <Metric label="CNF CLAUSES" value={kbStats.clauses} color="var(--accent)" />
        <Metric label="INFER STEPS" value={kbStats.inferenceSteps} color="var(--info)" />
      </div>

      <Divider />

      <Label>Legend</Label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {[
          { color: 'var(--accent)', label: 'Agent  ◈' },
          { color: '#1a3a2a', label: 'Visited / Safe', border: '#2a5a3a' },
          { color: '#0f2a1a', label: 'KB Inferred Safe', border: '#1a3a2a' },
          { color: 'var(--surface2)', label: 'Unknown  —', border: 'var(--border)' },
        ].map(({ color, label, border }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 10, height: 10, borderRadius: 2,
              background: color,
              border: `1px solid ${border || color}`,
              flexShrink: 0
            }} />
            <span style={{ fontSize: '0.65rem', color: 'var(--text2)', letterSpacing: '0.05em' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}