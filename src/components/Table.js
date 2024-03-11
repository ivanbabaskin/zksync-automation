import {settings, network} from "../config.js"
const config = settings[network]

export const Table = ({data, type, onRetry, chain="zksync"}) => {
  return (<div className="Table table-responsive">
    <table className="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Private key</th>
          <th scope="col">Status</th>
          {type.startsWith("random") && <th scope="col">DEX</th>}
          <th scope="col">Tx hash</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index} id={row.privateKey}>
            <th scope="row">{index + 1}</th>
            <td>{row.privateKey}</td>
            <td>{row[`status${type}`]}</td>
            {type.startsWith("random") && (
              <td>
                {
                  {
                    ...settings.directSwap[chain],
                    ...settings.reverseSwap[chain]
                  }[row[`dex${type}`]]
                }
              </td>
            )}
            <td>
              <a target="_blank" href={config.networks[chain].explorerLink + row[`txHash${type}`]} rel="noreferrer">
                {row[`txHash${type}`]}
              </a>
            </td>
            <td>
              <button
                type="button"
                className="btn btn-primary me-3"
                onClick={() => {
                  onRetry(data[index], index, true)
                }}
                disabled={row[`status${type}`] !== "Failed"}
              >
                Resend
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
}
