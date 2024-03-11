import {useRef} from "react"
import Papa from "papaparse"

function Input({inputRef, setData}) {
  function uploadFile(event) {
    if (!event.target.files || !event.target.files.length) return
    const file = event.target.files[0]
    const reader = new FileReader()

    // Event listener on reader when the file
    // loads, we parse it and set the data.
    reader.onload = async ({target}) => {
      const csv = Papa.parse(target.result, {})
      const parsedData = csv?.data

      setData(prevState => {
        const newData = [...prevState]

        for (const row of parsedData) {
          for (const element of row) {
            if (typeof newData.find(row => row.privateKey === element) === "undefined") {
              newData.push({
                privateKey: element
              })
            }
          }
        }

        return newData
      })
      inputRef.current.value = ""
    }
    reader.readAsText(file)
  }

  return <input className="d-none" ref={inputRef} type="file" name="upload" onChange={uploadFile} />
}

function Button({inputRef}) {
  function handleClick() {
    inputRef.current.click()
  }

  return (
    <button type="button" className="btn btn-primary" onClick={handleClick}>
      Upload
    </button>
  )
}

export function Upload({setData, label = "Upload private keys list"}) {
  const inputRef = useRef(null)
  return (
    <div className="Upload col col-md-4">
      <h4>{label}</h4>
      <Input inputRef={inputRef} setData={setData}></Input>
      <Button inputRef={inputRef}></Button>
    </div>
  )
}
