import {useState} from "react"
import {Upload} from "../components/Upload.js"
import {Table} from "../components/Table.js"
import {FormControl, FormLabel, FormSelect} from "react-bootstrap"
import {waitForGasPrice} from "../web3/getGasPrice"
import {collect} from "../web3/sendTx"

const BATCH_SIZE = 10

function Collect() {
  const [data, setData] = useState([])
  const setRow = (index, key, value) => {
    setData(prevState => prevState.map((el, idx) => (idx === index ? {...el, [key]: value} : el)))
  }
  const [targetWallet, setTargetWallet] = useState("")
  const [maxGasPrice, setMaxGasPrice] = useState("25")
  const [waitingForGasPrice, setWaitingForGasPrice] = useState(false)

  const [network, setNetwork] = useState("zksync")

  const submitTx = async (row, index) => {
    setWaitingForGasPrice(true)
    await waitForGasPrice(maxGasPrice)
    setWaitingForGasPrice(false)

    setRow(index, `statuscollect`, "Pending")

    try {
      const result = await collect({
        privateKey: row.privateKey,
        targetAddress: targetWallet,
        network
      })
      if (result.success) {
        setRow(index, `statuscollect`, "Success")
        setRow(index, `txHashcollect`, result.txHash)
      } else {
        setRow(index, `statuscollect`, "Failed")
        if (result.errors) {
          console.log("Error:", result.errors.join(", "))
        }
      }
    } catch (error) {
      console.log("Error:", error)
      setRow(index, `statuscollect`, "Failed")
    }
  }

  const handleSubmit = async () => {
    if (!targetWallet) return

    for (let i = 0; i < data.length / BATCH_SIZE; i++) {
      await Promise.all(
        data.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE).map(async (row, idx) => {
          const index = i * BATCH_SIZE + idx
          await submitTx(row, index)
        })
      )
    }
  }

  return (
    <>
      <h1 className="mt-5 mb-3">Collect funds</h1>
      <div className="row mb-5">
        <Upload setData={setData}></Upload>
      </div>

      <div className="row mb-5">
        {waitingForGasPrice && <p>Waiting for gas price...</p>}
        <div className="col">
          <FormLabel>Target address</FormLabel>
          <FormControl
            value={targetWallet}
            onChange={e => {
              setTargetWallet(e.target.value)
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
          <FormLabel>Network</FormLabel>
          <FormSelect
            value={network}
            onChange={e => {
              setNetwork(e.target.value)
            }}
          >
            <option value="ethereum">Ethereum</option>
            <option value="zksync">ZKSync Era</option>
          </FormSelect>
        </div>
      </div>

      <div className="row mb-5">
        <Table data={data} type="collect" onRetry={submitTx} chain="zksync"/>
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

export default Collect
