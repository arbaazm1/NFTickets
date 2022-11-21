import React, { Component } from "react";
import { withRouter } from "../App";
import Navbar from './Navbar.js';

class Checkout extends Component {
    render() {
        return (
            <div>
            <Navbar />
                <h1>Sample Checkout Page</h1>
                <p>Event ID {this.props.match.params.event}</p>
                <p>Listing ID {this.props.match.params.listing}</p>
            </div>
        )
    }
}

export default withRouter(Checkout)