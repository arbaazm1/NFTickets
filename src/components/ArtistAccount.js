import Navbar from './Navbar'
import concert from './concert.png'
import Style from './ArtistAccount.css'
import { useState } from 'react'
import Factory from '../Factory.json'
import ConcertTickets from '../ConcertTickets.json'
import { useLocation } from 'react-router'

export default function ArtistAccount() {
  const [data, setData] = useState([])
  const [currAddress, updateAddress] = useState('0x')
  const [dataFetched, updateDataFetched] = useState(false)
  const ethers = require('ethers')
  const location = useLocation()

  async function withdrawRevenue(e, address) {
    e.preventDefault()

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      // updateMessage('Please wait.. uploading (upto 5 mins)')

      //Pull the deployed contract instance
      let contract = new ethers.Contract(address, ConcertTickets.abi, signer)
      let transaction = await contract.withdraw(currAddress)
      await transaction.wait()
      alert('Successfully withdrew your revenue!')
      window.location.replace('/artistAccount')
    } catch (e) {
      alert('Withdraw Error' + e)
    }
  }

  async function fetchData() {
    const ethers = require('ethers')
    let sumPrice = 0
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const addr = await signer.getAddress()

    //Pull the deployed contract instance
    let contract = new ethers.Contract(Factory.address, Factory.abi, signer)
    // Get all of the NFT collections
    const allCollections = await contract.ticketCollections()

    const asyncFilter = async (arr, predicate) =>
      Promise.all(arr.map(predicate)).then((results) =>
        arr.filter((_v, index) => results[index]),
      )

    const artistCollection = await asyncFilter(
      allCollections,
      async (address) => {
        let ticketCollection = new ethers.Contract(
          address,
          ConcertTickets.abi,
          signer,
        )
        let artist = await ticketCollection.artist()
        return artist == addr
      },
    )

    let dataObjects = []

    const items = await Promise.all(
      artistCollection.map(async (address) => {
        let ticketCollection = new ethers.Contract(
          address,
          ConcertTickets.abi,
          signer,
        )
        let name = await ticketCollection.name()
        let symbol = await ticketCollection.symbol()
        let image = await ticketCollection.URI()
        let location = await ticketCollection.location()
        let eventTime = new Date(
          1000 * (await ticketCollection.eventTime()).toNumber(),
        ).toLocaleString()
        let numTier = await ticketCollection.numTier()
        let ticketSold = []
        let ticketMaxSupply = []
        for (let i = 0; i < numTier; i++) {
          ticketSold.push((await ticketCollection.tierSupply(i)).toNumber())
          ticketMaxSupply.push(
            (await ticketCollection.tierMaxSupply(i)).toNumber(),
          )
        }
        let totalETHContract = (await provider.getBalance(address)).toNumber()
        let protocolFee = await ticketCollection.protocolFee()
        let revenue =
          totalETHContract - Math.floor((protocolFee * totalETHContract) / 100)
        return {
          image: image,
          name: name,
          symbol: symbol,
          eventTime: eventTime,
          location: location,
          revenue: revenue,
          ticketSold: ticketSold,
          ticketMaxSupply: ticketMaxSupply,
          address: address,
        }
      }),
    )
    console.log(items)
    setData(items)
    updateAddress(addr)
    updateDataFetched(true)
  }

  if (!dataFetched) fetchData()

  return (
    <div className="">
      <Navbar></Navbar>
      <div className="bg-white shadow-md rounded mx-10 my-10 py-1">
        <div className="my-8">
          <h1 className="text-center font-bold text-purple-500 my-8">
            Event List
          </h1>
        </div>

        <div className="grid grid-cols-2 my-4 mx-10 place-items-stretch">
          {data.map((object, i) => (
            <div className="flex-col flex items-center">
              <img
                src={object.image}
                alt=""
                className="w-72 h-80 rounded-lg object-cover"
              />
              <h3 className="text-center font-bold text-purple-500 mb-8">
                {object.name} {object.symbol}
              </h3>
              <h3 className="text-center font-bold text-purple-500 mb-8">
                {object.eventTime} {object.location}
              </h3>
              <h3 className="text-center font-bold text-purple-500 mb-8">
                Total Revenue: {object.revenue}
              </h3>
              <h3 className="text-center font-bold text-purple-500">
                Tickets Sold:
              </h3>
              {object.ticketSold.map((amount, i) => (
                <h3 className="text-center font-bold text-purple-500 mb-8">
                  Tier {i}: {amount}/{object.ticketMaxSupply[i]}
                </h3>
              ))}
              <button
                className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                onClick={(e) => {
                  withdrawRevenue(e, object.address)
                }}
              >
                Withdraw Revenue
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
