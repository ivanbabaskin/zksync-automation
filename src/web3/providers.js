import {settings, network} from "../config"
import * as zksync from "zksync-web3"
import {ethers} from "ethers"
const config = settings[network]

// const SYMBIOSYS_CLIENT_ID = 'MY_APP' // TODO

// export const symbiosis = new Symbiosis(network, SYMBIOSYS_CLIENT_ID)

export const zkSyncProvider = new zksync.Provider(config.networks.zksync.rpc)

export const ethereumProvider = new ethers.providers.StaticJsonRpcProvider(
  config.networks.ethereum.rpc
)

export const scrollProvider = new ethers.providers.StaticJsonRpcProvider(config.networks.scrollMainnet.rpc)


// export const sepliaProvider = new ethers.providers.StaticJsonRpcProvider(
//   config.networks.sepolia.rpc
// )
// export const scrollSepoliaProvider = new zksync.Provider(config.networks.scrollSepolia.rpc)