import Navbar from './Navbar'
import axie from '../tile.jpeg'
import { useLocation, useParams } from 'react-router-dom'
import MarketplaceJSON from '../Marketplace.json'
import axios from 'axios'
import { useState } from 'react'

export default function NFTPage(props) {
  const [data, updateData] = useState({})
  const [dataFetched, updateDataFetched] = useState(false)
  const [message, updateMessage] = useState('')
  const [currAddress, updateCurrAddress] = useState('0x')

  async function getNFTData(address, tokenId) {
    const ethers = require('ethers')
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const addr = await signer.getAddress()
    //Pull the deployed contract instance
    let contract = new ethers.Contract(
      MarketplaceJSON.address,
      MarketplaceJSON.abi,
      signer,
    )
    //create an NFT Token
    const tokenURI = await contract.tokenURI(tokenId)
    const listedToken = await contract.getListedTokenForId(tokenId)
    let meta = await axios.get(tokenURI)
    meta = meta.data
    // console.log(listedToken)

    let item = {
      price: meta.price,
      tokenId: tokenId,
      seller: listedToken.seller,
      owner: listedToken.owner,
      image: meta.image,
      name: meta.name,
      description: meta.description,
    }
    updateData(item)
    updateDataFetched(true)
    updateCurrAddress(addr)
  }

  const params = useParams()
  const para = params.tokenId.split('_')
  const address = para[0]
  const tokenId = para[1]
  if (!dataFetched) getNFTData(tokenId)

  return (
    <div style={{ 'min-height': '100vh' }}>
      <Navbar></Navbar>
      <div className="grid grid-cols-2 shadow-md rounded mb-4 mx-10 place-items-stretch">
        <div className="flex flex-col content-center my-10">
          <div className="flex-col flex items-center">
            <img
              src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/little-cute-maltipoo-puppy-royalty-free-image-1652926025.jpg?crop=0.444xw:1.00xh;0.129xw,0&resize=980:*"
              alt=""
              className="flex w-80 h-80 rounded-lg object-cover"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Event Name
            </label>
          </div>
          <div className="mb-4">
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="location"
            >
              Location
            </label>
          </div>
          <div className="mb-4">
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="time"
            >
              Time
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

        <div className="flex flex-col justify-center my-10" id="nftForm">
          <form>
            <div className="mb-4">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="resale reason"
                type="text"
                placeholder="Resale details (e.g. reason for selling, seller reputation, etc.)"
                // onChange={(e) =>
                //   updateFormParams({ ...formParams, location: e.target.value })
                // }
                // value={formParams.location}
              ></input>
            </div>
            <div className="mb-4">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="resalePrice1"
                type="text"
                placeholder="Resale Price"
                // onChange={(e) =>
                //   updateFormParams({
                //     ...formParams,
                //     tokenSymbol: e.target.value,
                //   })
                // }
                // value={formParams.tokenSymbol}
              ></input>
            </div>
            <div className="mb-4">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="resalePrice2"
                type="text"
                placeholder="Confirm resale price"
                // onChange={(e) => {
                //   updateFormParams({
                //     ...formParams,
                //     tier: Math.min(10, Math.max(e.target.value, 1)),
                //   })
                // }}
                // value={formParams.tier}
              ></input>
            </div>

            <br></br>
            <div className="text-green text-center">{message}</div>
            <button
              //   onClick={(e) => createCollection(e)}
              className="font-bold mt-10 w-full bg-purple-500 text-white rounded p-2 shadow-lg"
            >
              Sell
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
