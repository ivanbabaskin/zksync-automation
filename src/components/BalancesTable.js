import {Button} from "react-bootstrap"

export const BalancesTable = ({data}) => {
  const handleExport = () => {
    const element = document.createElement("a")
    element.setAttribute(
      "href",
      `data:application/octet-stream,${data
        .map(row => `${row.ethBalance},${row.wethBalance},${row.usdcBalance}`)
        .join("\n")}`
    )
    element.setAttribute("download", "Balances.csv")

    element.style.display = "none"
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
  }

  return (
    <div className="Table table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Address</th>
            <th scope="col">ETH Balance</th>
            <th scope="col">WETH Balance</th>
            <th scope="col">USDC Balance</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} id={row.privateKey}>
              <th scope="row">{index + 1}</th>
              <td>{row.privateKey}</td>
              <td>{row.ethBalance}</td>
              <td>{row.wethBalance}</td>
              <td>{row.usdcBalance}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button onClick={handleExport} style={{marginBottom: "20px"}}>
        Download CSV
      </Button>
    </div>
  )
}
