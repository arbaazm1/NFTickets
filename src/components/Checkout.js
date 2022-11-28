import React, { Component } from 'react'
import { withRouter } from '../App'
import Factory from '../Factory.json'
import Market from '../Market.json'
import ConcertTickets from '../ConcertTickets.json'
import Navbar from './Navbar.js'

class Checkout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      image: null,
      name: null,
      symbol: null,
      location: null,
      eventTime: null,
      price: null,
      tier: null,
      isDirect: null,
      tokenId: null,
      owner: null,
    }
  }

  async componentDidMount() {
    const ethers = require('ethers')

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    let isDirect = this.props.match.params.listing.includes('p')
    let address = this.props.match.params.event
    const ticketCollection = new ethers.Contract(
      address,
      ConcertTickets.abi,
      signer,
    )
    let name = await ticketCollection.name()
    let symbol = await ticketCollection.symbol()
    let location = await ticketCollection.location()
    let eventTime = new Date(
      1000 * (await ticketCollection.eventTime()).toNumber(),
    ).toLocaleString()
    const market = new ethers.Contract(Market.address, Market.abi, signer)
    if (isDirect) {
      let tier = parseInt(this.props.match.params.listing.slice(1))
      let price = (await ticketCollection.tierPrice(tier)).toNumber()
      let image = await ticketCollection.tierURI(tier)
      this.setState({
        image: image,
        name: name,
        symbol: symbol,
        location: location,
        eventTime: eventTime,
        price: price,
        tier: tier,
        isDirect: isDirect,
        tokenId: null,
        address: address,
        owner: null,
      })
    } else {
      let tokenId = parseInt(this.props.match.params.listing)
      let numTier = await ticketCollection.numTier()
      let supply = 0
      let tier = null
      for (let i = 0; i < numTier; i++) {
        supply = supply + (await ticketCollection.tierMaxSupply(i)).toNumber()
        if (tokenId < supply) {
          tier = i
          break
        }
      }
      let image = await ticketCollection.tokenURI(tokenId)
      let royaltyInfo = await market.listing(address, tokenId)
      let price = royaltyInfo[0].toNumber() + royaltyInfo[1].toNumber()
      this.setState({
        image: image,
        name: name,
        symbol: symbol,
        location: location,
        eventTime: eventTime,
        price: price,
        tier: tier,
        isDirect: isDirect,
        tokenId: tokenId,
        address: address,
        owner: await ticketCollection.ownerOf(tokenId),
      })
    }
    console.log(this.state)
  }

  primaryBuy = async (e) => {
    e.preventDefault()

    try {
      const ethers = require('ethers')
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const addr = await signer.getAddress()
      const market = new ethers.Contract(Market.address, Market.abi, signer)
      let txn = await market.primaryBuy(
        this.state.address,
        this.state.tier,
        addr,
        { value: this.state.price },
      )
      await txn.wait()

      alert('Successfully mint your ticket!')
      window.location.replace('/')
    } catch (e) {
      alert('Mint Error' + e)
    }
  }

  secondaryBuy = async (e) => {
    e.preventDefault()

    try {
      const ethers = require('ethers')
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const addr = await signer.getAddress()
      const market = new ethers.Contract(Market.address, Market.abi, signer)
      let txn = await market.secondaryBuy(
        this.state.address,
        this.state.tokenId,
        addr,
        { value: this.state.price },
      )
      await txn.wait()

      alert('Successfully bought your ticket!')
      window.location.replace('/')
    } catch (e) {
      alert('Buy Error' + e)
    }
  }

  render() {
    return (
      <div style={{ 'min-height': '100vh' }}>
        <Navbar></Navbar>
        <div className="grid grid-cols-2 shadow-md rounded mb-4 mx-10 place-items-stretch">
          <div className="flex flex-col content-center my-10">
            <div className="flex-col flex items-center">
              <img
                src={this.state.image}
                alt=""
                className="flex w-80 h-80 rounded-lg object-cover"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-purple-500 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Event Name: {this.state.name}
              </label>
            </div>
            <div className="mb-4">
              <label
                className="block text-purple-500 text-sm font-bold mb-2"
                htmlFor="location"
              >
                Location: {this.state.location}
              </label>
            </div>
            <div className="mb-4">
              <label
                className="block text-purple-500 text-sm font-bold mb-2"
                htmlFor="time"
              >
                Time: {this.state.eventTime}
              </label>
            </div>
            <div className="mb-4">
              <label
                className="block text-purple-500 text-sm font-bold mb-2"
                htmlFor="tokenSymbol"
              >
                Collection Address: {this.state.address}
              </label>
            </div>
          </div>

          {this.state.isDirect ? (
            <div className="flex flex-col justify-center items-center my-10">
              Item is currently is listed at {this.state.price} wei
              <button
                onClick={(e) => {
                  this.primaryBuy(e)
                }}
                className="font-bold mt-10 w-full bg-green-500 text-white rounded p-2 shadow-lg"
              >
                Mint Ticket!
              </button>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center my-10">
              <p>
                Item #{this.state.tokenId} is currently is listed at{' '}
                {this.state.price} wei
              </p>

              <button
                onClick={(e) => {
                  this.secondaryBuy(e)
                }}
                className="font-bold mt-10 w-full bg-green-500 text-white rounded p-2 shadow-lg"
              >
                Buy Now!
              </button>
              <p>Seller: {this.state.owner}</p>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default withRouter(Checkout)
