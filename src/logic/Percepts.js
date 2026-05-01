import { bic, or, lit } from './CNFConverter'

export function getBreezeRule(row, col, rows, cols) {
  const neighbors = getNeighbors(row, col, rows, cols)
  if (neighbors.length === 0) return null

  const pitLits = neighbors.map(([r, c]) => lit(`Pit_${r}_${c}`))
  const pitOr = pitLits.reduce((acc, l) => acc ? or(acc, l) : l, null)

  return bic(lit(`B_${row}_${col}`), pitOr)
}

export function getStenchRule(row, col, rows, cols) {
  const neighbors = getNeighbors(row, col, rows, cols)
  if (neighbors.length === 0) return null

  const wumpusLits = neighbors.map(([r, c]) => lit(`Wumpus_${r}_${c}`))
  const wumpusOr = wumpusLits.reduce((acc, l) => acc ? or(acc, l) : l, null)

  return bic(lit(`S_${row}_${col}`), wumpusOr)
}

export function getNeighbors(row, col, rows, cols) {
  return [
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1],
  ].filter(([r, c]) => r >= 0 && c >= 0 && r < rows && c < cols)
}