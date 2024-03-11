import {useState} from "react"
import {Upload} from "../components/Upload.js"
import {Table} from "../components/Table.js"
import {FormControl, FormLabel, FormSelect} from "react-bootstrap"
import {waitForGasPrice} from "../web3/getGasPrice"
import { bridgeScroll } from "../web3/sendTx"
import {randomPause} from "../utils/randomPause"
import { settings, network } from '../config.js'

const BATCH_SIZE = 10

const config = settings[network];

function Bridge() {
  const [data, setData] = useState([])
  const setRow = (index, key, value) => {
    setData(prevState => prevState.map((el, idx) => (idx === index ? {...el, [key]: value} : el)))
  }

  const [minDelay, setMinDelay] = useState("10")
  const [maxDelay, setMaxDelay] = useState("20")
  const [maxGasPrice, setMaxGasPrice] = useState("25")
  const [waitingForGasPrice, setWaitingForGasPrice] = useState(false)

  const [fromNetwork, setFromNetwork] = useState('arbitrumOne');
  const [toNetwork, setToNetwork] = useState('scrollMainnet');

  const submitTx = async (row, index, isRetry = false) => {
    setWaitingForGasPrice(true)
    await waitForGasPrice(maxGasPrice)
    setWaitingForGasPrice(false)

    if (!isRetry) {
      setRow(index, `statusbridge`, "Delayed")
      await randomPause(Number(minDelay), Number(maxDelay))
    }
    setRow(index, `statusbridge`, "Pending")

    try {
      const result = await bridgeScroll({
        privateKey: row.privateKey,
        from: fromNetwork,
        to: toNetwork
      })
      if (result.success) {
        setRow(index, `statusbridge`, "Success")
        setRow(index, `txHashbridge`, result.txHash)
      } else {
        setRow(index, `statusbridge`, "Failed")
        if (result.errors) {
          console.log("Error:", result.errors.join(", "))
        }
      }
    } catch (error) {
      console.log("Error:", error)
      setRow(index, `statusbridge`, "Failed")
    }
  }

  const handleSubmit = async () => {
    if (fromNetwork == toNetwork) return

    for (let i = 0; i < data.length; i++) {
      await submitTx(data[i], i)
    }
  }

  return (
    <>
      <h1 className="mt-5 mb-3">Bridge</h1>
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
        <div className="col">
          <FormLabel>From</FormLabel>
          <FormSelect
            value={fromNetwork}
            onChange={e => {
              setFromNetwork(e.target.value)
            }}
          >
            <option value="arbitrumOne">{config.networks.arbitrumOne.name}</option>
            <option value="scrollMainnet">{config.networks.scrollMainnet.name}</option>
          </FormSelect>
        </div>
        <div className="col">
          <FormLabel>To</FormLabel>
          <FormSelect
            value={toNetwork}
            onChange={e => {
              setToNetwork(e.target.value)
            }}
          >
            <option value="arbitrumOne">{config.networks.arbitrumOne.name}</option>
            <option value="scrollMainnet">{config.networks.scrollMainnet.name}</option>
          </FormSelect>
        </div>
      </div>

      <div className="row mb-5">
        <Table data={data} type="bridge" onRetry={submitTx} chain="arbitrumOne"/>
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

export default Bridge
