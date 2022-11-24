import Navbar from './Navbar'
import axie from '../tile.jpeg'
import { useLocation, useParams } from 'react-router-dom'
import ConcertTickets from '../ConcertTickets.json'
import Market from '../Market.json'
import axios from 'axios'
import { useState, useEffect } from 'react'

export default function NFTPage(props) {
  const [data, updateData] = useState({})
  const [dataFetched, updateDataFetched] = useState(false)
  const [message, updateMessage] = useState('')
  const [resalePrice, updateResalePrice] = useState()
  const [confirmResalePrice, updateConfirmResalePrice] = useState()
  const [currAddress, updateCurrAddress] = useState('0x')
  const params = useParams().id
  const para = params.split('_')
  const address = para[0]
  const tokenId = para[1]

  useEffect(() => {
    if (!resalePrice) {
      updateMessage('Please input a price')
    } else if (resalePrice != confirmResalePrice) {
      updateMessage('Resale price and confirm resale price do not match')
    } else {
      updateMessage('')
    }
  }, [resalePrice, confirmResalePrice])

  async function getNFTData(address, tokenId) {
    const ethers = require('ethers')
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const addr = await signer.getAddress()
    //Pull the deployed contract instance
    let contract = new ethers.Contract(address, ConcertTickets.abi, signer)
    const market = new ethers.Contract(Market.address, Market.abi, signer)
    const isListed = await market.isListed(address, tokenId)
    let price = 0
    let royalty = 0
    if (isListed) {
      let royaltyInfo = await market.listing(address, tokenId)
      price = royaltyInfo[0].toNumber()
      royalty = royaltyInfo[1].toNumber()
    }
    let numTier = await contract.numTier()
    let maxSupply = 0
    let tier = -1
    for (let j = 0; j < numTier; j++) {
      maxSupply = maxSupply + (await contract.tierMaxSupply(j))
      if (maxSupply > tokenId) {
        tier = j
        break
      }
    }
    //create an NFT Token
    const tokenURI = await contract.tokenURI(tokenId)
    const name = await contract.name()
    const location = await contract.location()
    const symbol = await contract.symbol()
    const eventTime = new Date(
      1000 * (await contract.eventTime()).toNumber(),
    ).toLocaleString()
    // console.log(listedToken)

    let item = {
      name: name,
      location: location,
      symbol: symbol,
      eventTime: eventTime,
      tokenURI: tokenURI,
      tier: tier,
      isListed: isListed,
      price: price,
      royalty: royalty,
    }
    console.log(item)
    updateData(item)
    updateDataFetched(true)
    updateCurrAddress(addr)
  }

  async function delistItem(e) {
    e.preventDefault()
    try {
      const ethers = require('ethers')
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      // updateMessage('Please wait.. uploading (upto 5 mins)')

      //Pull the deployed contract instance
      let market = new ethers.Contract(Market.address, Market.abi, signer)

      let transaction = await market.secondaryDelist(address, tokenId)
      await transaction.wait()
      alert('Successfully delist item!')
      window.location.replace('/profile')
    } catch (exception) {
      alert('Delist Error' + exception)
    }
  }

  async function listItem(e) {
    e.preventDefault()
    console.log('click')
    try {
      const ethers = require('ethers')
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      // updateMessage('Please wait.. uploading (upto 5 mins)')

      //Pull the deployed contract instance
      let market = new ethers.Contract(Market.address, Market.abi, signer)

      let transaction = await market.secondaryList(
        address,
        tokenId,
        resalePrice,
      )
      await transaction.wait()
      alert('Successfully list item!')
      window.location.replace('/profile')
    } catch (exception) {
      alert('List Error' + exception)
    }
  }

  if (!dataFetched) getNFTData(address, tokenId)

  return (
    <div style={{ 'min-height': '100vh' }}>
      <Navbar></Navbar>
      <div className="grid grid-cols-2 shadow-md rounded mb-4 mx-10 place-items-stretch">
        <div className="flex flex-col content-center my-10">
          <div className="flex-col flex items-center">
            <img
              src={data.tokenURI}
              alt=""
              className="flex w-80 h-80 rounded-lg object-cover"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Event Name: {data.name}
            </label>
          </div>
          <div className="mb-4">
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="location"
            >
              Location: {data.location}
            </label>
          </div>
          <div className="mb-4">
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="time"
            >
              Time: {data.eventTime}
            </label>
          </div>
          <div className="mb-4">
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="tokenSymbol"
            >
              Description
            </label>
          </div>
        </div>

        {!data.isListed ? (
          <div className="flex flex-col justify-center my-10" id="nftForm">
            <form>
              <div className="mb-4">
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="resalePrice1"
                  type="number"
                  placeholder="Resale Price"
                  onChange={(e) => {
                    updateResalePrice(e.target.value)
                  }}
                  value={resalePrice}
                ></input>
              </div>
              <div className="mb-4">
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="resalePrice2"
                  type="text"
                  placeholder="Confirm resale price"
                  onChange={(e) => {
                    updateConfirmResalePrice(e.target.value)
                  }}
                  value={confirmResalePrice}
                ></input>
              </div>

              <br></br>
              <div className="text-red-600 text-center">{message}</div>
              <button
                disabled={!resalePrice | (resalePrice != confirmResalePrice)}
                onClick={(e) => {
                  listItem(e)
                }}
                className="font-bold mt-10 w-full bg-purple-500 text-white rounded p-2 shadow-lg"
              >
                List Item!
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center my-10">
            Item is currently is listed at {data.price} + {data.royalty}
            (royalty) wei
            <button
              onClick={(e) => {
                delistItem(e)
              }}
              className="font-bold mt-10 w-full bg-red-500 text-white rounded p-2 shadow-lg"
            >
              Delist
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
