import { words } from './wordList'

export const letterPoints = {
  A: 1, B: 3, C: 4, Ç: 4, D: 3, E: 1,
  F: 7, G: 5, Ğ: 8, H: 5, I: 2, İ: 1,
  J: 10, K: 1, L: 1, M: 2, N: 1, O: 2,
  Ö: 7, P: 5, R: 1, S: 2, Ş: 4, T: 1,
  U: 2, Ü: 3, V: 7, Y: 3, Z: 4, JOKER: 0
}

const GRID_SIZE = 15

function getCell(matrix, row, col) {
  if (Array.isArray(matrix[row])) {
    return matrix[row][col]
  }
  return matrix[row * GRID_SIZE + col]
}

export function areCellsAligned(cells) {
  if (cells.length < 2) return true
  const dr = cells[1].row - cells[0].row
  const dc = cells[1].col - cells[0].col
  const stepR = Math.sign(dr), stepC = Math.sign(dc)
 
  if (!(
    (stepR === 0 && stepC !== 0) ||
    (stepC === 0 && stepR !== 0) ||
    (Math.abs(stepR) === 1 && Math.abs(stepC) === 1)
  )) return false

  const sorted = [...cells].sort((a, b) =>
    stepR !== 0
      ? (a.row - b.row) || (a.col - b.col)
      : (a.col - b.col) || (a.row - b.row)
  )

  for (let i = 1; i < sorted.length; i++) {
    
    if (
      sorted[i].row !== sorted[i - 1].row + stepR ||
      sorted[i].col !== sorted[i - 1].col + stepC
    ) return false
  }
  return true
}


export function evaluateMove(word, matrix, cells, jokerMap = {}) {
  let baseScore = 0, wordMultiplier = 1
  const effects = {
    transfer: false, percentPenalty: false, letterLoss: false,
    disableBonus: false, cancelWord: false,
    rewardBolge: false, rewardHarfYasagi: false, rewardExtraTurn: false
  }

  const sorted = [...cells]
  if (sorted.length > 1) {
    const dr = sorted[1].row - sorted[0].row
    const dc = sorted[1].col - sorted[0].col
    const stepR = Math.sign(dr), stepC = Math.sign(dc)
    sorted.sort((a, b) =>
      stepR !== 0
        ? (a.row - b.row) || (a.col - b.col)
        : (a.col - b.col) || (a.row - b.row)
    )
  }

  sorted.forEach(({ row, col }, i) => {
    const idx = row * GRID_SIZE + col

    let letter = jokerMap[idx] || word[i]
    const pt = letterPoints[letter] || 0
    const cell = getCell(matrix, row, col)
    if (!cell) return

    switch (cell.type) {
      case '2xLetter': baseScore += pt * 2; break
      case '3xLetter': baseScore += pt * 3; break
      case '2xWord': wordMultiplier *= 2; baseScore += pt; break
      case '3xWord': wordMultiplier *= 3; baseScore += pt; break
      case 'puanBolunmesi': effects.percentPenalty = true; baseScore += pt; break
      case 'puanTransferi': effects.transfer = true; baseScore += pt; break
      case 'harfKaybi': effects.letterLoss = true; baseScore += pt; break
      case 'ekstraHamleEngeli': effects.disableBonus = true; baseScore += pt; break
      case 'kelimeIptali': effects.cancelWord = true; baseScore += pt; break
      case 'bolgeYasagi': effects.rewardBolge = true; baseScore += pt; break
      case 'harfYasagi': effects.rewardHarfYasagi = true; baseScore += pt; break
      case 'ekstraHamleJokeri': effects.rewardExtraTurn = true; baseScore += pt; break
      default: baseScore += pt
    }
  })

  let finalScore = effects.disableBonus ? baseScore : baseScore * wordMultiplier
  let opponentScore = 0


  if (effects.cancelWord) {
    finalScore = 0
  } else if (effects.transfer) {
    opponentScore = finalScore
    finalScore = 0
  } else if (effects.percentPenalty) {
    finalScore = Math.floor(finalScore * 0.3)
  }

  return { userScore: finalScore, opponentScore, effects }
}

const WORD_SET = new Set(words.map(w => w.toUpperCase()))
export function isValidWord(w) {
  return WORD_SET.has(w.toUpperCase())
}
