export function resolve(clauseA, clauseB) {
  const resolvents = []

  for (const litA of clauseA) {
    for (const litB of clauseB) {
      if (litA.name === litB.name && litA.neg !== litB.neg) {
        const newClause = [
          ...clauseA.filter(l => l !== litA),
          ...clauseB.filter(l => l !== litB)
        ]
        const deduplicated = dedup(newClause)
        if (!isTautology(deduplicated)) {
          resolvents.push(deduplicated)
        }
      }
    }
  }

  return resolvents
}

function dedup(clause) {
  const seen = new Set()
  return clause.filter(l => {
    const key = `${l.neg ? '¬' : ''}${l.name}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function isTautology(clause) {
  const pos = new Set(clause.filter(l => !l.neg).map(l => l.name))
  return clause.some(l => l.neg && pos.has(l.name))
}

function clauseKey(clause) {
  return clause
    .map(l => `${l.neg ? '¬' : ''}${l.name}`)
    .sort()
    .join('|')
}

export function resolution(clauses, maxSteps = 10000) {
  const clauseSet = new Map()
  let inferenceSteps = 0

  for (const c of clauses) {
    const key = clauseKey(c)
    if (!clauseSet.has(key)) clauseSet.set(key, c)
  }

  while (true) {
    const clauseList = [...clauseSet.values()]
    let newFound = false

    for (let i = 0; i < clauseList.length; i++) {
      for (let j = i + 1; j < clauseList.length; j++) {
        if (inferenceSteps >= maxSteps) return { result: 'unknown', inferenceSteps }

        const resolvents = resolve(clauseList[i], clauseList[j])
        inferenceSteps++

        for (const r of resolvents) {
          if (r.length === 0) return { result: 'contradiction', inferenceSteps }

          const key = clauseKey(r)
          if (!clauseSet.has(key)) {
            clauseSet.set(key, r)
            newFound = true
          }
        }
      }
    }

    if (!newFound) return { result: 'unknown', inferenceSteps }
  }
}