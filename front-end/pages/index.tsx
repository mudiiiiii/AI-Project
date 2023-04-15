import axios from 'axios'
import { NextPage } from 'next'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

type Props = {}

interface ResponseState<T> {
  isLoading: boolean
  data: T | null
}

const Index: NextPage = (props: Props) => {

  const [date, setDate] = useState<string>()

  const [closingPrice, setClosingPrice] = useState<number>()

  const [regResponse, setRegResponse] = useState<ResponseState<{ predictions: number[] }>>({
    isLoading: false,
    data: null
  })

  const [clfResponse, setClfResponse] = useState<ResponseState<{ classifications: number[] }>>({
    isLoading: false,
    data: null
  })

  const baseURL = 'http://localhost:5000'

  const quartileMap = ['First', 'Second', 'Third', 'Fourth']

  const regPredict = async () => {
    if (!date) {
      return toast.error('Please provide a date')
    }
    // set loading state to false before send the request to server
    setRegResponse({
      ...regResponse,
      isLoading: true
    })
    try {
      const { data } = await axios.post(`${baseURL}/predict`, {
        data: [date]
      })
      // update loading state and store prediction result
      setRegResponse({
        data,
        isLoading: false
      })
    } catch (error) {
      console.log(error)
      // set loading state back to false if there is an error
      setRegResponse({
        data: null,
        isLoading: false
      })
    }
  }

  const clfPredict = async () => {
    if (!closingPrice) {
      return toast.error('Please provide a closing price')
    }

    if (closingPrice < 0) {
      return toast.error('Closing price can not be less than 0')
    }
    // set loading state to false before send the request to server
    setClfResponse({
      ...clfResponse,
      isLoading: true
    })
    try {
      const { data } = await axios.post(`${baseURL}/classify`, {
        data: [closingPrice]
      })
      // update loading state and store prediction result
      console.log(data)
      setClfResponse({
        data,
        isLoading: false
      })
    } catch (error) {
      console.log(error)
      // set loading state back to false if there is an error
      setClfResponse({
        data: null,
        isLoading: false
      })
    }
  }

  return (
    <div className='h-screen w-screen overflow-x-hidden bg-blue-200 font-sans'>
      <div className='mt-2 text-xl min-w-[600px] max-w-[960px] mx-auto p-2'>
        <h1 className='text-center text-3xl my-4'>COMP377 Project - Group2</h1>
        <div className='flex flex-col  my-5 space-y-4 w-[600px] px-10 bg-white rounded-xl py-10 mx-auto shadow-lg5'>
          <h4 className='text-start text-lg'><span className='font-bold'>Regression</span> - Predict based on the date</h4>
          <input type="date" className='w-full border border-gray-400 px-2 py-3 rounded-md' name="date" placeholder='Select a date to make the prediction' onChange={e => setDate(e.target.value)} />
          <button className='bg-[#38bdf8] cursor-pointer hover:bg-[#185bb2c4] w-full py-2 text-white font-bold text-xl rounded-md' onClick={regPredict}>Predict</button>
          {
            regResponse.isLoading && <div>Loading...</div>
          }
          {
            !regResponse.isLoading && regResponse.data && <div className='text-lg'><span className='font-semibold text-green-600 mr-24'>Prediction</span> {regResponse.data.predictions[0]}</div>
          }

          <div className='h-[1px] bg-gray-400' />
          <h4 className='text-start text-lg'><span className='font-bold'>Classification</span> - Predict the quartile based on the closing price</h4>
          <input type="number" className='w-full border border-gray-400 px-2 py-3 rounded-md' name="closingPrice" onChange={e => setClosingPrice(Number(e.target.value))} />
          <button className='bg-[#38bdf8] cursor-pointer hover:bg-[#185bb2c4] w-full py-2 text-white font-bold text-xl rounded-md' onClick={clfPredict}>Predict</button>
          {
            clfResponse.isLoading && <div>Loading...</div>
          }
          {
            !clfResponse.isLoading && clfResponse.data && <div className='text-lg'><span className='font-semibold text-green-600 mr-24'>Prediction</span> {quartileMap[clfResponse.data.classifications[0]]} quartile</div>
          }
        </div>
      </div>
    </div>
  )
}

export default Index