import {delay} from "../utils/delay"

let ethPrice
let resolveTime
let fetching

// The period of refresing ETH price
const REFRESH_PERIOD = 3000

export const getEthPrice = async () => {
  if (ethPrice && resolveTime - Date.now() < REFRESH_PERIOD) {
    return ethPrice
  }
  if (fetching) {
    await delay(300)
    return getEthPrice()
  }
  fetching = true
  const res = await fetch("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD")
  const json = await res.json()
  ethPrice = json.USD
  resolveTime = Date.now()
  fetching = false
  return ethPrice
}
