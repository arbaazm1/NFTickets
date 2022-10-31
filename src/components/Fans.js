import Navbar from "./Navbar";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
  } from "react-router-dom";

export default function Fans() {

    return (
        <div className="">
            <Navbar></Navbar>
            <div>
      <a href="/primaryBuy">
        <button>Primary Buy</button>
      </a>
      <br />
      <br />
      <a href="/secondaryBuy">
        <button>Secondary Buy</button>
      </a>
    </div>
            </div>
            
    
    )
  }