import React from 'react';
import { Component } from 'react';
import {
  Route,
  Routes,
  useParams
} from "react-router-dom";

import './App.css';
import AllEvents from './components/AllEvents.js'
import Event from './components/SingleEvent.js'
import Checkout from './components/Checkout.js'
import Marketplace from './components/Marketplace';
import Artists from './components/Artists';
import Profile from './components/Profile';
import SellNFT from './components/SellNFT';
import NFTPage from './components/NFTpage';
import ReactDOM from "react-dom/client";
import ArtistAccount from './components/ArtistAccount';
import ArtistListingPage from './components/ArtistListingPage';



export default class App extends Component {
    render() {
      return (
        <div className="allevents">
            <Routes>
              <Route path="/events" element={<AllEvents />} />
              <Route path="/events/:id" element={<Event />} />
              <Route path="/checkout/:event/:listing" element={<Checkout />} />
              <Route path="/" element={<Marketplace />}/>
              <Route path="/artists" element={<Artists />}/>
              <Route path="/artistAccount" element={<ArtistAccount />}/>
              <Route path="/artistListingPage" element={<ArtistListingPage />}/>
              <Route path="/nftPage" element={<NFTPage />}/>        
              <Route path="/profile" element={<Profile />}/>
              <Route path="/sellNFT" element={<SellNFT />}/>   
            </Routes>
        </div>
      )
    }
  }


export function withRouter(Children){
    return(props)=>{
  
       const match  = {params: useParams()};
       return <Children {...props}  match = {match}/>
   }
  }