import Grid from './components/Grid'
import Dashboard from './components/Dashboard'
import Controls from './components/Controls'
import KBViewer from './components/KBViewer'
import { useWumpusGame } from './hooks/useWumpusGame'

export default function App() {
  const game = useWumpusGame()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div style={{
          borderBottom: '1px solid var(--border)',
          paddingBottom: 16, marginBottom: 24
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <h1 style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '1.4rem', fontWeight: 600,
              color: 'var(--text)', letterSpacing: '-0.02em'
            }}>
              WUMPUS<span style={{ color: 'var(--accent)' }}>LOGIC</span>
            </h1>
            <span style={{
              fontSize: '0.6rem', color: 'var(--muted)',
              letterSpacing: '0.2em', fontFamily: 'IBM Plex Mono, monospace'
            }}>
              v1.0.0
            </span>
          </div>
          <p style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '0.65rem', color: 'var(--muted)',
            letterSpacing: '0.1em', marginTop: 4
          }}>
            Knowledge-Based Agent · Propositional Resolution · CNF Inference Engine
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>

          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 6, padding: 16
          }}>
            <p style={{
              fontSize: '0.6rem', letterSpacing: '0.2em',
              color: 'var(--muted)', textTransform: 'uppercase',
              fontFamily: 'IBM Plex Mono, monospace', marginBottom: 12
            }}>
              World Grid
            </p>
            <Grid
              gridState={game.gridState}
              agentPos={game.agentPos}
              cellStatuses={game.cellStatuses}
              rows={game.rows}
              cols={game.cols}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Controls
              rows={game.rows} setRows={game.setRows}
              cols={game.cols} setCols={game.setCols}
              gameStatus={game.gameStatus}
              startGame={game.startGame}
              stepGame={game.stepGame}
              runAuto={game.runAuto}
              stopAuto={game.stopAuto}
              reset={game.reset}
            />
            <Dashboard
              percepts={game.percepts}
              kbStats={game.kbStats}
              agentPos={game.agentPos}
              gameStatus={game.gameStatus}
              message={game.message}
            />
            <KBViewer kbStats={game.kbStats} />
          </div>

        </div>

        <div style={{
          borderTop: '1px solid var(--border)', marginTop: 24,
          paddingTop: 12, textAlign: 'center'
        }}>
          <p style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em'
          }}>
            Resolution Refutation proves ¬Pit_{`{r,c}`} ∧ ¬Wumpus_{`{r,c}`} before every agent move
          </p>
        </div>

      </div>
    </div>
  )
}