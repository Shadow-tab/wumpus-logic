export default function Controls({
  rows, setRows, cols, setCols,
  gameStatus, startGame, stepGame,
  runAuto, stopAuto, reset
}) {
  const Btn = ({ onClick, disabled, color, children }) => (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? 'var(--surface2)' : color,
      color: disabled ? 'var(--muted)' : '#000',
      border: `1px solid ${disabled ? 'var(--border)' : color}`,
      borderRadius: 4, padding: '8px 0',
      fontFamily: 'IBM Plex Mono, monospace',
      fontSize: '0.7rem', letterSpacing: '0.1em',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontWeight: 600, transition: 'all 0.15s ease',
      width: '100%',
    }}>
      {children}
    </button>
  )

  const InputField = ({ label, value, onChange, disabled }) => (
    <div>
      <p style={{
        fontSize: '0.6rem', color: 'var(--muted)',
        letterSpacing: '0.15em', textTransform: 'uppercase',
        fontFamily: 'IBM Plex Mono, monospace', marginBottom: 4
      }}>{label}</p>
      <input
        type="number" min={3} max={8}
        value={value} onChange={e => onChange(Number(e.target.value))}
        disabled={disabled}
        style={{
          width: '100%', background: 'var(--surface2)',
          border: '1px solid var(--border)', borderRadius: 4,
          padding: '7px 10px', color: 'var(--text)',
          fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.85rem',
          outline: 'none', opacity: disabled ? 0.4 : 1,
        }}
      />
    </div>
  )

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 6, padding: 16,
      fontFamily: 'IBM Plex Mono, monospace'
    }}>
      <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 12 }}>
        Controls
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
        <InputField label="Rows" value={rows} onChange={setRows} disabled={gameStatus === 'running'} />
        <InputField label="Cols" value={cols} onChange={setCols} disabled={gameStatus === 'running'} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Btn onClick={startGame} color="var(--accent)">
          INIT NEW EPISODE
        </Btn>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <Btn onClick={stepGame} disabled={gameStatus !== 'running'} color="#4488ff">
            STEP
          </Btn>
          <Btn onClick={runAuto} disabled={gameStatus !== 'running'} color="#8844ff">
            AUTO RUN
          </Btn>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <Btn onClick={stopAuto} disabled={gameStatus !== 'running'} color="var(--warn)">
            PAUSE
          </Btn>
          <Btn onClick={reset} color="#555555">
            RESET
          </Btn>
        </div>
      </div>
    </div>
  )
}