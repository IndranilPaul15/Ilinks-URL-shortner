"use client"
import React from 'react'
import Image from 'next/image';
import { motion } from 'framer-motion';



const Donut = () => {
  return (
    <div className="pt-[6rem] overflow-hidden size-48 ">
      <div
        className="size-48 rounded-full bg-[#9aa8f194]"
        style={{
          maskImage: "radial-gradient(circle, transparent 100%, black 0%)",
          WebkitMaskImage: "radial-gradient(circle, transparent 45%, black 0%)",
        }}
      ></div>
    </div>
  );
};

const Design2 = () => {
  return (
    <motion.div
      className="size-36 md:size-44 relative flex justify-center items-center"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
    >
      <Image className='' src='/round.png' width={500} height={500} alt="round" ></Image>
      <div className="absolute flex justify-center items-center size-[5.5rem] rounded-full bg-[#09356E]">
        <Image className='absolute mr-[38px]' src='/ellips.png' width={40} height={40} alt="e" ></Image>
        <div className=" rounded-full flex justify-center items-center size-10 bg-white">
          <div className=" rounded-full flex justify-center items-center size-3 bg-blue-700">
          </div>
        </div>
      </div>
    </motion.div>
  );
}


const Background = () => {
  return (
    <div className=" bg-gradient-to-br from-[#3236B4] to-[#56CDEEFC] absolute  w-full h-full z-[-1]">
      <div className=""></div>
      <div className=" relative size-full flex flex-col justify-between ">
        <div className=" flex relative flex-nowrap justify-between">
          <div className=" max-w-fit rotate-90">
            <Donut />
          </div>
          <div className=" max-w-fit fixed right-72 rotate-180">
            <Donut />
          </div>
          <div className=" pl-16 md:pl-20 size-36 md:size-44  overflow-hidden">
            <Design2 />
          </div>
        </div>
        <div className="relative max-h-fit">
          <div className="fixed size-44 -bottom-[80px] md:-bottom-[66px] -left-[66px] overflow-hidden">
            <Design2 />
          </div>
          <motion.div
            className="fixed bottom-0 -right-10"
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 0.7, ease: "linear" }}
          >
            <Image
              className="w-48 h-48 md:w-96 md:h-96"
              src="/ibot.png"
              width={360}
              height={360}
              alt="iBot"
            />

          </motion.div>
        </div>
      </div>

    </div>
  )
}

export default Background
