"use client"
import React from 'react'
import { motion } from 'framer-motion'


const page = () => {
  return (
    <div id='page' className='bg-gradient-to-r from-gray-800 via-blue-700 to-gray-900 flex flex-col flex-1'>
      <div className="flex-1 flex-col flex items-center justify-center text-white ">
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          transition={{ duration: 3, ease: "linear" }}
          className=" text-center "
        >
          <h1 className='text-3xl' style={{ fontFamily: "Imprint MT Shadow" }}>ILINKS</h1>
          <div className="py-4"></div>
          <h1 className='text-3xl'>Created & Developed by Indranil Paul</h1>
          <h1 className='text-3xl'>Designed by Ananya Roy</h1>
          <div className="py-4"></div>
          <p className=''>Made with NEXT JS </p>
          <p className=''>Using MongoDB as Database </p>
        </motion.div>
      </div>
    </div>
  )
}

export default page
