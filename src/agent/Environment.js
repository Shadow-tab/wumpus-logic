import { getNeighbors } from '../logic/Percepts'

export class Environment {
  constructor(rows, cols, pitProbability = 0.15) {
    this.rows = rows
    this.cols = cols
    this.pitProbability = pitProbability
    this.grid = []
    this.wumpusPos = null
    this.goldPos = null
    this.init()
  }

  init() {
    this.grid = []
    this.wumpusPos = null
    this.goldPos = null

    for (let r = 0; r < this.rows; r++) {
      this.grid[r] = []
      for (let c = 0; c < this.cols; c++) {
        this.grid[r][c] = {
          hasPit: false,
          hasWumpus: false,
          hasGold: false,
          breeze: false,
          stench: false,
        }
      }
    }

    // Place pits — never at [0,0]
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (r === 0 && c === 0) continue
        if (Math.random() < this.pitProbability) {
          this.grid[r][c].hasPit = true
        }
      }
    }

    // Place wumpus — never at [0,0], never on a pit
    const safeForWumpus = []
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (r === 0 && c === 0) continue
        if (!this.grid[r][c].hasPit) safeForWumpus.push([r, c])
      }
    }
    if (safeForWumpus.length > 0) {
      const idx = Math.floor(Math.random() * safeForWumpus.length)
      const [wr, wc] = safeForWumpus[idx]
      this.grid[wr][wc].hasWumpus = true
      this.wumpusPos = [wr, wc]
    }

    // Place gold — never at [0,0], never on hazard
    const safeForGold = []
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (r === 0 && c === 0) continue
        if (!this.grid[r][c].hasPit && !this.grid[r][c].hasWumpus) {
          safeForGold.push([r, c])
        }
      }
    }
    if (safeForGold.length > 0) {
      const idx = Math.floor(Math.random() * safeForGold.length)
      const [gr, gc] = safeForGold[idx]
      this.grid[gr][gc].hasGold = true
      this.goldPos = [gr, gc]
    }

    this._computePercepts()
  }

  _computePercepts() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const neighbors = getNeighbors(r, c, this.rows, this.cols)
        this.grid[r][c].breeze = neighbors.some(([nr, nc]) => this.grid[nr][nc].hasPit)
        this.grid[r][c].stench = neighbors.some(([nr, nc]) => this.grid[nr][nc].hasWumpus)
      }
    }
  }

  getPercepts(row, col) {
    const cell = this.grid[row][col]
    return {
      breeze: cell.breeze,
      stench: cell.stench,
      gold: cell.hasGold,
      pit: cell.hasPit,
      wumpus: cell.hasWumpus,
    }
  }

  isHazard(row, col) {
    return this.grid[row][col].hasPit || this.grid[row][col].hasWumpus
  }

  getCell(row, col) {
    return this.grid[row][col]
  }

  getDimensions() {
    return { rows: this.rows, cols: this.cols }
  }
}