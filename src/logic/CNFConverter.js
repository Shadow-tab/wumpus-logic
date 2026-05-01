function elimBic(f) {
  switch (f.type) {
    case 'lit': return f
    case 'not': return { type: 'not', child: elimBic(f.child) }
    case 'and': return { type: 'and', left: elimBic(f.left), right: elimBic(f.right) }
    case 'or':  return { type: 'or',  left: elimBic(f.left), right: elimBic(f.right) }
    case 'imp': return { type: 'or', left: { type: 'not', child: elimBic(f.left) }, right: elimBic(f.right) }
    case 'bic': {
      const l = elimBic(f.left)
      const r = elimBic(f.right)
      return {
        type: 'and',
        left:  { type: 'or', left: { type: 'not', child: l }, right: r },
        right: { type: 'or', left: { type: 'not', child: r }, right: l }
      }
    }
    default: throw new Error(`Unknown type: ${f.type}`)
  }
}

function pushNot(f) {
  if (f.type === 'lit') return f

  if (f.type === 'not') {
    const c = f.child
    if (c.type === 'lit') return { type: 'lit', name: c.name, neg: !c.neg }
    if (c.type === 'not') return pushNot(c.child)
    if (c.type === 'and') return pushNot({ type: 'or',  left: { type: 'not', child: c.left }, right: { type: 'not', child: c.right } })
    if (c.type === 'or')  return pushNot({ type: 'and', left: { type: 'not', child: c.left }, right: { type: 'not', child: c.right } })
  }

  if (f.type === 'and') return { type: 'and', left: pushNot(f.left), right: pushNot(f.right) }
  if (f.type === 'or')  return { type: 'or',  left: pushNot(f.left), right: pushNot(f.right) }

  return f
}

function distribute(f) {
  if (f.type === 'lit') return f

  if (f.type === 'and') return { type: 'and', left: distribute(f.left), right: distribute(f.right) }

  if (f.type === 'or') {
    const left  = distribute(f.left)
    const right = distribute(f.right)

    if (left.type === 'and') {
      return {
        type: 'and',
        left:  distribute({ type: 'or', left: left.left,  right }),
        right: distribute({ type: 'or', left: left.right, right })
      }
    }
    if (right.type === 'and') {
      return {
        type: 'and',
        left:  distribute({ type: 'or', left, right: right.left  }),
        right: distribute({ type: 'or', left, right: right.right })
      }
    }
    return { type: 'or', left, right }
  }

  return f
}

function collectClauses(f) {
  if (f.type === 'and') return [...collectClauses(f.left), ...collectClauses(f.right)]
  return [collectLiterals(f)]
}

function collectLiterals(f) {
  if (f.type === 'lit') return [{ name: f.name, neg: f.neg ?? false }]
  if (f.type === 'or')  return [...collectLiterals(f.left), ...collectLiterals(f.right)]
  throw new Error(`Unexpected node in clause: ${JSON.stringify(f)}`)
}

export function toCNF(formula) {
  const step1 = elimBic(formula)
  const step2 = pushNot(step1)
  const step3 = distribute(step2)
  return collectClauses(step3)
}

export function lit(name, neg = false) {
  return { type: 'lit', name, neg }
}
export const not  = (child)        => ({ type: 'not', child })
export const and  = (left, right)  => ({ type: 'and', left, right })
export const or   = (left, right)  => ({ type: 'or',  left, right })
export const imp  = (left, right)  => ({ type: 'imp', left, right })
export const bic  = (left, right)  => ({ type: 'bic', left, right })