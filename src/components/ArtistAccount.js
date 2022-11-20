import Navbar from "./Navbar";
import concert from './concert.png'
import Style from './ArtistAccount.css'


export default function ArtistAccount() {

    return (
        <div className="">
            <Navbar></Navbar>
            <div className="grid grid-cols-2 bg-white shadow-md rounded mb-4 mx-10 place-items-stretch">
                <div className="flex flex-col content-center my-10"> 
                    <div className="flex-col flex items-center">
                    <h1 className="text-center font-bold text-purple-500 mb-8">
                        Event List
                        </h1>
                        <img src={concert} width="300" height="300" alt="Concert" />
                        <h3 className="text-center font-bold text-purple-500 mb-8">
                    FEB 10, 2023 Eden Park - Auckland, New Zealand
                    </h3>
                    <h3 className="text-center font-bold text-purple-500 mb-8">
                        Total Revenue: $50,000
                        </h3>
                        <h3 className="text-center font-bold text-purple-500 mb-8">
                        Tickets Sold Today: 100
                        </h3>
                        <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm">Withdraw Revenue</button>
                        <h3>
                            -
                        </h3>
                    <img src={concert} width="300" height="300" alt="Concert" />
                        <h3 className="text-center font-bold text-purple-500 mb-8">
                        MAR 12, 2023 Optus Stadium - Burswood, Australia
                    </h3>
                    <h3 className="text-center font-bold text-purple-500 mb-8">
                        Total Revenue: $50,000
                        </h3>
                        <h3 className="text-center font-bold text-purple-500 mb-8">
                        Tickets Sold Today: 100
                        </h3>
                        <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm">Withdraw Revenue</button>
                        <h3>
                            -
                        </h3>
                    <img src={concert} width="300" height="300" alt="Concert" />
                        <h3 className="text-center font-bold text-purple-500 mb-8">
                        May 13, 2023 NRG Stadium - Houston Texas
                    </h3>
                    <h3 className="text-center font-bold text-purple-500 mb-8">
                        Total Revenue: $50,000
                        </h3>
                        <h3 className="text-center font-bold text-purple-500 mb-8">
                        Tickets Sold Today: 100
                        </h3>
                        <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm">Withdraw Revenue</button>
                        <h3>
                            -
                        </h3>
                    <img src={concert} width="300" height="300" alt="Concert" />
                        <h3 className="text-center font-bold text-purple-500 mb-8">
                        May 20, 2023 Raymond James Stadium - Tampa, FL
                    </h3>
                    <h3 className="text-center font-bold text-purple-500 mb-8">
                        Total Revenue: $50,000
                        </h3>
                        <h3 className="text-center font-bold text-purple-500 mb-8">
                        Tickets Sold Today: 100
                        </h3>
                        <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm">Withdraw Revenue</button>
                        <h3>
                            -
                        </h3>
                    </div>
                </div>
            </div>
        </div>
            
    )
  }