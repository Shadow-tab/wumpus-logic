import { toCNF } from './CNFConverter'
import { resolution } from './Resolution'

export class KnowledgeBase {
  constructor() {
    this.clauses = []
    this.totalInferenceSteps = 0
  }

  tell(formula) {
    const newClauses = toCNF(formula)
    for (const clause of newClauses) {
      if (!this._clauseExists(clause)) {
        this.clauses.push(clause)
      }
    }
  }

  tellRaw(clause) {
    if (!this._clauseExists(clause)) {
      this.clauses.push(clause)
    }
  }

  ask(negatedGoalClauses) {
    const combined = [...this.clauses, ...negatedGoalClauses]
    const { result, inferenceSteps } = resolution(combined)
    this.totalInferenceSteps += inferenceSteps
    return result === 'contradiction'
  }

  isSafe(row, col) {
    const negatedGoal = [
      [{ name: `Pit_${row}_${col}`, neg: false }],
      [{ name: `Wumpus_${row}_${col}`, neg: false }],
    ]
    return this.ask(negatedGoal)
  }

  getClauseCount() {
    return this.clauses.length
  }

  getInferenceSteps() {
    return this.totalInferenceSteps
  }

  reset() {
    this.clauses = []
    this.totalInferenceSteps = 0
  }

  _clauseExists(newClause) {
    const newKey = this._key(newClause)
    return this.clauses.some(c => this._key(c) === newKey)
  }

  _key(clause) {
    return clause
      .map(l => `${l.neg ? '¬' : ''}${l.name}`)
      .sort()
      .join('|')
  }
}