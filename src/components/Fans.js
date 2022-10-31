import Navbar from './Navbar'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from 'react-router-dom'

export default function Fans() {
  return (
    <div className="">
      <Navbar></Navbar>
      <div>
        <Link to="/primaryBuy">
          <button>Primary Buy</button>
        </Link>
        <br />
        <br />
        <Link to="/secondaryBuy">
          <button>Secondary Buy</button>
        </Link>
      </div>
    </div>
  )
}
