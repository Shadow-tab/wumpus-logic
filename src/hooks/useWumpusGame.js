import { useState, useCallback, useRef } from 'react'
import { Environment } from '../agent/Environment'
import { Agent } from '../agent/Agent'

export function useWumpusGame() {
  const [rows, setRows] = useState(4)
  const [cols, setCols] = useState(4)
  const [gridState, setGridState] = useState(null)
  const [agentPos, setAgentPos] = useState([0, 0])
  const [cellStatuses, setCellStatuses] = useState({})
  const [percepts, setPercepts] = useState({})
  const [kbStats, setKbStats] = useState({ clauses: 0, inferenceSteps: 0 })
  const [gameStatus, setGameStatus] = useState('idle')
  const [visitedCells, setVisitedCells] = useState(new Set())
  const [message, setMessage] = useState('Configure grid and press Start')

  const envRef = useRef(null)
  const agentRef = useRef(null)
  const intervalRef = useRef(null)

  const buildSnapshot = useCallback((env, agent) => {
    const { rows: r, cols: c } = env.getDimensions()
    const snapshot = []
    const statuses = {}

    for (let row = 0; row < r; row++) {
      snapshot[row] = []
      for (let col = 0; col < c; col++) {
        snapshot[row][col] = env.getCell(row, col)
        statuses[`${row},${col}`] = agent.getCellStatus(row, col)
      }
    }

    return { snapshot, statuses }
  }, [])

  const startGame = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)

    const env = new Environment(rows, cols)
    const agent = new Agent(rows, cols)

    envRef.current = env
    agentRef.current = agent

    const { snapshot, statuses } = buildSnapshot(env, agent)
    setGridState(snapshot)
    setCellStatuses(statuses)
    setAgentPos([0, 0])
    setVisitedCells(new Set(['0,0']))
    setPercepts(env.getPercepts(0, 0))
    setKbStats(agent.getKBStats())
    setGameStatus('running')
    setMessage('Agent started — reasoning with Resolution...')
  }, [rows, cols, buildSnapshot])

  const stepGame = useCallback(() => {
    const env = envRef.current
    const agent = agentRef.current
    if (!env || !agent) return
    if (agent.status !== 'alive') return

    const [r, c] = agent.position
    const currentPercepts = env.getPercepts(r, c)
    const next = agent.step(currentPercepts)

    const { snapshot, statuses } = buildSnapshot(env, agent)
    setGridState(snapshot)
    setCellStatuses(statuses)
    setPercepts(currentPercepts)
    setKbStats(agent.getKBStats())
    setVisitedCells(new Set(agent.visited))

    if (agent.foundGold) {
      setAgentPos(agent.position)
      setGameStatus('won')
      setMessage('Gold found! Agent wins!')
      return
    }

    if (agent.status === 'dead') {
      setAgentPos(agent.position)
      setGameStatus('dead')
      setMessage('Agent walked into a hazard. Game over.')
      return
    }

    if (agent.status === 'stuck') {
      setAgentPos(agent.position)
      setGameStatus('stuck')
      setMessage('No safe moves found. Agent is stuck.')
      return
    }

    if (next) {
      setAgentPos([...next])
      setMessage(`Moved to [${next[0]}, ${next[1]}] — KB proved it safe`)
    }
  }, [buildSnapshot])

  const runAuto = useCallback(() => {
    if (gameStatus !== 'running') return
    intervalRef.current = setInterval(() => {
      const agent = agentRef.current
      if (!agent || agent.status !== 'alive') {
        clearInterval(intervalRef.current)
        return
      }
      stepGame()
    }, 600)
  }, [gameStatus, stepGame])

  const stopAuto = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [])

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    envRef.current = null
    agentRef.current = null
    setGridState(null)
    setCellStatuses({})
    setAgentPos([0, 0])
    setPercepts({})
    setKbStats({ clauses: 0, inferenceSteps: 0 })
    setGameStatus('idle')
    setVisitedCells(new Set())
    setMessage('Configure grid and press Start')
  }, [])

  return {
    rows, setRows,
    cols, setCols,
    gridState,
    agentPos,
    cellStatuses,
    percepts,
    kbStats,
    gameStatus,
    visitedCells,
    message,
    startGame,
    stepGame,
    runAuto,
    stopAuto,
    reset,
  }
}