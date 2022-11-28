import Navbar from './Navbar'
import { useParams } from 'react-router-dom'
import Factory from '../Factory.json'
import Market from '../Market.json'
import ConcertTickets from '../ConcertTickets.json'
import { useState } from 'react'
import NFTTile from './NFTTile'

export default function Profile() {
  const [data, updateData] = useState([])
  const [dataFetched, updateFetched] = useState(false)
  const [totalPrice, updateTotalPrice] = useState('0')
  const [currAddress, updateAddress] = useState('0x')
  const ethers = require('ethers')

  async function getNFTData(tokenId) {
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

    const userCollections = await asyncFilter(
      allCollections,
      async (address) => {
        let ticketCollection = new ethers.Contract(
          address,
          ConcertTickets.abi,
          signer,
        )
        let balance = await ticketCollection.balanceOf(addr)
        return balance > 0
      },
    )

    const market = new ethers.Contract(Market.address, Market.abi, signer)
    let dataObjects = []

    await Promise.all(
      userCollections.map(async (address) => {
        let ticketCollection = new ethers.Contract(
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
        let balance = await ticketCollection.balanceOf(addr)
        let numTier = await ticketCollection.numTier()
        for (let i = 0; i < balance; i++) {
          let id = (
            await ticketCollection.tokenOfOwnerByIndex(addr, i)
          ).toNumber()
          let image = await ticketCollection.tokenURI(id)
          let tier = -1
          let maxSupply = 0
          let isListed = await market.isListed(address, id)
          let price = 0
          if (isListed) {
            let royaltyInfo = await market.listing(address, id)
            price = royaltyInfo[0].toNumber() + royaltyInfo[1].toNumber()
          }
          for (let j = 0; j < numTier; j++) {
            maxSupply =
              maxSupply + (await ticketCollection.tierMaxSupply(j)).toNumber()
            if (maxSupply > id) {
              tier = j
              break
            }
          }
          dataObjects.push({
            name: name,
            symbol: symbol,
            tokenId: id,
            image: image,
            address: address,
            tier: tier,
            isListed: isListed,
            price: price,
            location: location,
            eventTime: eventTime,
          })
          //   console.log(name, symbol, id, image, tier, isListed, price)
        }
      }),
    )

    // console.log(dataObjects)

    updateData(dataObjects)
    updateFetched(true)
    updateAddress(addr)
    updateTotalPrice(sumPrice.toPrecision(3))
  }

  const params = useParams()
  const tokenId = params.tokenId
  if (!dataFetched) getNFTData(tokenId)

  return (
    <div className="profileClass" style={{ 'min-height': '100vh' }}>
      <Navbar></Navbar>
      <div className="profileClass">
        <div className="flex text-center flex-col mt-11 md:text-2xl text-white">
          <div className="mb-5">
            <h2 className="font-bold">Wallet Address</h2>
            {currAddress}
          </div>
        </div>
        <div className="flex flex-row text-center justify-center mt-10 md:text-2xl text-white">
          <div>
            <h2 className="font-bold">No. of NFTs</h2>
            {data.length}
          </div>
          <div className="ml-20">
            <h2 className="font-bold">Total Value</h2>
            {totalPrice} ETH
          </div>
        </div>
        <div className="flex flex-col text-center items-center mt-11 text-white">
          <h2 className="font-bold">Your NFTs</h2>
          <div className="flex justify-center flex-wrap max-w-screen-xl">
            {data.map((value, index) => {
              return <NFTTile data={value} key={index}></NFTTile>
            })}
          </div>
          <div className="mt-10 text-xl">
            {data.length == 0
              ? 'Oops, No NFT data to display (Are you logged in?)'
              : ''}
          </div>
        </div>
      </div>
    </div>
  )
}
