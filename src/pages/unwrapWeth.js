import {useState} from "react"
import {Upload} from "../components/Upload.js"
import {Table} from "../components/Table.js"
import {FormControl, FormLabel} from "react-bootstrap"
import {waitForGasPrice} from "../web3/getGasPrice"
import {unwrapWeth} from "../web3/sendTx"
import {randomPause} from "../utils/randomPause"

function UnwrapWeth() {
  const [data, setData] = useState([])
  const setRow = (index, key, value) => {
    setData(prevState => prevState.map((el, idx) => (idx === index ? {...el, [key]: value} : el)))
  }
  const [maxGasPrice, setMaxGasPrice] = useState("25")
  const [waitingForGasPrice, setWaitingForGasPrice] = useState(false)

  const [minDelay, setMinDelay] = useState("10")
  const [maxDelay, setMaxDelay] = useState("20")

  const submitTx = async (row, index, isRetry) => {
    setWaitingForGasPrice(true)
    await waitForGasPrice(maxGasPrice)
    setWaitingForGasPrice(false)

    if (!isRetry) {
      setRow(index, "statusunwrap", "Delayed")
      await randomPause(Number(minDelay), Number(maxDelay))
    }
    setRow(index, "statusunwrap", "Pending")

    try {
      const result = await unwrapWeth({
        privateKey: row.privateKey
      })
      if (result.success) {
        setRow(index, `statusunwrap`, "Success")
        setRow(index, `txHashunwrap`, result.txHash)
      } else {
        setRow(index, `statusunwrap`, "Failed")
        if (result.errors) {
          console.log("Error:", result.errors.join(", "))
        }
      }
    } catch (error) {
      console.log("Error:", error)
      setRow(index, `statusunwrap`, "Failed")
    }
  }

  const handleSubmit = async () => {
    for (let i = 0; i < data.length; i++) {
      await submitTx(data[i], i)
    }
  }

  return (
    <>
      <h1 className="mt-5 mb-3">Unwrap WETH</h1>
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

      <div className="row mb-5">
        <Table data={data} type="unwrap" onRetry={submitTx} chain="zksync"/>
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

export default UnwrapWeth
