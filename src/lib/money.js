export function toNumber(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

export function formatMoney(value) {
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(toNumber(value))
}

export function computeBalance(totalAmount, deposit) {
  return Math.max(0, toNumber(totalAmount) - toNumber(deposit))
}
