export const randomizeBigNumber = (bignumber, minPercent = 25, maxPercent = 50) => {
  const percentage = Math.round(minPercent + Math.random() * (maxPercent - minPercent))
  return bignumber.div(100).mul(percentage)
}
