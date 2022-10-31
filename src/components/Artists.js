import Navbar from './Navbar'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from 'react-router-dom'

export default function Artists() {
  return (
    <div className="">
      <Navbar></Navbar>
      <div>
        <Link to="/artistAccount">
          <button>Artist Account</button>
        </Link>
        <br />
        <br />
        <Link to="/artistListingPage">
          <button>Artist Listing Page</button>
        </Link>
      </div>
    </div>
  )
}
