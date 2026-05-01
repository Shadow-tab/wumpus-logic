export default function KBViewer({ kbStats }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 6, padding: 16,
      fontFamily: 'IBM Plex Mono, monospace'
    }}>
      <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 12 }}>
        Inference Engine
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { label: 'KB stores clauses in strict CNF', status: 'active' },
          { label: 'tell() converts PL formula → CNF', status: 'active' },
          { label: 'ask() runs Resolution Refutation', status: 'active' },
          { label: 'Proves ¬Pit ∧ ¬Wumpus before move', status: 'active' },
        ].map(({ label, status }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 5, height: 5, borderRadius: '50%',
              background: 'var(--accent)', flexShrink: 0,
              boxShadow: '0 0 6px var(--accent)'
            }} />
            <span style={{ fontSize: '0.65rem', color: 'var(--text2)', lineHeight: 1.4 }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}