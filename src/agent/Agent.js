import { KnowledgeBase } from '../logic/KnowledgeBase'
import { getBreezeRule, getStenchRule, getNeighbors } from '../logic/Percepts'
import { lit } from '../logic/CNFConverter'

export class Agent {
  constructor(rows, cols) {
    this.rows = rows
    this.cols = cols
    this.kb = new KnowledgeBase()
    this.position = [0, 0]
    this.visited = new Set()
    this.safeQueue = []
    this.status = 'alive'
    this.foundGold = false
    this.history = []

    this._initKB()
    this._markVisited(0, 0)
  }

  _initKB() {
    // [0,0] is always safe — no pit, no wumpus
    this.kb.tellRaw([{ name: 'Pit_0_0', neg: true }])
    this.kb.tellRaw([{ name: 'Wumpus_0_0', neg: true }])
  }

  _cellKey(r, c) {
    return `${r},${c}`
  }

  _markVisited(r, c) {
    this.visited.add(this._cellKey(r, c))
  }

  _isVisited(r, c) {
    return this.visited.has(this._cellKey(r, c))
  }

  perceiveAndUpdate(percepts) {
    const [r, c] = this.position

    // Tell KB breeze/stench rules for this cell
    const breezeRule = getBreezeRule(r, c, this.rows, this.cols)
    const stenchRule = getStenchRule(r, c, this.rows, this.cols)
    if (breezeRule) this.kb.tell(breezeRule)
    if (stenchRule) this.kb.tell(stenchRule)

    // Tell KB actual percept observation
    this.kb.tellRaw([{ name: `B_${r}_${c}`, neg: !percepts.breeze }])
    this.kb.tellRaw([{ name: `S_${r}_${c}`, neg: !percepts.stench }])

    if (percepts.gold) this.foundGold = true
    if (percepts.pit || percepts.wumpus) this.status = 'dead'
  }

  evaluateNeighbors() {
    const [r, c] = this.position
    const neighbors = getNeighbors(r, c, this.rows, this.cols)
    const results = []

    for (const [nr, nc] of neighbors) {
      if (this._isVisited(nr, nc)) continue

      const safe = this.kb.isSafe(nr, nc)
      results.push({ row: nr, col: nc, safe })

      if (safe && !this.safeQueue.find(s => s.row === nr && s.col === nc)) {
        this.safeQueue.push({ row: nr, col: nc })
      }
    }

    return results
  }

  step(percepts) {
    if (this.status !== 'alive') return null

    this.perceiveAndUpdate(percepts)
    if (this.status === 'dead') return null

    this.evaluateNeighbors()

    if (this.safeQueue.length === 0) {
      this.status = 'stuck'
      return null
    }

    const next = this.safeQueue.shift()
    this._markVisited(next.row, next.col)
    this.history.push([...this.position])
    this.position = [next.row, next.col]

    return this.position
  }

  getKBStats() {
    return {
      clauses: this.kb.getClauseCount(),
      inferenceSteps: this.kb.getInferenceSteps(),
    }
  }

  getCellStatus(r, c) {
    if (this.position[0] === r && this.position[1] === c) return 'current'
    if (this._isVisited(r, c)) return 'safe'
    if (this.kb.isSafe(r, c)) return 'inferred-safe'
    return 'unknown'
  }
}