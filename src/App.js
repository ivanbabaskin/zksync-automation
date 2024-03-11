import {BrowserRouter, Route, Routes} from "react-router-dom"
import Swap from "./pages/swap"
import SwapScroll from "./pages/swapScroll"
import Menu from "./components/Menu"
import Collect from "./pages/collect"
import UnwrapWeth from "./pages/unwrapWeth"
import Bridge from './pages/bridge'
import CheckBalances from "./pages/checkBalances"

const App = () => (
  <BrowserRouter>
    <div className="container mt-5">
      <Menu />
      <Routes>
        <Route path="/" Component={Swap} />
        <Route path="/swap-scroll" Component={SwapScroll}/>
        <Route path="/collect" Component={Collect} />
        <Route path="/unwrap" Component={UnwrapWeth} />
        <Route path="/bridge" Component={Bridge} />
        <Route path="/balances" Component={CheckBalances} />
      </Routes>
    </div>
  </BrowserRouter>
)

export default App
