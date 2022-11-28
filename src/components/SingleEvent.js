import React from 'react'
import { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom'
import Factory from '../Factory.json'
import Market from '../Market.json'
import ConcertTickets from '../ConcertTickets.json'
import seatmap from '../seatmap.jpg'
import { withRouter } from '../App'
import Navbar from './Navbar.js'

class Listing extends Component {
  constructor(props) {
    super(props)
    this.onclick = this.onclick.bind(this)
  }

  onclick() {
    console.log(
      'click on listing ' +
        this.props.id +
        ' from marketplace ' +
        this.props.eventid,
    )
  }

  render() {
    if (this.props.type === 'Direct') {
      return (
        <div className="listing">
          <div className="border-2 ml-12 mt-5 mb-12 flex flex-col items-center rounded-lg w-48 md:w-72 shadow-2xl">
            <img
              src={this.props.image}
              alt=""
              className="w-72 h-80 rounded-lg object-cover"
            />
            <div className="text-white w-full p-2 bg-gradient-to-t from-[#454545] to-transparent rounded-lg pt-5 -mt-20">
              <strong className="text-xl">
                {this.props.symbol} Tier {this.props.tier}
              </strong>
              <p className="display-inline">Price {this.props.price} wei</p>
              <button className="buy-now">
                <Link to={`/checkout/${this.props.eventid}/${this.props.id}`}>
                  Buy Now
                </Link>
              </button>
            </div>
          </div>
        </div>
        // key={index}
        // eventid={this.props.eventAddress}
        // type={this.props.type}
        // image={listing.image}
        // id={listing.id}
        // price={listing.price}
        // tier={listing.tier}
      )
    } else {
      return (
        <div className="listing">
          <div className="border-2 ml-12 mt-5 mb-12 flex flex-col items-center rounded-lg w-48 md:w-72 shadow-2xl">
            <img
              src={this.props.image}
              alt=""
              className="w-72 h-80 rounded-lg object-cover"
            />
            <div className="text-white w-full p-2 bg-gradient-to-t from-[#454545] to-transparent rounded-lg pt-5 -mt-20">
              <strong className="text-xl">
                Tier {this.props.tier} #{this.props.id}
              </strong>
              <p className="display-inline">Price {this.props.price} wei</p>
              <button className="buy-now">
                <Link to={`/checkout/${this.props.eventid}/${this.props.id}`}>
                  Buy Now
                </Link>
              </button>
            </div>
          </div>
        </div>
      )
    }
  }
}

class TicketListings extends Component {
  constructor(props) {
    super(props)
    this.state = { data: [] }
  }

  async componentDidMount() {
    let dataFetched = []
    const ethers = require('ethers')

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const addr = await signer.getAddress()
    const ticketCollection = new ethers.Contract(
      this.props.eventAddress,
      ConcertTickets.abi,
      signer,
    )
    const market = new ethers.Contract(Market.address, Market.abi, signer)
    if (this.props.type === 'Direct') {
      // fetch ticket tiers and display all buyable
      let numTier = await ticketCollection.numTier()
      for (let i = 0; i < numTier; i++) {
        let maxSupply = await ticketCollection.tierMaxSupply(i)
        let curSupply = await ticketCollection.tierSupply(i)
        if (maxSupply != curSupply) {
          dataFetched.push({
            id: 'p' + i.toString(),
            price: (await ticketCollection.tierPrice(i)).toNumber(),
            image: await ticketCollection.tierURI(i),
            tier: i,
            maxSupply: maxSupply,
            curSupply: curSupply,
          })
        }
      }
    } else {
      let numTier = await ticketCollection.numTier()
      let possibleIds = []
      let counter = 0
      for (let i = 0; i < numTier; i++) {
        let image = await ticketCollection.tierURI(i)
        let maxSupply = (await ticketCollection.tierMaxSupply(i)).toNumber()
        let curSupply = (await ticketCollection.tierSupply(i)).toNumber()
        for (let j = 0; j < curSupply; j++) {
          possibleIds.push({ id: counter + j, tier: i, image: image })
        }
        counter = counter + maxSupply
      }
      for (let i = 0; i < possibleIds.length; i++) {
        if (await market.isListed(this.props.eventAddress, possibleIds[i].id)) {
          let price = 0
          let royaltyInfo = await market.listing(
            this.props.eventAddress,
            possibleIds[i].id,
          )
          price = royaltyInfo[0].toNumber() + royaltyInfo[1].toNumber()
          dataFetched.push({
            id: possibleIds[i].id,
            price: price,
            image: possibleIds[i].image,
            tier: possibleIds[i].tier,
          })
        }
      }
    }
    this.setState({
      data: dataFetched,
      // [
      //   { id: 1, price: 100, tier: 'VIP', section: 200, seat: 'F14' },
      //   { id: 2, price: 73, tier: 'Basic', section: 190, seat: 'GG44' },
      //   { id: 3, price: 200, tier: 'Premium', section: '240', seat: 'ZZ90' },
      // ],
    })
  }

  render() {
    return (
      <div className="ticketlistings">
        <h3>{this.props.type} Listings </h3>

        {this.state.data.map((listing, index) => (
          <div className="flex flex-col items-center">
            <Listing
              key={index}
              eventid={this.props.eventAddress}
              type={this.props.type}
              image={listing.image}
              id={listing.id}
              price={listing.price}
              tier={listing.tier}
            />
          </div>
        ))}
      </div>
    )
  }
}

class Event extends Component {
  constructor(props) {
    super(props)
    this.state = { data: null }
  }

  async componentDidMount() {
    // Connect to backend event info db here (the event knows its id from the URL)
    // this.props.match.params.id
    const id = this.props.match.params.id
    const ethers = require('ethers')
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    //Pull the deployed contract instance
    let contract = new ethers.Contract(Factory.address, Factory.abi, signer)
    // Get all of the NFT collections
    const allCollections = await contract.ticketCollections()

    const addr = allCollections[id]
    let ticketCollection = new ethers.Contract(addr, ConcertTickets.abi, signer)
    this.setState({
      data: {
        name: await ticketCollection.name(),
        date: new Date(
          1000 * (await ticketCollection.eventTime()).toNumber(),
        ).toLocaleString(),
        id: id,
        seatmap: seatmap,
        symbol: await ticketCollection.symbol(),
        location: await ticketCollection.location(),
        address: addr,
      },
    })
  }

  render() {
    const { data } = this.state
    if (data === null) {
      return null
    }
    return (
      <div>
        <Navbar />
        <Container fluid>
          <Row>
            <h1>
              Tickets to {this.state.data.name} (SYMBOL:{' '}
              {this.state.data.symbol})
            </h1>
          </Row>
          <Row>
            <Col>
              <h2>Date: {this.state.data.date}</h2>
              <h2>Location: {this.state.data.location}</h2>
              <h2>Address: {this.state.data.address}</h2>
              <br />
            </Col>
          </Row>

          <Row>
            <Col>
              <TicketListings
                type="Direct"
                eventAddress={this.state.data.address}
              />
            </Col>
            <Col>
              <TicketListings
                type="Verified Resale"
                eventAddress={this.state.data.address}
              />
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

export default withRouter(Event)
