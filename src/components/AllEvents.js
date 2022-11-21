import React from 'react';
import { Component } from 'react';
import {
  Link
} from 'react-router-dom';
import seatmap from "../seatmap.jpg"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'
import Navbar from './Navbar.js';

export default class AllEvents extends Component {
    constructor(props) {
        super(props)
        this.state = { events: [] }
    }

    componentDidMount() {
        // Connect to backend events DB here
        this.setState({events: [{
            id:"142",
            name:"Taylor Swift", 
            date:"May 14, 2023", 
            time:"7:00pm ET", 
            seatmap:{seatmap},
            directid:"9912",
            secondaryid:"11924"
            }]})
    }
    
    render() {
      return (
        <div className="allevents">
        <Navbar />
            <h1>Available Events</h1>
        {this.state.events.map(
          (event, index) =>
          <Container key={index} 
          style={{
            backgroundColor: 'lightgray'
          }}>
            <Row>
                <Col><b>{event.name}</b></Col>
                <Col>{event.date} at {event.time}</Col>
                <Col>
                    <Button>
                        <Link style={{color: 'white'}} to={event.id} relative="path">Buy Now</Link>
                    </Button>
                </Col>
            </Row>
        </Container>
        )}
        </div>
      )
    }
}