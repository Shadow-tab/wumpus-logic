import { lit, and, or, imp, bic } from './logic/CNFConverter'
import { KnowledgeBase } from './logic/KnowledgeBase'

function App() {
  const kb = new KnowledgeBase()

  // Tell KB: B_1_1 ⇔ (Pit_1_2 ∨ Pit_2_1)
  kb.tell(bic(lit('B_1_1'), or(lit('Pit_1_2'), lit('Pit_2_1'))))

  // Tell KB: ¬B_1_1 (no breeze at 1,1)
  kb.tellRaw([{ name: 'B_1_1', neg: true }])

  // Ask: is cell (1,2) safe?
  const safe = kb.isSafe(1, 2)

  console.log('Is cell (1,2) safe?', safe)
  console.log('Clauses in KB:', kb.getClauseCount())
  console.log('Inference steps:', kb.getInferenceSteps())

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <h1 className="text-3xl font-bold">WumpusLogic Agent</h1>
    </div>
  )
}

export default App