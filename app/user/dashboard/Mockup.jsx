/** @format */

"use client";
import { useEffect, useState } from "react";
import MockModal from "./MockModal/MockModal";
import Button from "@components/UI/Button/Button";
import Image from "next/image";

const merchantProductList = [
  { id: 1, title: "Product1", img:"/assets/images/airpod.jpg", price: "10 ETB" },
  { id: 2, title: "Product2",img:"/assets/images/earphone.jpg", price: "100 ETB" },
  { id: 3, title: "Product3",img:"/assets/images/earphone.jpg", price: "50 ETB" },
  { id: 4, title: "Product4", img:"/assets/images/airpod.jpg",price: "1000 ETB" },
  { id: 5, title: "Product5",img:"/assets/images/airpod.jpg", price: "200 ETB" },
  { id: 6, title: "Product6",img:"/assets/images/earphone.jpg", price: "75 ETB" }
]

const superApppIconLists = [
  { id: 1, title: "H5 App 1", img:"/assets/images/telegebya.jpg", price: "10 ETB" },
  { id: 2, title: "H5 App 2", img:"/assets/images/telegebya.jpg", price: "100 ETB" },
  { id: 3, title: "H5 App 3", img:"/assets/images/telegebya.jpg", price: "50 ETB" },
  { id: 4, title: "H5 App 4", img:"/assets/images/telegebya.jpg",price: "1000 ETB" },
  { id: 5, title: "H5 App 5", img:"/assets/images/telegebya.jpg", price: "200 ETB" },
  { id: 6, title: "H5 App 6", img: "/assets/images/telegebya.jpg", price: "75 ETB" },
  { id: 7, title: "H5 App 7", img:"/assets/images/banner.jpg", price: "10 ETB" },
  { id: 8, title: "H5 App 8", img:"/assets/images/telegebya.jpg", price: "100 ETB" },
  { id: 9, title: "H5 App 9", img: "/assets/images/telegebya.jpg", price: "50 ETB" },
  { id: 10,title: "H5 App 10", img: "/assets/images/telegebya.jpg", price: "75 ETB" },
]


const Mockup = ({id}) => {
  const [viewModal, setViewModal] = useState(false);
  const [currPage, setCurrPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(() => {
    if (id === "2" || id === "3") handleModalOpen()
  }, [])

  const handleModalOpen = () => {
    setViewModal(true)
	}	

  const handleModalClose = () => {
      setViewModal(false)
  }

  const handleFinalAction = () => {
    setViewModal(false)
    setCurrPage(1)
  }

  const handleNext = () => {
     const currentPage = document.getElementById(Number(currPage))
     const nextPage = document.getElementById(Number(currPage) + 1)
    
     currentPage.classList.remove('current')
     nextPage.classList.add('current')
     
     setCurrPage(Number(currPage) + 1)
  }
  
  const handlePrev= () => {
     const currentPage = document.getElementById(Number(currPage))
     const prevPage = document.getElementById(Number(currPage) - 1)
    
     currentPage.classList.remove('current')
     prevPage.classList.add('current')
     
     setCurrPage(Number(currPage) - 1)
    }
	
  let mockData1 =  <section className="main-mock font-bold flex flex-col justify-center items-center gap-y-5"> 
    <div className="page-1 current" id="1">
        <span className="w-80 h-10 fixed bg-lime-500 z-10 top-10 left-3 rounded-t-lg text-center py-2">Apps</span>

        <div className="w-80 h-10 fixed -z-40 top-10 left-1/2 text-center text-white py-2 font-semibold text-2xl">
           Your app Goes Here <span className="text-sm font-semibold italic">Click There!</span>
        </div>

        <ul className="grid gap-4 grid-cols-3 grid-rows-3 ">
          {superApppIconLists.map((list) => (
            <li onClick={handleNext} className={`w-20 h-20 rounded-lg flex flex-col items-center text-sm cursor-pointer border-2 border-gray-100 font-normal ${list.id === 6 ? 'animate-bounce opacity-100':'' } ${list.id === 7 ? 'w-full col-span-3':'col-span-1' }`}>
              <div>
                <Image
                  src={list.img}
                  alt="pp"
                  width={list.id === 7 ? 270 : 70}
                  height={list.id === 7 ? 170 : 70}
                  className="object-contain"/>
              </div>
              <div className="flex flex-col gap-y-3">
                {list.id === 7 ? '':<h3 className="text-gray-800">{list.title}</h3> }       
              </div>  
            </li>
          ))}       
        </ul>
        <div className="w-80 h-12 fixed bg-lime-500 z-10 bottom-10 left-3 rounded-b-3xl text-center py-2 flex flex-row justify-between text-white font-normal pl-2">
          <span className="opacity-70">Home</span>
          <span className="opacity-70">Payment</span>
          <span className="opacity-100">Apps</span>
          <span className="opacity-70">Account</span>
        </div>
        {/* <button onClick={handleNext} className="w-full bg-blue-500 text-white rounded-md shadow-sm h-10 mt-6">Pay With telebirr</button> */}
      </div>
      
      <div className="page-2" id="2">
        <p>Your Product</p>
        <br />
        <ul className="grid gap-4 grid-cols-2 grid-rows-3">
          {merchantProductList.map((list) => (
            <li className="w-32 h-24 shadow-md rounded-sm border-2 border-gray-200 flex flex-row items-center text-sm cursor-pointer">
              <div>
                <Image
                  src={list.img}
                  alt="pp"
                  width={60}
                  height={60}
                  className="object-contain"/>
              </div>
              <div className="flex flex-col gap-y-3">
                <h3 className="text-blue-400">{list.title}</h3>  
                <p>{list.price}</p>  
              </div>  
            </li>
          ))}
          
        </ul>
        <button onClick={handleNext} className="w-full bg-blue-500 text-white rounded-md shadow-sm h-10 mt-6">Pay With telebirr</button>
      </div>

      <div className="page-3" id="3">
        <div className="w-80 h-20 fixed bg-black opacity-50 z-10 top-10 left-3"></div>
        <div className="w-80 h-3/4 rounded-lg shadow-lg flex flex-col justify-start items-center bg-gray-100 z-20 absolute top-28 left-3 border-2 border-gray-200 gap-y-4 pt-7 rounded-b-3xl">
          <span onClick={handlePrev} className="fixed top-32 left-8 text-lg cursor-pointer">x</span>
          <p className="text-sm font-bold font-satoshi">Pay for merchant</p>
          <p className="text-4xl font-semibold">81.00<span className="text-sm">ETB</span> </p>

          <div className="bg-white w-72 h-auto rounded-md flex flex-row justify-between text-sm p-2 gap-y-2 font-inter font-normal">
            <div>
              <p>Orginal Amount</p>
              <p>Service Fee</p>
            </div>
             <div className="font-semibold">
              <p>80.00 ETB</p>
              <p>1.00 ETB</p>
            </div>
          </div>

          <div className="bg-white w-72 h-auto rounded-md font-normal p-2 text-sm">
            <p className="text-xs text-gray-600 mb-2">Payment Method</p>
            <div className="flex flex-row items-centers">
              <Image
                src="/assets/images/wallet.svg"
                width={20}
                height={20}
                alt="wallet"
              />
              <div>
                <p>Balance</p>
                <p className="text-xs text-gray-600">Available Balance: <span className="font-bold">908.00 ET</span> </p>
              </div>
              <Image />
            </div>
          </div>

          <button onClick={handleNext} className="w-3/4 bg-lime-500 text-white rounded-md shadow-sm h-10 mt-4 font-normal">Send</button>
        </div> 
      </div>

      <div className="page-4" id="4">
        <div className="w-80 h-full fixed bg-black opacity-50 z-10 top-10 left-3">
        </div>
        <div className="w-64 h-64 rounded-lg shadow-lg flex flex-col justify-start items-center bg-white z-20 absolute top-28 left-10 border-2 border-gray-200 gap-y-4 pt-7 rounded-b-md">
          <span onClick={handlePrev} className="fixed top-32 left-12 text-lg cursor-pointer ">x</span>
          <p className="text-sm font-bold font-satoshi">Enter Pin</p>
          <p className="text-4xl font-semibold">81.00<span className="text-sm">ETB</span> </p>

          <div className="px-7 w-72 h-auto rounded-md flex flex-row justify-between text-sm p-2 font-inter font-normal">
           <span className="w-8 h-8 rounded-sm bg-gray-200 text-5xl font-bold flex flex-row justify-center items-center text-center pb-6">.</span>
           <span className="w-8 h-8 rounded-sm bg-gray-200 text-5xl font-bold flex flex-row justify-center items-center text-center pb-6">.</span>
           <span className="w-8 h-8 rounded-sm bg-gray-200 text-5xl font-bold flex flex-row justify-center items-center text-center pb-6">.</span>
           <span className="w-8 h-8 rounded-sm bg-gray-200 text-5xl font-bold flex flex-row justify-center items-center text-center pb-6">.</span>
           <span className="w-8 h-8 rounded-sm bg-gray-200 text-5xl font-bold flex flex-row justify-center items-center text-center pb-6">.</span>
           <span className="w-8 h-8 rounded-sm bg-gray-200 text-5xl font-bold flex flex-row justify-center items-center text-center pb-6">.</span>
          </div>
          <button onClick={handleNext} className="w-3/4 bg-lime-500 text-white rounded-md shadow-sm h-10 mt-4 font-normal">OK</button>
        </div> 
      </div>

      <div className="page-5" id="5">
        {/* <div className="w-80 h-20 fixed bg-black opacity-50 z-10 top-10 left-3"></div> */}
        <div className="w-80 h-5/6 flex flex-col justify-start items-center bg-gray-100 z-20 absolute top-10 left-3 gap-y-4 pt-7 rounded-xl">
          {/* <span className="fixed top-32 left-8 text-lg">x</span> */}
          
          <Image
            src="/assets/images/success.png"
            width={70}
            height={70}
            alt="bg"
          />
          <p className="text-sm text-lime-500 font-normal font-satoshi">Successful</p>
          <p className="text-4xl font-semibold">-81.00<span className="text-sm">(ETB)</span> </p>

          <hr className="text-white" />
          <div className="w-72 h-auto flex flex-row justify-between text-sm p-2 gap-y-3">
            <div className="font-normal">
              <p>Transaction Time</p>
              <p>Transaction Type</p>
              <p>Transaction To</p>
              <p>Transaction Number</p>
              <p>Customer Mobile Number</p>
              <p>Customer Name</p>
            </div>
             <div className="font-semibold">
              <p>2023/23/09 02:42</p>
              <p>Buy Goods</p>
              <p>Public service Employee</p>
              <p>AC646746bbfhf</p>
              <p>09123324854</p>
              <p>Abebe</p>
            </div>
          </div>

          <button onClick={handleFinalAction } className="w-1/2 bg-lime-500 text-white rounded-md shadow-sm h-10 mt-4 font-normal">OK</button>
        </div> 
       
      
      </div>
    </section>;
    if (isLoading) {
      mockData1 = <span className="loading loading-spinner text-primary"></span>;
  }
  
  const mockData2 = (
  <section className="main-mock font-bold flex flex-col justify-center items-center gap-y-5"> 
    <div className="page-1 current" id="1">
      <div className="w-80 h-20 fixed bg-black opacity-50 z-10 top-10 left-3"></div>
      <div className="w-80 h-3/4 rounded-lg shadow-lg flex flex-col justify-start items-center bg-gray-100 z-20 absolute top-28 left-3 border-2 border-gray-200 gap-y-4 pt-7 rounded-b-3xl">
        <span onClick={handlePrev} className="fixed top-32 left-8 text-lg cursor-pointer">x</span>
        <p className="text-sm font-bold font-satoshi">Pay for merchant</p>
        <p className="text-4xl font-semibold">81.00<span className="text-sm">ETB</span> </p>

        <div className="bg-white w-72 h-auto rounded-md flex flex-row justify-between text-sm p-2 gap-y-2 font-inter font-normal">
          <div>
            <p>Orginal Amount</p>
            <p>Service Fee</p>
          </div>
            <div className="font-semibold">
            <p>80.00 ETB</p>
            <p>1.00 ETB</p>
          </div>
        </div>

        <div className="bg-white w-72 h-auto rounded-md font-normal p-2 text-sm">
          <p className="text-xs text-gray-600 mb-2">Payment Method</p>
          <div className="flex flex-row items-centers">
            <Image
              src="/assets/images/wallet.svg"
              width={20}
              height={20}
              alt="wallet"
            />
            <div>
              <p>Balance</p>
              <p className="text-xs text-gray-600">Available Balance: <span className="font-bold">908.00 ET</span> </p>
            </div>
            <Image />
          </div>
        </div>

        <button onClick={handleNext} className="w-3/4 bg-lime-500 text-white rounded-md shadow-sm h-10 mt-4 font-normal">Send</button>
      </div> 
    </div>

    <div className="page-2" id="2">
      <div className="w-80 h-full fixed bg-black opacity-50 z-10 top-10 left-3">
      </div>
      <div className="w-64 h-64 rounded-lg shadow-lg flex flex-col justify-start items-center bg-white z-20 absolute top-28 left-10 border-2 border-gray-200 gap-y-4 pt-7 rounded-b-md">
        <span onClick={handlePrev} className="fixed top-32 left-12 text-lg cursor-pointer ">x</span>
        <p className="text-sm font-bold font-satoshi">Enter Pin</p>
        <p className="text-4xl font-semibold">81.00<span className="text-sm">ETB</span> </p>

        <div className="px-7 w-72 h-auto rounded-md flex flex-row justify-between text-sm p-2 font-inter font-normal">
          <span className="w-8 h-8 rounded-sm bg-gray-200 text-5xl font-bold flex flex-row justify-center items-center text-center pb-6">.</span>
          <span className="w-8 h-8 rounded-sm bg-gray-200 text-5xl font-bold flex flex-row justify-center items-center text-center pb-6">.</span>
          <span className="w-8 h-8 rounded-sm bg-gray-200 text-5xl font-bold flex flex-row justify-center items-center text-center pb-6">.</span>
          <span className="w-8 h-8 rounded-sm bg-gray-200 text-5xl font-bold flex flex-row justify-center items-center text-center pb-6">.</span>
          <span className="w-8 h-8 rounded-sm bg-gray-200 text-5xl font-bold flex flex-row justify-center items-center text-center pb-6">.</span>
          <span className="w-8 h-8 rounded-sm bg-gray-200 text-5xl font-bold flex flex-row justify-center items-center text-center pb-6">.</span>
        </div>
        <button onClick={handleNext} className="w-3/4 bg-lime-500 text-white rounded-md shadow-sm h-10 mt-4 font-normal">OK</button>
      </div> 
    </div>

    <div className="page-3" id="3">
      {/* <div className="w-80 h-20 fixed bg-black opacity-50 z-10 top-10 left-3"></div> */}
      <div className="w-80 h-5/6 flex flex-col justify-start items-center bg-gray-100 z-20 absolute top-10 left-3 gap-y-4 pt-7 rounded-xl">
        {/* <span className="fixed top-32 left-8 text-lg">x</span> */}
        
        <Image
          src="/assets/images/success.png"
          width={70}
          height={70}
          alt="bg"
        />
        <p className="text-sm text-lime-500 font-normal font-satoshi">Successful</p>
        <p className="text-4xl font-semibold">-81.00<span className="text-sm">(ETB)</span> </p>

        <hr className="text-white" />
        <div className="w-72 h-auto flex flex-row justify-between text-sm p-2 gap-y-3">
          <div className="font-normal">
            <p>Transaction Time</p>
            <p>Transaction Type</p>
            <p>Transaction To</p>
            <p>Transaction Number</p>
            <p>Customer Mobile Number</p>
            <p>Customer Name</p>
          </div>
            <div className="font-semibold">
            <p>2023/23/09 02:42</p>
            <p>Buy Goods</p>
            <p>Public service Employee</p>
            <p>AC646746bbfhf</p>
            <p>09123324854</p>
            <p>Abebe</p>
          </div>
        </div>

        <button onClick={handleFinalAction } className="w-1/2 bg-lime-500 text-white rounded-md shadow-sm h-10 mt-4 font-normal">OK</button>
      </div> 
      
    
    </div>
  </section>
  )

  const mockData3 = (
    <section className="main-mock font-bold flex flex-col justify-center items-center gap-y-5"> 
      <div className="page-1 current relative" id="1">
        <div className="w-80 h-10 fixed -z-40 top-10 left-1/2 text-center text-white py-2 font-semibold text-2xl">
           Your app Goes Here <span className="text-sm font-semibold italic">Click There!</span>
        </div>

        <p>Your Product</p>
        <br />
        <span className="bg-black rounded-lg w-full text-center opacity-80 absolute top-20 -left-0 text-white font-normal">
          The required parameter of the request is empty, or the parameter is incorrectly filled.
        </span>
        <ul className="grid gap-4 grid-cols-2 grid-rows-3">
          {merchantProductList.map((list) => (
            <li className="w-32 h-24 shadow-md rounded-sm border-2 border-gray-200 flex flex-row items-center text-sm cursor-pointer">
              <div>
                <Image
                  src={list.img}
                  alt="pp"
                  width={60}
                  height={60}
                  className="object-contain"/>
              </div>
              <div className="flex flex-col gap-y-3">
                <h3 className="text-blue-400">{list.title}</h3>  
                <p>{list.price}</p>  
              </div>  
            </li>
          ))}
          
        </ul>
        <button disabled onClick={handleNext} className="w-full bg-blue-500 text-white rounded-md shadow-sm h-10 mt-6">Pay With telebirr</button>
      </div>
    </section>
  )

  let mockData;
  if (id === "1") mockData = mockData1
  // if(id === "1") mockData = mockData1
  if(id === "2") mockData = mockData2
  if(id === "3") mockData = mockData3
  
  return (
    <>
    <div>
        <button onClick={handleModalOpen} className='text-lg font-semibold flex flex-row justify-center items-center'>
          Mockup
          <Image src="/assets/images/phone-icon.jpg" width={20} height={20} alt="image"/>
        </button>
    </div>
    
    <MockModal show={viewModal} closeModal={handleModalClose}>
        {mockData}
    </MockModal> 
    
    </>
  )
}

export default Mockup