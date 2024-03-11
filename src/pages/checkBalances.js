import {useState} from "react"
import {Upload} from "../components/Upload.js"
import {ethers} from "ethers"
import {checkBalances} from "../web3/sendTx"
import {delay} from "../utils/delay"
import {BalancesTable} from "../components/BalancesTable"

const BATCH_SIZE = 10

function CheckBalances() {
  const [data, setData] = useState([])
  const [blockNumber, setBlockNumber] = useState(undefined)
  const [totalEth, setTotalEth] = useState(ethers.BigNumber.from(0))
  const [totalWeth, setTotalWeth] = useState(ethers.BigNumber.from(0))
  const [totalUsdc, setTotalUsdc] = useState(ethers.BigNumber.from(0))
  const [info, setInfo] = useState("")

  const submitTx = async (row, index) => {
    try {
      if (!row.privateKey) return

      const result = await checkBalances({
        address: row.privateKey, // This is actually an address in this case, not private key
        blockNumber
      })
      setTotalEth(prevState => prevState.add(result.ethBalance))
      setTotalWeth(prevState => prevState.add(result.wethBalance))
      setTotalUsdc(prevState => prevState.add(result.usdcBalance))

      setData(prevState =>
        prevState.map((r, idx) =>
          idx === index
            ? {
                ...r,
                ethBalance: ethers.utils.formatEther(result.ethBalance.toString()),
                wethBalance: ethers.utils.formatEther(result.wethBalance.toString()),
                usdcBalance: ethers.utils.formatEther(result.usdcBalance.toString())
              }
            : r
        )
      )
    } catch (error) {
      console.log("Error:", error)
    }
  }

  const handleSubmit = async () => {
    for (let i = 0; i < data.length / BATCH_SIZE; i++) {
      try {
        await Promise.all(
          data.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE).map(async (row, idx) => {
            const index = i * BATCH_SIZE + idx
            await submitTx(row, index)
          })
        )
        await delay(500)
      } catch (e) {
        setInfo("Error")
        break
      }
    }

    setInfo("Done")
  }

  return (
    <>
      <h1 className="mt-5 mb-3">Check total balance</h1>
      <div className="row mb-5">
        <Upload label="Upload address list" setData={setData} />
        <div className="col">
          <h4>Total wallets: {data.length}</h4>
        </div>
        <div className="col">
          <h4>Block number</h4>
          <input
            type="number"
            value={String(blockNumber)}
            onChange={e => {
              setBlockNumber(ethers.BigNumber.from(e.target.value))
            }}
          />
        </div>
      </div>

      <div className="row mb-5">
        <div className="col">
          <h4>Total ETH</h4>
          {ethers.utils.formatEther(totalEth.toString())}
        </div>
        <div className="col">
          <h4>Total WETH</h4>
          {ethers.utils.formatEther(totalWeth.toString())}
        </div>
        <div className="col">
          <h4>Total USDC</h4>
          {ethers.utils.formatEther(totalUsdc.toString())}
        </div>
      </div>

      <div className="row mb-5">
        <div className="SendButton">
          <button type="button" className="btn btn-primary me-3" onClick={handleSubmit}>
            Check balances
          </button>
          {info}
        </div>
      </div>

      <BalancesTable data={data} />
    </>
  )
}

export default CheckBalances
