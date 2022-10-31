import Navbar from './Navbar'
import { useState } from 'react'
import { uploadFileToIPFS, uploadJSONToIPFS } from '../pinata'
import Marketplace from '../Marketplace.json'
import { useLocation } from 'react-router'

export default function ArtistListingPage() {
  const [formParams, updateFormParams] = useState({
    name: '',
    location: '',
    time: '',
    tokenSymbol: '',
    tier: 1,
    tierData: [
      { maxTicketPerTier: 100, priceTicketPerTier: 10000, imageURLPerTier: '' },
      { maxTicketPerTier: 100, priceTicketPerTier: 10000, imageURLPerTier: '' },
      { maxTicketPerTier: 100, priceTicketPerTier: 10000, imageURLPerTier: '' },
      { maxTicketPerTier: 100, priceTicketPerTier: 10000, imageURLPerTier: '' },
      { maxTicketPerTier: 100, priceTicketPerTier: 10000, imageURLPerTier: '' },
      { maxTicketPerTier: 100, priceTicketPerTier: 10000, imageURLPerTier: '' },
      { maxTicketPerTier: 100, priceTicketPerTier: 10000, imageURLPerTier: '' },
      { maxTicketPerTier: 100, priceTicketPerTier: 10000, imageURLPerTier: '' },
      { maxTicketPerTier: 100, priceTicketPerTier: 10000, imageURLPerTier: '' },
      { maxTicketPerTier: 100, priceTicketPerTier: 10000, imageURLPerTier: '' },
    ],
    description: '',
    price: '',
  })
  const [fileURL, setFileURL] = useState(null)
  const ethers = require('ethers')
  const [message, updateMessage] = useState('')
  const location = useLocation()

  async function OnChangeFile(e, index) {
    var file = e.target.files[0]
    //check for file extension
    // TODO: Upload file to IPFS
    try {
      //upload the file to IPFS
      const response = await uploadFileToIPFS(file)
      if (response.success === true) {
        console.log(
          'Uploaded image to Pinata: ',
          response.pinataURL,
          'imageURLPerTier',
        )
        if (index == null) {
          setFileURL(response.pinataURL)
        } else {
          onUpdateTierData(response.pinataURL, index)
        }
      }
    } catch (e) {
      console.log('Error during file upload', e)
    }
  }

  const onUpdateTierData = (value, index, type) => {
    const data = formParams.tierData
    let newData = null
    if (type === 'maxTicketPerTier') {
      newData = { ...data[index], maxTicketPerTier: value }
    } else if (type === 'priceTicketPerTier') {
      newData = { ...data[index], priceTicketPerTier: value }
    } else if (type === 'imageURLPerTier') {
      newData = { ...data[index], imageURLPerTier: value }
    }

    console.log({
      ...formParams,
      tierData: [
        ...formParams.tierData.slice(0, index),
        newData,
        ...formParams.tierData.slice(index + 1),
      ],
    })
    updateFormParams({
      ...formParams,
      tierData: [
        ...formParams.tierData.slice(0, index),
        newData,
        ...formParams.tierData.slice(index + 1, formParams.tierData.length),
      ],
    })
  }

  return (
    <div className="">
      <Navbar></Navbar>
      <div className="grid grid-cols-2 bg-white shadow-md rounded mb-4 mx-10 place-items-stretch">
        <div className="flex flex-col justify-center">
          <div>
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="image"
            >
              Upload Image
            </label>
            <input
              type={'file'}
              onChange={(e) => {
                OnChangeFile(e, null)
              }}
            ></input>
          </div>
        </div>
        <div className="flex flex-col justify-center my-10" id="nftForm">
          <form>
            <h3 className="text-center font-bold text-purple-500 mb-8">
              Upload your NFT to the marketplace
            </h3>
            <div className="mb-4">
              <label
                className="block text-purple-500 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Event Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Axie#4563"
                onChange={(e) =>
                  updateFormParams({ ...formParams, name: e.target.value })
                }
                value={formParams.name}
              ></input>
            </div>
            <div className="mb-4">
              <label
                className="block text-purple-500 text-sm font-bold mb-2"
                htmlFor="location"
              >
                Location
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="location"
                type="text"
                placeholder="UC Berkeley"
                onChange={(e) =>
                  updateFormParams({ ...formParams, location: e.target.value })
                }
                value={formParams.location}
              ></input>
            </div>
            <div className="mb-4">
              <label
                className="block text-purple-500 text-sm font-bold mb-2"
                htmlFor="time"
              >
                Time
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="time"
                type="datetime-local"
                placeholder="UC Berkeley"
                onChange={(e) =>
                  updateFormParams({ ...formParams, time: e.target.value })
                }
                value={formParams.time}
              ></input>
            </div>
            <div className="mb-4">
              <label
                className="block text-purple-500 text-sm font-bold mb-2"
                htmlFor="tokenSymbol"
              >
                Token Symbol
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="time"
                type="text"
                placeholder="UCB"
                onChange={(e) =>
                  updateFormParams({
                    ...formParams,
                    tokenSymbol: e.target.value,
                  })
                }
                value={formParams.tokenSymbol}
              ></input>
            </div>
            <div className="mb-4">
              <label
                className="block text-purple-500 text-sm font-bold mb-2"
                htmlFor="tier"
              >
                Tier
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="tier"
                type="number"
                placeholder="1"
                onChange={(e) => {
                  updateFormParams({
                    ...formParams,
                    tier: Math.min(10, Math.max(e.target.value, 1)),
                  })
                }}
                value={formParams.tier}
              ></input>
            </div>
            <div className="overflow-y-scroll max-h-60">
              {formParams.tierData
                .filter((element, index) => index < formParams.tier)
                .map((item, index) => (
                  <div className="flex flex-row space-x-3">
                    <div className="mb-4 flex-1">
                      <label
                        className="block text-purple-500 text-sm font-bold mb-2"
                        htmlFor="maxTicketPerTier"
                      >
                        maxTicketPerTier {index + 1}
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="maxTicketPerTier"
                        type="number"
                        placeholder="1"
                        onChange={(e) =>
                          onUpdateTierData(
                            e.target.value,
                            index,
                            'maxTicketPerTier',
                          )
                        }
                        value={item.maxTicketPerTier}
                      ></input>
                    </div>
                    <div className="mb-4 flex-1">
                      <label
                        className="block text-purple-500 text-sm font-bold mb-2"
                        htmlFor="priceTicketPerTier"
                      >
                        price Per Tier {index + 1} Ticket
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="priceTicketPerTier"
                        type="number"
                        placeholder="1"
                        onChange={(e) =>
                          onUpdateTierData(
                            e.target.value,
                            index,
                            'priceTicketPerTier',
                          )
                        }
                        value={item.priceTicketPerTier}
                      ></input>
                    </div>
                    <div className="mb-4 flex-1">
                      <label
                        className="block text-purple-500 text-sm font-bold mb-2"
                        htmlFor="imageURLPerTier"
                      >
                        Upload Tier {index + 1} Image
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="imageURLPerTier"
                        type="file"
                        onChange={(e) => OnChangeFile(e, index)}
                      ></input>
                    </div>
                  </div>
                ))}
            </div>

            <br></br>
            <div className="text-green text-center">{message}</div>
            <button
              onClick={''}
              className="font-bold mt-10 w-full bg-purple-500 text-white rounded p-2 shadow-lg"
            >
              List NFT
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
