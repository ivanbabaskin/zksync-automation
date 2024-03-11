import {ethers} from "ethers"
import Web3, { eth } from "web3"
import * as zksync from "zksync-web3"
import {settings, network} from "../config.js"
import qs from "query-string"
import {ethereumProvider, zkSyncProvider, scrollProvider} from "./providers"
import {VelocoreRouterAbi} from "../abi/VelocoreRouter"
import {getEthPrice} from "./getEthPrice"
import {BridgeAbi} from "../abi/Bridge"
import {SyncswapRouterAbi} from "../abi/SyncswapRouter"
import {SyncswapPoolFactoryAbi} from "../abi/SyncswapPoolFactory"
import {MuteRouterAbi} from "../abi/MuteRouter"
import {NexonAbi} from "../abi/NexonAbi"
import {UsdcAbi} from "../abi/USDC"
import {randomizeBigNumber} from "../utils/randomizeBigNumber"
import {getGasPrice} from "./getGasPrice"
import {MavRouterAbi} from "../abi/MavRouter"
import {ChainId, initialChainTable} from "iziswap-sdk/lib/base/types"
import {fetchToken} from "iziswap-sdk/lib/base/token/token"
import {getSwapChainWithExactInputCall, getSwapContract} from "iziswap-sdk/lib/swap/funcs"
import {getQuoterContract, quoterSwapChainWithExactInput} from "iziswap-sdk/lib/quoter/funcs"
import {WethAbi} from "../abi/Weth"
import { request2 } from '../utils/request.js'
import { createPublicClient, http } from 'viem'

import { scroll, zkSync } from 'viem/chains'
import { SushiswapAbi } from '../abi/Sushiswap'

const config = settings[network]

async function calculateFeeForOwltoFinance(from, to, amount, token_name) {
  const { msg } = await request2.get("/dynamic-dtc", {
    params: {
      from: from.name,
      to: to.name,
      amount: amount,
      token: token_name
    }
  });
  let dtc = msg;

  const gasFee = ethers.utils.parseEther(dtc, 'ether');
  const value = ethers.utils.parseEther(amount, 'ether');
  const gasCompensation = value.add(gasFee).toString();
  
  return {gasFee, gasCompensation};
}

export async function bridgeScroll({from, to, privateKey}) {
  const provider = new ethers.providers.StaticJsonRpcProvider(config.networks[from].rpc);
  const wallet = new ethers.Wallet(privateKey, provider);
  //0xE0255403eD5bae3c1dCB10770Dfa009215A4cc1A
  const walletBalance = await provider.getBalance(wallet.address);

  const balance = Number(
    ethers.utils.formatUnits(walletBalance)
  )
  const estimatedAmount = balance - 0.005;
  if (!(estimatedAmount > 0)) {
    return {
      success: false,
      errors: ["Not enough balance"]
    }
  }

  const networkCode = config.networks[to].networkCode.toString().padStart(4, 0);
  const {gasFee, gasCompensation} = await calculateFeeForOwltoFinance(config.networks[from], config.networks[to], String(estimatedAmount), "ETH");
  const codeLength = networkCode.length;
  const toWeiValue = gasCompensation;
  const totalFee =
    toWeiValue.slice(0, -codeLength) + networkCode;

  const gasPrice = await provider.getGasPrice();
  console.log(gasPrice);

  console.log(totalFee);

  let gasLimit = await provider.estimateGas({
    from: wallet.address,
    to: config.networks[from].bridge,
    value: totalFee
  })

  console.log(gasLimit)
  if (gasLimit < 120000) gasLimit = 150000
  else gasLimit *= 1.07
  gasLimit = Math.round(gasLimit)
  const fee = gasLimit * Number(ethers.utils.formatUnits(gasPrice))
  console.log(fee);
  console.log(Number(ethers.utils.formatUnits(gasFee)));
  const amount = balance - fee * 1.03 - Number(ethers.utils.formatUnits(gasFee)) - 0.0005;
  if (!(amount > 0)) {
    return {
      success: false,
      errors: ["Not enough balance"]
    }
  }

  const { gasCompensation: newGasCompensation } = await calculateFeeForOwltoFinance(config.networks[from], config.networks[to], String(amount), "ETH");
  const newTotalFee = newGasCompensation.slice(0, -codeLength) + networkCode;

  const newGasLimit = await provider.estimateGas({
    from: wallet.address,
    to: config.networks[from].bridge,
    value: newTotalFee,
    gasPrice: gasPrice,
  });

  console.log(newTotalFee);
  console.log(newGasLimit);

  const tx = await wallet.sendTransaction({
    to: config.networks[from].bridge,
    value: newTotalFee,
    gasLimit: gasLimit,
    gasPrice: gasPrice
  })
  console.log(tx);
  // const result = await tx.wait();
  return {success: true, txHash: tx.hash}
}

export async function bridge({privateKey}) {
  const wallet = new zksync.Wallet(privateKey, zkSyncProvider, ethereumProvider)
  const balance = Number(
    ethers.utils.formatUnits(await ethereumProvider.getBalance(wallet.address))
  )
  const gasPrice = await ethereumProvider.getGasPrice("ethereum")
  const contract = new ethers.Contract(config.bridge.address, BridgeAbi, ethereumProvider)
  const estimatedAmount = balance - 0.007
  if (!(estimatedAmount > 0)) {
    return {
      success: false,
      errors: ["Not enough balance"]
    }
  }

  let gasLimit = Number(
    await contract.estimateGas.requestL2Transaction(
      wallet.address,
      ethers.utils.parseUnits(estimatedAmount.toFixed(18)),
      [],
      ethers.BigNumber.from(742563),
      ethers.BigNumber.from(800),
      [],
      wallet.address,
      {
        value: ethers.utils.parseUnits((estimatedAmount + 0.005).toFixed(18))
      }
    )
  )
  if (gasLimit < 120000) gasLimit = 150000
  else gasLimit *= 1.07
  gasLimit = Math.round(gasLimit)
  const fee = gasLimit * Number(ethers.utils.formatUnits(gasPrice))
  const amount = balance - fee * 1.03 - 0.005
  if (!(amount > 0)) {
    return {
      success: false,
      errors: ["Not enough balance"]
    }
  }

  const data = {
    token: zksync.utils.ETH_ADDRESS,
    amount: ethers.utils.parseUnits(amount.toFixed(18)),
    overrides: {
      value: ethers.utils.parseUnits((amount + 0.005).toFixed(18)),
      gasLimit,
      gasPrice
    }
  }
  const ethDepositHandle = await wallet.deposit(data)
  const result = await ethDepositHandle.wait()
  return {success: true, txHash: result.transactionHash}
}

export async function sushiSwap({privateKey, network}) {
  if (network == "zksync") {
    return { success: false, txHash: "Unsupported network" };
  }
  const currentProvider = network == "scrollMainnet"? scrollProvider: zkSyncProvider;
  const currentChain = network == "scrollMainnet"? scroll : zkSync;
  const wallet = new ethers.Wallet(privateKey, currentProvider)

  console.log(wallet)

  const publicClient = createPublicClient({ chain: currentChain, transport: http() });

  const SWAP_API_URL = new URL(config.swap.sushiSwap.apiUrl);

  const chainId = config.networks[network].chainId;

  const inputCurrency = config.tokens[network].eth.xyAddress;
  const outputCurrency = config.tokens[network].usdc.address;

  const ethBalance = await currentProvider.getBalance(wallet.address)
  const amount = randomizeBigNumber(ethBalance)
  if (amount == 0) {
    return {success: false, txHash: 'Insufficient Balance'}
  }
  const maxPriceImpact = 0.005

  const gasPrice = await publicClient.getGasPrice()

  const to = wallet.address

  const { searchParams } = SWAP_API_URL

  searchParams.set('chainId', chainId.toString())
  searchParams.set('tokenIn', inputCurrency)
  searchParams.set('tokenOut', outputCurrency)
  searchParams.set('amount', amount.toString())
  searchParams.set('maxPriceImpact', maxPriceImpact.toString())
  searchParams.set('gasPrice', gasPrice.toString())
  searchParams.set('to', to)

  console.log(SWAP_API_URL.toString())

  // Make call to API
  const res = await fetch(SWAP_API_URL.toString())
  const json = await res.json()

  console.log(json);

  const router = new ethers.Contract(json.routeProcessorAddr, SushiswapAbi, wallet)
  const tx = await router.processRoute(json.routeProcessorArgs.tokenIn, json.routeProcessorArgs.amountIn, json.routeProcessorArgs.tokenOut, json.routeProcessorArgs.amountOutMin, json.routeProcessorArgs.to, json.routeProcessorArgs.routeCode, { value: json.routeProcessorArgs.value})

  const result = await tx.wait();
  console.log(result)
  return {success: true, txHash: result.transactionHash}
}

export async function sushiSwapReverse({privateKey, network}) {
  if (network == "zksync") {
    return { success: 'failed', txHash: "Unsupported" };
  }
  const currentProvider = network == "scrollMainnet"? scrollProvider: zkSyncProvider;
  const currentChain = network == "scrollMainnet"? scroll : zkSync;

  const publicClient = createPublicClient({ chain: currentChain, transport: http() });
  const wallet = new ethers.Wallet(privateKey, currentProvider)

  const SWAP_API_URL = new URL(config.swap.sushiSwap.apiUrl);

  const chainId = config.networks[network].chainId;

  const inputCurrency = config.tokens[network].usdc.address;
  const outputCurrency = config.tokens[network].eth.xyAddress;

  const usdcContract = new ethers.Contract(config.tokens[network].usdc.address, UsdcAbi, wallet)
  const amount = await usdcContract.balanceOf(wallet.address)
  if (amount == 0) {
    return {success: 'failed', txHash: 'Insufficient Balance'}
  }
  const maxPriceImpact = 0.005

  const gasPrice = await publicClient.getGasPrice()

  const to = wallet.address

  const { searchParams } = SWAP_API_URL

  searchParams.set('chainId', chainId.toString())
  searchParams.set('tokenIn', inputCurrency)
  searchParams.set('tokenOut', outputCurrency)
  searchParams.set('amount', amount.toString())
  searchParams.set('maxPriceImpact', maxPriceImpact.toString())
  searchParams.set('gasPrice', gasPrice.toString())
  searchParams.set('to', to)

  // Make call to API
  const res = await fetch(SWAP_API_URL.toString())
  const json = await res.json()

  console.log(json)
  const approveTx = await usdcContract.approve(json.routeProcessorAddr, amount)
  const approveResult = await approveTx.wait();
  console.log(approveResult.transactionHash);

  const router = new ethers.Contract(json.routeProcessorAddr, SushiswapAbi, wallet)
  const tx = await router.processRoute(json.routeProcessorArgs.tokenIn, json.routeProcessorArgs.amountIn, json.routeProcessorArgs.tokenOut, json.routeProcessorArgs.amountOutMin, json.routeProcessorArgs.to, json.routeProcessorArgs.routeCode)

  const result = await tx.wait();
  console.log("result", result)
  return {success: true, txHash: result.transactionHash}
}

export async function wowmaxSwap({privateKey, network}) {
  if (network == "zksync") {
    return { success: false, txHash: "Unsupported network" };
  }
  const currentProvider = network == "scrollMainnet"? scrollProvider: zkSyncProvider;
  const wallet = new ethers.Wallet(privateKey, currentProvider)

  const chainId = config.networks[network].chainId;
  const SWAP_API_URL = new URL(config.swap.wowmax.apiUrl.replace('{chainId}', `${chainId}`));

  const ethBalance = await currentProvider.getBalance(wallet.address)
  const amount = ethers.utils.formatEther(randomizeBigNumber(ethBalance));
  if (Number(amount) == 0) {
    return {success: false, txHash: 'Insufficient Balance'}
  }
  const slippage = 0.5

  const gasPrice = await currentProvider.getGasPrice()

  const to = wallet.address

  const { searchParams } = SWAP_API_URL

  searchParams.set('chainId', chainId.toString())
  searchParams.set('from', 'ETH')
  searchParams.set('to', 'USDC')
  searchParams.set('amount', amount.toString())
  searchParams.set('slippage', slippage.toString())
  searchParams.set('gasPrice', gasPrice.toString())
  searchParams.set('usePMM', true)

  console.log(SWAP_API_URL.toString())

  // Make call to API
  const res = await fetch(SWAP_API_URL.toString())
  const json = await res.json()

  console.log(json);

  const gasLimit = await currentProvider.estimateGas({
    from: wallet.address,
    to: json.contract,
    data: json.data,
    value: ethers.BigNumber.from(json.value).toHexString()
  })
  console.log(gasLimit);

  const tx = await wallet.sendTransaction({
    to: json.contract,
    data: json.data,
    value: ethers.BigNumber.from(json.value).toHexString(),
    gasPrice: gasPrice,
    gasLimit: gasLimit.mul(20).div(10)
  })
  console.log(tx);
  const result = await tx.wait();

  return {success: true, txHash: result.transactionHash}
}

export async function wowmaxSwapReverse({privateKey, network}) {
  if (network == "zksync") {
    return { success: 'failed', txHash: "Unsupported" };
  }
  const currentProvider = network == "scrollMainnet"? scrollProvider: zkSyncProvider;
  const wallet = new ethers.Wallet(privateKey, currentProvider)

  const chainId = config.networks[network].chainId;
  const SWAP_API_URL = new URL(config.swap.wowmax.apiUrl.replace('{chainId}', `${chainId}`));

  const usdcContract = new ethers.Contract(config.tokens[network].usdc.address, UsdcAbi, wallet)
  const amount = await usdcContract.balanceOf(wallet.address)
  const formatAmount = ethers.utils.formatUnits(amount, 6);
  if (Number(amount) == 0) {
    return {success: 'failed', txHash: 'Insufficient Balance'}
  }
  const slippage = 0.5

  const gasPrice = await currentProvider.getGasPrice()

  const to = wallet.address

  const { searchParams } = SWAP_API_URL

  searchParams.set('chainId', chainId.toString())
  searchParams.set('from', 'USDC')
  searchParams.set('to', 'ETH')
  searchParams.set('amount', formatAmount.toString())
  searchParams.set('slippage', slippage.toString())
  searchParams.set('gasPrice', gasPrice.toString())
  searchParams.set('usePMM', true)

  // Make call to API
  const res = await fetch(SWAP_API_URL.toString())
  const json = await res.json()

  console.log(json)
  const approveTx = await usdcContract.approve(json.contract, amount)
  const approveResult = await approveTx.wait();
  console.log(approveResult.transactionHash);

  const gasLimit = await currentProvider.estimateGas({
    from: wallet.address,
    to: json.contract,
    data: json.data
  })
  console.log(gasLimit);

  const tx = await wallet.sendTransaction({
    to: json.contract,
    data: json.data,
    gasPrice: gasPrice,
    gasLimit: gasLimit.mul(20).div(10)
  })
  console.log(tx);
  const result = await tx.wait();
  console.log("result", result)
  return {success: true, txHash: result.transactionHash}
}

export async function syncSwap({privateKey, network}) {
  const zkSyncETHProvider = new ethers.providers.StaticJsonRpcProvider(config.networks.zksync.rpc)

  const currentProvider = network == "scrollMainnet"? scrollProvider: zkSyncETHProvider;
  const wallet = new ethers.Wallet(privateKey, currentProvider)

  const classicPoolFactory = new ethers.Contract(
    config.swap.syncswap[network].poolFactory,
    SyncswapPoolFactoryAbi,
    wallet
  )
  const router = new ethers.Contract(config.swap.syncswap[network].router, SyncswapRouterAbi, wallet)
  const paths = []
  const ethBalance = await currentProvider.getBalance(wallet.address)
  const options = {}
  const amount = randomizeBigNumber(ethBalance)
  // const amount = 100000000000000
  options.poolAddress = await classicPoolFactory.getPool(
    config.tokens[network].weth.address,
    config.tokens[network].usdc.address
  )
  options.swapData = ethers.utils.defaultAbiCoder.encode(
    ["address", "address", "uint8"],
    [config.tokens[network].weth.address, wallet.address, 1]
  )
  options.steps = [
    {
      pool: options.poolAddress,
      data: options.swapData,
      callback: zksync.utils.ETH_ADDRESS,
      callbackData: "0x"
    }
  ]
  paths.push({
    steps: options.steps,
    tokenIn: zksync.utils.ETH_ADDRESS,
    amountIn: amount
  })

  console.log(paths);

  const tx = await router.swap(paths, 0, 10000000000, {value: amount})
  const result = await tx.wait()

  console.log("result", result)
  return {success: true, txHash: result.transactionHash}
}

export async function syncSwapReverse({privateKey, network}) {
  const zkSyncETHProvider = new ethers.providers.StaticJsonRpcProvider(config.networks.zksync.rpc)

  const currentProvider = network == "scrollMainnet"? scrollProvider: zkSyncETHProvider;
  const wallet = new ethers.Wallet(privateKey, currentProvider)
  
  const classicPoolFactory = new ethers.Contract(
    config.swap.syncswap[network].poolFactory,
    SyncswapPoolFactoryAbi,
    wallet
  )
  const router = new ethers.Contract(config.swap.syncswap[network].router, SyncswapRouterAbi, wallet)
  const paths = []
  const options = {}

  const usdcContract = new ethers.Contract(config.tokens[network].usdc.address, UsdcAbi, wallet)
  const amount = await usdcContract.balanceOf(wallet.address)
  const approveTx = await usdcContract.approve(config.swap.syncswap[network].router, amount)
  await approveTx.wait()
  options.poolAddress = await classicPoolFactory.getPool(
    config.tokens[network].usdc.address,
    config.tokens[network].weth.address
  )
  options.swapData = ethers.utils.defaultAbiCoder.encode(
    ["address", "address", "uint8"],
    [config.tokens[network].usdc.address, wallet.address, 1]
  )
  options.steps = [
    {
      pool: options.poolAddress,
      data: options.swapData,
      callback: zksync.utils.ETH_ADDRESS,
      callbackData: "0x"
    }
  ]
  paths.push({
    steps: options.steps,
    tokenIn: config.tokens[network].usdc.address,
    amountIn: amount
  })

  const tx = await router.swap(paths, 0, 10000000000)
  const result = await tx.wait()

  console.log("result", result)
  return {success: true, txHash: result.transactionHash}
}

export async function muteSwap({privateKey, network}) {
  const wallet = new zksync.Wallet(privateKey, zkSyncProvider, ethereumProvider)
  const paths = []
  const ethBalance = await zkSyncProvider.getBalance(wallet.address)
  const router = new zksync.Contract(config.swap.mute.router.address, MuteRouterAbi, wallet)
  const weth = await router.WETH()

  const amount = randomizeBigNumber(ethBalance)
  paths.push(weth)
  paths.push(config.tokens.zksync.usdc.address)
  const tx = await router.swapExactETHForTokens(
    0,
    paths,
    wallet.address,
    10000000000,
    [false, false],
    {
      value: amount
    }
  )

  const result = await tx.wait()
  console.log("result", result)
  return {success: true, txHash: result.transactionHash}
}

export async function muteSwapReverse({privateKey, network}) {
  const wallet = new zksync.Wallet(privateKey, zkSyncProvider, ethereumProvider)
  const paths = []
  const value = 0
  const router = new zksync.Contract(config.swap.mute.router.address, MuteRouterAbi, wallet)
  const weth = await router.WETH()

  paths.push(config.tokens.zksync.usdc.address)
  paths.push(weth)
  const usdcContract = new zksync.Contract(config.tokens.zksync.usdc.address, UsdcAbi, wallet)
  const amount = await usdcContract.balanceOf(wallet.address)
  const approveTx = await usdcContract.approve(config.swap.mute.router.address, amount)
  await approveTx.wait()
  const tx = await router.swapExactTokensForETH(
    amount,
    0,
    paths,
    wallet.address,
    10000000000,
    [false, false],
    {value}
  )

  const result = await tx.wait()
  console.log("result", result)
  return {success: true, txHash: result.transactionHash}
}

export async function supply({privateKey, network}) {
  const wallet = new zksync.Wallet(privateKey, zkSyncProvider, ethereumProvider)
  const ethBalance = await zkSyncProvider.getBalance(wallet.address)
  const contract = new zksync.Contract(config.supply.nexon.address, NexonAbi, wallet)

  const amount = ethBalance.div(2)
  const tx = await contract.mint({value: amount})

  const result = await tx.wait()
  console.log("result", result)
  return {success: true, txHash: result.transactionHash}
}

export const swapXy = async ({privateKey, network}) => {
  const wallet = new zksync.Wallet(privateKey, zkSyncProvider, ethereumProvider)
  const ethBalance = await zkSyncProvider.getBalance(wallet.address)
  const amount = randomizeBigNumber(ethBalance)

  const swapTxRes = await fetch(
    qs.stringifyUrl({
      url: `${config.swap.xyFinance.apiUrl}/swap`,
      query: {
        srcChainId: config.networks.ethereum.chainId,
        destChainId: config.networks.zksync.chainId,
        fromTokenAddress: config.tokens.zksync.eth.xyAddress,
        toTokenAddress: config.tokens.zksync.usdc.address,
        amount: ethers.utils.formatUnits(amount, "wei"),
        receiveAddress: wallet.address
      }
    })
  )
  if (swapTxRes.status !== 200) {
    throw new Error(`Getting swap TX failed with status ${swapTxRes.status}`)
  }
  const swapTxJson = await swapTxRes.json()
  if (!swapTxJson.isSuccess) {
    throw new Error(`Getting swap tx failed: ${swapTxJson.msg}`)
  }

  const {to, data, value} = swapTxJson.tx
  const tx = await wallet.sendTransaction({to, data, value})
  await tx.wait()

  return {success: true, txHash: tx.hash}
}

// export const symbiosisSwap = async ({privateKey}) => {
//   const wallet = new ethers.Wallet(privateKey, zkSyncProvider)
//   const ethBalance = await zkSyncProvider.getBalance(wallet.address)
//   const amount = randomizeBigNumber(ethBalance)
//
//   // Create a new Swapping instance
//   const swapping = symbiosis.newSwapping()
//   const eth = new Token({
//     chainId: config.networks.zksync.chainId,
//     address: '',
//     symbol: 'ETH',
//     decimals: 18,
//     isNative: true
//   })
//   const ethAmount = new TokenAmount(
//       eth,
//       amount.toString()
//   )
//
//   const usdc = new Token({
//     chainId: config.networks.zksync.chainId,
//     address: config.tokens.usdc.address,
//     symbol: 'USDC',
//     decimals: 6,
//   })
//
//   const { transactionRequest } = await swapping.exactIn(
//     ethAmount, // Token amount in
//     usdc, // Token object
//     wallet.address, // the sender's address
//     wallet.address, // the recipient's address
//     wallet.address, // revertable address
//     300, // 3% slippage TODO
//     Date.now() + 20 * 60 // 20 minutes deadline
//   )
//
//   const tx = await wallet.sendTransaction(transactionRequest)
//   const receipt = await tx.wait()
//   await swapping.waitForComplete(receipt)
//
//   return {success: true, txHash: receipt.transactionHash}
// }
//
// export const symbiosisSwapReverse = async ({privateKey}) => {
//   const wallet = new ethers.Wallet(privateKey, zkSyncProvider)
//   const usdcContract = new zksync.Contract(config.tokens.usdc.address, UsdcAbi, wallet)
//   const amount = await usdcContract.balanceOf(wallet.address)
//
//   // Create a new Swapping instance
//   const swapping = symbiosis.newSwapping()
//   const eth = new Token({
//     chainId: config.networks.zksync.chainId,
//     address: '',
//     symbol: 'ETH',
//     decimals: 18,
//     isNative: true
//   })
//   const usdc = new Token({
//     chainId: config.networks.zksync.chainId,
//     address: config.tokens.usdc.address,
//     symbol: 'USDC',
//     decimals: 6,
//   })
//
//   const usdcAmount = new TokenAmount(usdc, amount.toString())
//
//   const { approveTo, transactionRequest } = await swapping.exactIn(
//     usdcAmount, // Token amount in
//     eth, // Token object
//     wallet.address, // the sender's address
//     wallet.address, // the recipient's address
//     wallet.address, // revertable address
//     300, // 3% slippage
//     Date.now() + 20 * 60, // 20 minutes deadline
//   )
//
//   const approveTx = await usdcContract.approve(
//     approveTo,
//     amount
//   )
//   await approveTx.wait()
//
//   const tx = await wallet.sendTransaction(transactionRequest)
//   const receipt = await tx.wait()
//   await swapping.waitForComplete(receipt)
//
//   return {success: true, txHash: receipt.transactionHash}
// }

export const swapVelocore = async ({privateKey, network}) => {
  const wallet = new zksync.Wallet(privateKey, zkSyncProvider, ethereumProvider)
  const ethBalance = await zkSyncProvider.getBalance(wallet.address)

  const contract = new zksync.Contract(config.swap.velocore.address, VelocoreRouterAbi, wallet)

  const ethPrice = await getEthPrice()
  const amount = randomizeBigNumber(ethBalance)

  const tx = await contract.swapExactETHForTokens(
    amount.mul(Math.floor(ethPrice * 0.97)).div(1000000000000), // Min amount to get
    [config.tokens.zksync.eth.address, config.tokens.zksync.usdc.address],
    wallet.address,
    Math.floor(new Date().getTime() / 1000) + 60000, // deadline
    {value: amount}
  )

  const result = await tx.wait()
  console.log("result", result)

  return {success: true, txHash: result.transactionHash}
}

export const swapVelocoreReverse = async ({privateKey, network}) => {
  const wallet = new zksync.Wallet(privateKey, zkSyncProvider, ethereumProvider)
  const usdcContract = new zksync.Contract(config.tokens.zksync.usdc.address, UsdcAbi, wallet)
  const amount = await usdcContract.balanceOf(wallet.address)

  const approveTx = await usdcContract.approve(config.swap.velocore.address, amount)
  await approveTx.wait()

  const ethPrice = await getEthPrice()

  const contract = new zksync.Contract(config.swap.velocore.address, VelocoreRouterAbi, wallet)

  const tx = await contract.swapTokensForExactETH(
    amount.div(Math.floor(ethPrice * 1.015)).mul(1000000000000), // amount out
    amount, // max amount to send
    [config.tokens.zksync.usdc.address, config.tokens.zksync.eth.address],
    wallet.address,
    Math.floor(new Date().getTime() / 1000) + 60000
  )

  const result = await tx.wait()
  console.log("result", result)

  return {success: true, txHash: result.transactionHash}
}

export const swapSpaceFi = async ({privateKey, network}) => {
  const wallet = new zksync.Wallet(privateKey, zkSyncProvider, ethereumProvider)
  const ethBalance = await zkSyncProvider.getBalance(wallet.address)

  const contract = new zksync.Contract(config.swap.spaceFinance.address, VelocoreRouterAbi, wallet)

  const ethPrice = await getEthPrice()
  const amount = randomizeBigNumber(ethBalance)

  const tx = await contract.swapExactETHForTokens(
    amount.mul(Math.floor(ethPrice * 0.97)).div(1000000000000), // Min amount to get
    [
      {
        from: config.tokens.zksync.weth.address,
        to: config.tokens.zksync.usdc.address,
        stable: true
      }
    ],
    wallet.address,
    Math.floor(new Date().getTime() / 1000) + 60000, // deadline
    {value: amount}
  )

  const result = await tx.wait()
  console.log("result", result)

  return {success: true, txHash: result.transactionHash}
}

export const swapSpaceFiReverse = async ({privateKey, network}) => {
  const wallet = new zksync.Wallet(privateKey, zkSyncProvider, ethereumProvider)
  const usdcContract = new zksync.Contract(config.tokens.zksync.usdc.address, UsdcAbi, wallet)
  const amount = await usdcContract.balanceOf(wallet.address)

  const approveTx = await usdcContract.approve(config.swap.spaceFinance.address, amount)
  await approveTx.wait()

  const ethPrice = await getEthPrice()

  const contract = new zksync.Contract(config.swap.spaceFinance.address, VelocoreRouterAbi, wallet)

  const tx = await contract.swapExactTokensForETH(
    amount, // amount to send
    amount.div(Math.floor(ethPrice * 1.03)).mul(1000000000000), // min eth amount to get
    [
      {
        from: config.tokens.zksync.usdc.address,
        to: config.tokens.zksync.weth.address,
        stable: true
      }
    ],
    wallet.address,
    Math.floor(new Date().getTime() / 1000) + 60000
  )

  const result = await tx.wait()
  console.log("result", result)

  return {success: true, txHash: result.transactionHash}
}

export const mavSwap = async ({privateKey, network}) => {
  const wallet = new zksync.Wallet(privateKey, zkSyncProvider, ethereumProvider)
  const ethBalance = await zkSyncProvider.getBalance(wallet.address)

  const contract = new zksync.Contract(config.swap.mav.router, MavRouterAbi, wallet)

  const ethPrice = await getEthPrice()
  const amount = randomizeBigNumber(ethBalance)

  const tx = await contract.exactOutputSingle(
    {
      tokenIn: config.tokens.zksync.weth.address,
      tokenOut: config.tokens.zksync.usdc.address,
      pool: config.swap.mav.pool,
      recipient: wallet.address,
      deadline: Math.floor(new Date().getTime() / 1000) + 60000,
      amountOut: amount.mul(Math.floor(ethPrice * 0.97)).div(1000000000000),
      amountInMaximum: amount
    },
    {value: amount}
  )

  const result = await tx.wait()
  console.log("result", result)

  return {success: true, txHash: result.transactionHash}
}

// export const mavSwapReverse = async ({privateKey}) => {
//   const wallet = new zksync.Wallet(privateKey, zkSyncProvider, ethereumProvider)
//
//   const usdcContract = new zksync.Contract(config.tokens.usdc.address, UsdcAbi, wallet)
//   const amount = await usdcContract.balanceOf(wallet.address)
//
//   const approveTx = await usdcContract.approve(config.swap.mav.router, amount)
//   await approveTx.wait()
//
//   const contract = new zksync.Contract(config.swap.mav.router, MavRouterAbi, wallet)
//
//   const ethPrice = await getEthPrice()
//
//   const amountOut = amount.div(Math.floor(ethPrice * 1.03)).mul(1000000000000)
//
//   const tx = await contract.exactOutputSingle({
//     tokenIn: config.tokens.usdc.address,
//     tokenOut: config.tokens.weth.address,
//     pool: config.swap.mav.pool,
//     // recipient: config.swap.mav.router,
//     recipient: wallet.address,
//     deadline: Math.floor(new Date().getTime() / 1000) + 60000,
//     amountOut,
//     amountInMaximum: amount
//   })
//
//   const result = await tx.wait()
//
//   // slippery is 1.5%
//   // const unwrapTx = await contract.unwrapWETH9(amountOut.mul(985).div(1000), wallet.address)
//   // await unwrapTx.wait()
//
//   return {success: true, txHash: result.transactionHash}
// }

export const collect = async ({privateKey, targetAddress, network = "zksync"}) => {
  const wallet =
    network === "ethereum"
      ? new ethers.Wallet(privateKey, ethereumProvider)
      : new zksync.Wallet(privateKey, zkSyncProvider, ethereumProvider)
  const provider = network === "ethereum" ? ethereumProvider : zkSyncProvider
  const ethBalance = await provider.getBalance(wallet.address)

  const gasPrice = await getGasPrice(network)

  const gasLimit = await provider.estimateGas({
    from: wallet.address,
    to: targetAddress,
    value: ethBalance
  })
  const gasCost = gasLimit.mul(gasPrice)

  const receipt = await wallet.sendTransaction({
    to: targetAddress,
    value: ethBalance.sub(gasCost),
    gasLimit,
    gasPrice
  })

  return {success: true, txHash: receipt.hash}
}

export const izumiSwap = async ({privateKey, network}) => {
  const currentProvider = network == "scrollMainnet"? scrollProvider: zkSyncProvider;
  const currentChain = network == "scrollMainnet"? scroll : zkSync;

  const wallet = new ethers.Wallet(privateKey, currentProvider)
  const ethBalance = await currentProvider.getBalance(wallet.address)
  const amount = randomizeBigNumber(ethBalance)
  // const amount = 100000000000000
  if (amount == 0) {
    return {success: false, txHash: 'Insufficient Balance'}
  }
  const gasPrice = await currentProvider.getGasPrice()

  const web3 = new Web3(new Web3.providers.HttpProvider(config.networks[network].rpc))
  const chain = initialChainTable[config.networks[network].chainId]
  const weth = await fetchToken(config.tokens[network].weth.address, chain, web3)
  const usdc = await fetchToken(config.tokens[network].usdc.address, chain, web3)

  const params = {
    // pay testA to buy testB
    tokenChain: [weth, usdc],
    feeChain: [500], // 0.05%
    inputAmount: amount.toString()
  }

  const quoterContract = getQuoterContract(config.swap.izumi[network].quoter, web3)
   const {outputAmount} = await quoterSwapChainWithExactInput(quoterContract, params)

  const swapParams = {
    ...params,
    // slippery is 1.5%
    // amountB is the pre-query result from Quoter
    minOutputAmount: ethers.BigNumber.from(outputAmount).mul(985).div(1000).toString()
  }
  console.log(swapParams)
  const swapContract = getSwapContract(config.swap.izumi[network].swap, web3)

  const {swapCalling, options} = getSwapChainWithExactInputCall(
    swapContract,
    wallet.address,
    chain,
    swapParams,
    gasPrice
  )

  const gasLimit = await currentProvider.estimateGas({
    from: wallet.address,
    to: config.swap.izumi[network].swap,
    data: swapCalling.encodeABI(),
    value: ethers.BigNumber.from(options.value).toHexString()
  })
  console.log(gasLimit);

  const tx = await wallet.sendTransaction({
    ...options,
    to: config.swap.izumi[network].swap,
    data: swapCalling.encodeABI(),
    value: ethers.BigNumber.from(options.value).toHexString(),
    gasLimit: gasLimit.mul(20).div(10)
  })
  console.log(tx);
  const result = await tx.wait();
  return {success: true, txHash: result.transactionHash}
}

export const izumiSwapReverse = async ({privateKey, network}) => {
  const currentProvider = network == "scrollMainnet"? scrollProvider: zkSyncProvider;
  const wallet = new ethers.Wallet(privateKey, currentProvider)

  const usdcContract = new ethers.Contract(config.tokens[network].usdc.address, UsdcAbi, wallet)
  const amount = await usdcContract.balanceOf(wallet.address)

  if (amount == 0) {
    return {success: false, txHash: 'Insufficient Balance'}
  }

  const approveTx = await usdcContract.approve(config.swap.izumi[network].swap, amount)
  await approveTx.wait()

  const gasPrice = await currentProvider.getGasPrice()

  const web3 = new Web3(new Web3.providers.HttpProvider(config.networks[network].rpc))
  const chain = initialChainTable[config.networks[network].chainId]
  const weth = await fetchToken(config.tokens[network].weth.address, chain, web3)
  const usdc = await fetchToken(config.tokens[network].usdc.address, chain, web3)

  const params = {
    // pay testA to buy testB
    tokenChain: [usdc, weth],
    feeChain: [500], // 0.05%
    inputAmount: amount.toString()
  }

  const quoterContract = getQuoterContract(config.swap.izumi[network].quoter, web3)
  const {outputAmount} = await quoterSwapChainWithExactInput(quoterContract, params)

  const swapParams = {
    ...params,
    // slippery is 1.5%
    // amountB is the pre-query result from Quoter
    minOutputAmount: ethers.BigNumber.from(outputAmount).mul(985).div(1000).toString()
  }

  const swapContract = getSwapContract(config.swap.izumi[network].swap, web3)

  const {swapCalling, options} = getSwapChainWithExactInputCall(
    swapContract,
    wallet.address,
    chain,
    swapParams,
    gasPrice
  )

  const gasLimit = await currentProvider.estimateGas({
    from: wallet.address,
    to: config.swap.izumi[network].swap,
    data: swapCalling.encodeABI()
  })

  console.log(options.value);
  const tx = await wallet.sendTransaction({
    to: config.swap.izumi[network].swap,
    data: swapCalling.encodeABI(),
    gasLimit: gasLimit.mul(20).div(10)
  })

  console.log(tx);
  const result = await tx.wait();

  return {success: true, txHash: result.transactionHash}
}

export const unwrapWeth = async ({privateKey}) => {
  const wallet = new zksync.Wallet(privateKey, zkSyncProvider, ethereumProvider)
  const weth = new zksync.Contract(config.tokens.zksync.weth.address, WethAbi, wallet)
  const wethBalance = await weth.balanceOf(wallet.address)

  if (wethBalance.isZero()) {
    return {success: true}
  }

  const tx = await weth.withdraw(wethBalance)

  const result = await tx.wait()
  console.log("result", result)
  return {success: true, txHash: result.transactionHash}
}

export const checkBalances = async ({address, blockNumber}) => {
  const weth = new zksync.Contract(config.tokens.zksync.weth.address, WethAbi, zkSyncProvider)
  const usdc = new zksync.Contract(config.tokens.zksync.usdc.address, UsdcAbi, zkSyncProvider)

  const [ethBalance, wethBalance, usdcBalance] = await Promise.all([
    zkSyncProvider.getBalance(...(blockNumber ? [address, Number(blockNumber)] : [address])),
    weth.balanceOf(...(blockNumber ? [address, {blockTag: Number(blockNumber)}] : [address])),
    usdc.balanceOf(...(blockNumber ? [address, {blockTag: Number(blockNumber)}] : [address]))
  ])

  return {
    ethBalance,
    wethBalance,
    usdcBalance
  }
}
