import Navbar from "./Navbar";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
  } from "react-router-dom";

export default function Artists() {

    return (
        <div className="">
            <Navbar></Navbar>
            <div>
      <a href="/artistAccount">
        <button>Artist Account</button>
      </a>
      <br />
      <br />
      <a href="/artistListingPage">
        <button>Artist Listing Page</button>
      </a>
    </div>
            </div>
            
    
    )
  }