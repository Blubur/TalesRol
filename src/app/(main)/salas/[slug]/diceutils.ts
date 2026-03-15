import type { DiceRollResult } from './diceactions'

export function buildDiceHTML(result: DiceRollResult): string {
  const rollsStr = result.rolls.join(', ')
  const isMultiple = result.quantity > 1
  return `<div class="dice-roll-block" data-verified="true" data-total="${result.total}" data-dice="${result.quantity}${result.diceType}">
  <span class="dice-roll-icon">🎲</span>
  <span class="dice-roll-info">
    <span class="dice-roll-label">${result.quantity}${result.diceType}</span>
    ${isMultiple ? `<span class="dice-roll-individual">[${rollsStr}]</span>` : ''}
    <span class="dice-roll-arrow">→</span>
    <span class="dice-roll-total">${result.total}</span>
  </span>
  <span class="dice-roll-meta">por ${result.rolledBy} · ${new Date(result.rolledAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
</div>`
}