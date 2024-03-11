import {delay} from "../utils/delay"
import {ethereumProvider, zkSyncProvider} from "./providers"
import {BigNumber} from "ethers"

const gasPrices = {}
const resolveTimes = {}
const fetching = {}

// The period of refreshing the gas price
const FETCH_PERIOD = 3000

export const getGasPrice = async (network = "zksync") => {
  if (gasPrices[network] && Date.now() - resolveTimes[network] < FETCH_PERIOD) {
    return gasPrices[network]
  }
  if (fetching[network]) {
    await delay(300)
    return getGasPrice(network)
  }
  fetching[network] = true

  try {
    const provider = network === "ethereum" ? ethereumProvider : zkSyncProvider
    gasPrices[network] = await provider.getGasPrice()

    resolveTimes[network] = Date.now()
    fetching[network] = false
    return gasPrices[network]
  } catch (e) {
    console.error(e)
    fetching[network] = false
    throw e
  }
}

export const waitForGasPrice = async (maxPrice, network = "zksync") => {
  try {
    console.log("Getting the gas price")
    const price = await getGasPrice(network)
    if (price.gt(BigNumber.from(Number(maxPrice) * 1000).mul(1000000))) {
      console.log(
        `Gas price is too high: ${
          Number(gasPrices[network].div(1000000).toString()) / 1000
        } GWei, waiting...`
      )
      await delay(FETCH_PERIOD + 200)
      return await waitForGasPrice(maxPrice, network)
    }
  } catch (e) {
    console.error("Failed to get the gas price")
    await delay(FETCH_PERIOD + 200)
    return await waitForGasPrice(maxPrice, network)
  }
}
