import {Link} from "react-router-dom"
import {Button} from "react-bootstrap"

const Menu = () => (
  <div className="row">
    <div className="col">
      <Button variant="link">
        <Link to="/">Swap ZkSync</Link>
      </Button>
      <Button variant="link">
        <Link to="/swap-scroll">Swap Scroll</Link>
      </Button>
      <Button variant="link">
        <Link to="/collect">Collect</Link>
      </Button>
      <Button variant="link">
        <Link to="/unwrap">Unwrap Weth</Link>
      </Button>
      <Button variant="link">
        <Link to="/bridge">Bridge</Link>
      </Button>
      <Button variant="link">
        <Link to="/balances">Check balances</Link>
      </Button>
    </div>
  </div>
)

export default Menu
