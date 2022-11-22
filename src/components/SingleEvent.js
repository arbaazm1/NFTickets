import React from 'react';
import { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {
  Link
} from 'react-router-dom';
import seatmap from "../seatmap.jpg";
import { withRouter } from "../App";
import Navbar from './Navbar.js';


class Listing extends Component {
  constructor(props) {
    super(props)
    this.onclick = this.onclick.bind(this)
  }

  onclick() {
      console.log('click on listing ' + this.props.id + ' from marketplace ' + this.props.eventid)
  }

  render() {
    return (
      <div className="listing">
      <table>
        <tbody>
        <tr>
          <th>Section {this.props.section}</th>
        </tr>
        <tr>
          <td>Seat {this.props.seat}</td>
        </tr>
        <tr>
          <td>Price: ${this.props.price}</td>
        </tr>
        <tr>
          <td>{this.props.tier} Tier</td>
        </tr>
        <tr>
          <td>
            <button className='buy-now'>
            <Link to={`/checkout/${this.props.eventid}/${this.props.id}`}>Buy Now</Link>
            </button>
            </td>
        </tr>
        </tbody>
        </table>        
      </div>
    );
  }
}

class TicketListings extends Component {
  constructor(props) {
    super(props)
    this.state = {data: []}
  }

  componentDidMount() {
    // Connect to backend listings db here

    // ID corresponds to tokenid
    // Others are direct matches
    this.setState({
      data: [
        { id: 1 , price: 100, tier: "VIP", section: 200, seat: "F14" }, 
        { id: 2 , price: 73, tier: "Basic", section: 190, seat: "GG44" },  
        { id: 3 , price: 200, tier: "Premium", section: "240", seat: "ZZ90" }
      ]
    })
  }

  render() {
    return (
      <div className="ticketlistings">
        <h3>{this.props.type} Listings </h3>

        {this.state.data.map(
          (listing, index) => 
          <div className="border-2 ml-12 mt-5 mb-12 flex flex-col items-center rounded-lg w-48 md:w-72 shadow-2xl">
          <Listing key={index} 
          eventid={this.props.eventid} id={listing.id} price={listing.price} tier={listing.tier} section={listing.section} seat={listing.seat} />
          </div>
        )}
      </div>
    );
  }
}

class Event extends Component {

  constructor(props) {
    super(props)
    this.state = { data: {} }
  }

  componentDidMount() {
    // Connect to backend event info db here (the event knows its id from the URL)
    // this.props.match.params.id
    this.setState({
      data: {
        name:"Taylor Swift", 
        date:"May 14, 2023", 
        time:"7:00pm ET", 
        directid:"9912",
        secondaryid:"11924",
        seatmap: seatmap,
        symbol: "TSE",
        location: "FedEx Field in Washington, D.C."
    }})
  }

    render() {
      console.log(this.state.data)
      return (
        <div>
        <Navbar />
        <Container fluid>
          <Row>
          <h1>Tickets to {this.state.data.name} (SYMBOL: {this.state.data.symbol})</h1>
        </Row>
        <Row>
          <Col>
        <h2>Date: {this.state.data.date}</h2>
          <h2>Time: {this.state.data.time}</h2>
          <h2>Location: {this.state.data.location}</h2>
          <br />
          </Col>
        </Row>
        
          <Row>
            <Col>
              <TicketListings type="Direct" eventid={this.state.data.directid}/>
            </Col>
            <Col>
              <TicketListings type="Verified Resale" eventid={this.state.data.secondaryid}/>
            </Col>
            <Col>
              <img src={this.state.data.seatmap} alt="seat map"></img>
            </Col>
          </Row>
        </Container>
        </div>
      )
  }
}

export default withRouter(Event);