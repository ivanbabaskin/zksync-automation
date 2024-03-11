export const pickRandomArrayEl = arr => {
  const idx = Math.min(Math.floor(Math.random() * arr.length), arr.length - 1)
  return arr[idx]
}
