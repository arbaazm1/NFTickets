import React from 'react'
import { Component } from 'react'
import { Link } from 'react-router-dom'
import seatmap from '../seatmap.jpg'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Navbar from './Navbar.js'
import Factory from '../Factory.json'
import Market from '../Market.json'
import ConcertTickets from '../ConcertTickets.json'

export default class AllEvents extends Component {
  constructor(props) {
    super(props)
    this.state = { events: [] }
  }

  async componentDidMount() {
    // Connect to backend events DB here
    const ethers = require('ethers')
    let sumPrice = 0
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    //Pull the deployed contract instance
    let contract = new ethers.Contract(Factory.address, Factory.abi, signer)
    // Get all of the NFT collections
    const allCollections = await contract.ticketCollections()
    let dataObjects = []

    await Promise.all(
      allCollections.map(async (address, index) => {
        let ticketCollection = new ethers.Contract(
          address,
          ConcertTickets.abi,
          signer,
        )
        let name = await ticketCollection.name()
        let symbol = await ticketCollection.symbol()
        let location = await ticketCollection.location()
        let date = new Date(
          1000 * (await ticketCollection.eventTime()).toNumber(),
        ).toLocaleString()

        dataObjects.push({
          id: index,
          name: name,
          date: date,
          location: location,
        })
      }),
    )
    console.log(dataObjects)

    this.setState({
      events: dataObjects,
    })
  }

  render() {
    return (
      <div className="allevents">
        <Navbar />
        <h1>Available Events</h1>
        {this.state.events.map((event, index) => {
          console.log(event)
          return (
            <div className="border-2 ml-12 mt-5 mb-12 mr-12 flex flex-col items-center rounded-lg w-400 md:w-400 shadow-2xl">
              <Container key={index}>
                <Row>
                  <Col>
                    <b>{event.name}</b>
                  </Col>
                  <Col>{event.date}</Col>
                  <Col>{event.location}</Col>
                  <Col>
                    <Button>
                      <Link
                        style={{ color: 'white' }}
                        to={event.id.toString()}
                        relative="path"
                      >
                        Buy Now
                      </Link>
                    </Button>
                  </Col>
                </Row>
              </Container>
            </div>
          )
        })}
      </div>
    )
  }
}
