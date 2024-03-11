import {useState} from "react"
import {Upload} from "../components/Upload.js"
import {Table} from "../components/Table.js"
import {settings} from "../config.js"
import * as sendTx from "../web3/sendTx"
import {FormControl, FormLabel, FormSelect} from "react-bootstrap"
import {randomPause} from "../utils/randomPause"
import {pickRandomArrayEl} from "../utils/pickRandomArrayEl"
import {waitForGasPrice} from "../web3/getGasPrice"

const pickDex = type => {
  let callback
  let dex
  switch (type) {
    case "randomSwap":
      dex = pickRandomArrayEl(Object.keys(settings.directSwap.zksync))
      callback = sendTx[dex]
      break
    case "randomSwapReverse":
      dex = pickRandomArrayEl(Object.keys(settings.reverseSwap.zksync))
      callback = sendTx[dex]
      break
    default:
      callback = sendTx[type]
  }
  return [callback, dex]
}

function Swap() {
  const [data, setData] = useState([])
  const [type, setType] = useState("randomSwap")
  const setRow = (index, key, value) => {
    setData(prevState => prevState.map((el, idx) => (idx === index ? {...el, [key]: value} : el)))
  }

  const [minDelay, setMinDelay] = useState("10")
  const [maxDelay, setMaxDelay] = useState("20")
  const [maxGasPrice, setMaxGasPrice] = useState("25")
  const [waitingForGasPrice, setWaitingForGasPrice] = useState(false)

  const submitTx = async (row, i, isRetry = false) => {
    if (isRetry ? row[`status${type}`] !== "Failed" : row[`status${type}`]) return

    let callback
    let dex
    if (isRetry && type.startsWith("random")) {
      dex = row[`dex${type}`]
      callback = sendTx[dex]
    } else {
      ;[callback, dex] = pickDex(type)
    }
    if (typeof callback !== "function") return
    if (type.startsWith("random")) {
      setRow(i, `dex${type}`, dex)
    }

    setWaitingForGasPrice(true)
    await waitForGasPrice(maxGasPrice, type === "bridge" ? "ethereum" : "zksync")
    setWaitingForGasPrice(false)

    if (!isRetry) {
      setRow(i, `status${type}`, "Delayed")
      await randomPause(Number(minDelay), Number(maxDelay))
    }
    setRow(i, `status${type}`, "Pending")

    try {
      const result = await callback({privateKey: row.privateKey, network: "zksync"})
      if (result.success) {
        setRow(i, `status${type}`, "Success")
        setRow(i, `txHash${type}`, result.txHash)
      } else {
        setRow(i, `status${type}`, "Failed")
        if (result.errors) {
          console.log("Error:", result.errors.join(", "))
        }
      }
    } catch (error) {
      console.log("Error:", error)
      setRow(i, `status${type}`, "Failed")
    }
  }

  const handleSubmit = async () => {
    for (let i = 0; i < data.length; i++) {
      await submitTx(data[i], i)
    }
  }

  return (
    <>
      <h1 className="mt-5 mb-3">ZkSync Tx automation</h1>
      <div className="row mb-5">
        <Upload setData={setData}></Upload>
      </div>

      <div className="row mb-5">
        {waitingForGasPrice && <p>Waiting for gas price...</p>}
        <div className="col">
          <FormLabel>Min Delay, seconds</FormLabel>
          <FormControl
            type="number"
            value={minDelay}
            onChange={e => {
              if (
                e.target.value !== "" &&
                (isNaN(Number(e.target.value)) || Number(e.target.value) < 0)
              )
                return
              setMinDelay(e.target.value)
            }}
          />
        </div>
        <div className="col">
          <FormLabel>Max Delay, seconds</FormLabel>
          <FormControl
            type="number"
            value={maxDelay}
            onChange={e => {
              if (
                e.target.value !== "" &&
                (isNaN(Number(e.target.value)) || Number(e.target.value) < 0)
              )
                return
              setMaxDelay(e.target.value)
            }}
          />
        </div>
        <div className="col">
          <FormLabel>Max gas price, GWei</FormLabel>
          <FormControl
            value={maxGasPrice}
            onChange={e => {
              setMaxGasPrice(e.target.value)
            }}
          />
        </div>
      </div>

      <FormSelect
        onChange={e => {
          setType(e.target.value)
        }}
      >
        {[
          "randomSwap",
          "randomSwapReverse",
          ...Object.keys(settings.directSwap.zksync),
          ...Object.keys(settings.reverseSwap.zksync),
          ...Object.keys(settings.otherOperations)
        ].map(el => (
          <option value={el} key={el}>
            {el === "randomSwap"
              ? "Random DEX Swap ETH/USDC"
              : el === "randomSwapReverse"
              ? "Random DEX Swap USDC/ETH"
              : {
                  ...settings.directSwap.zksync,
                  ...settings.reverseSwap.zksync,
                  ...settings.otherOperations
                }[el]}
          </option>
        ))}
      </FormSelect>

      <div className="row mb-5">
        <Table data={data} type={type} onRetry={submitTx} chain="zksync"></Table>
      </div>
      <div className="row mb-5">
        <div className="SendButton">
          <button type="button" className="btn btn-primary me-3" onClick={handleSubmit}>
            Send transactions
          </button>
        </div>
      </div>
    </>
  )
}

export default Swap
