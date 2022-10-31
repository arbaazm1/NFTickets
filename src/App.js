import './App.css';
import Navbar from './components/Navbar.js';
import Marketplace from './components/Marketplace';
import Artists from './components/Artists';
import Fans from './components/Fans';
import Profile from './components/Profile';
import SellNFT from './components/SellNFT';
import NFTPage from './components/NFTpage';
import ReactDOM from "react-dom/client";
import PrimaryBuy from './components/PrimaryBuy';
import SecondaryBuy from './components/SecondaryBuy';
import ArtistAccount from './components/ArtistAccount';
import ArtistListingPage from './components/ArtistListingPage';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <div className="container">
        <Routes>
          <Route path="/" element={<Marketplace />}/>
          <Route path="/artists" element={<Artists />}/>
          <Route path="/primaryBuy" element={<PrimaryBuy />}/>
          <Route path="/secondaryBuy" element={<SecondaryBuy />}/>
          <Route path="/artistAccount" element={<ArtistAccount />}/>
          <Route path="/artistListingPage" element={<ArtistListingPage />}/>
          <Route path="/fans" element={<Fans />}/>
          <Route path="/nftPage" element={<NFTPage />}/>        
          <Route path="/profile" element={<Profile />}/>
          <Route path="/sellNFT" element={<SellNFT />}/>             
        </Routes>
    </div>
  );
}

export default App;