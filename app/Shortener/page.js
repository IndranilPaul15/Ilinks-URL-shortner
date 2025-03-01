"use client";
import React from 'react'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Background from '@/components/Bg/Background';
import { motion } from 'framer-motion';
const Shortener = () => {
  const [link, setlink] = useState("")
  const [shortlink, setshortlink] = useState("")
  const [isdone, setisdone] = useState("")
  const isblank = (link === "" || shortlink === "") ? true : false
  const [load, setload] = useState(false)
  const [btn, setbtn] = useState("Shorten Link")
  const handleClick = () => {
    setload(true);
    setbtn("Loading...");
    setTimeout(() => {
      setload(false);
      setbtn("Shortened");
    }, 300);
  }
  const handleCopy = () => {
    navigator.clipboard.writeText(isdone)
  }
  const [emoji, setEmoji] = useState("👉🏻");

  useEffect(() => {
    const updateEmoji = () => {
      setEmoji(window.innerWidth <= 640 ? "👇🏻" : "👉🏻");
    };

    updateEmoji();
    window.addEventListener("resize", updateEmoji);

    return () => window.removeEventListener("resize", updateEmoji);
  }, []);
  const Shorten = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "link": link,
      "shortlink": shortlink
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("/api/Shortener", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setisdone(`${process.env.NEXT_PUBLIC_HOST}/${shortlink}`)
        setlink("")
        setshortlink("")
        // console.log(result)
        if (result.success) {
          toast.success(result.message, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        else {
          toast.error(result.message, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch((error) => console.error(error));
  }
  return (
    <div id='page' className='relative bg-gradient-to-r from-[#3236B4] to-[#56CDEEFC] flex flex-col flex-1'>
      <div className="flex-1 z-10 flex-col flex items-center justify-center">
        <Background />

        <motion.div
          initial={{ opacity: 0, scale:0.6, y: "50%" }}
          animate={{  opacity: 1,scale:1,  y: "0%" }}
          transition={{ duration: 0.7, ease: "linear" }}
          whileHover={{ y: -4, scale: 1.1 }}
          className="bg-gradient-to-bl from-purple-500 via-indigo-500 to-blue-500 w-[96%] md:w-2/3 xl:w-1/2 h-3/4 rounded-xl shadow-lg md:p-5 flex flex-col justify-between mb-10 transition delay-150 duration-300 ease-in-out ">
          <h1 className='text-4xl font-semibold text-[aliceblue] m-6 baloo'>Create Your <b className='bg-gradient-to-r from-blue-800 to-indigo-900 bg-clip-text text-transparent drop-shadow-[0_0_4px_white]'>ilinks</b> :</h1>
          <div className="flex flex-col gap-3 md:gap-0 items-center justify-center">
            <input type="text"
              value={link} required
              className="border pl-6 focus:outline-none focus:shadow focus:shadow-cyan-700 focus:border-blue-600 rounded-lg p-2 m-2 w-[95%] md:w-full"
              placeholder="Enter Your URL Here"
              onChange={e => { setlink(e.target.value); setbtn("Shorten Link") }} />
            <input type="text"
              value={shortlink} required
              className="border pl-6 focus:outline-none focus:shadow focus:shadow-cyan-700 focus:border-blue-600 rounded-lg p-2 m-2 w-[95%] md:w-full"
              placeholder="Enter Your Preffered name"
              onChange={e => { setshortlink(e.target.value) }} />

            <button disabled={isblank} onClick={() => { Shorten(); handleClick(); }} className="flex items-center gap-2 bg-blue-500 text-white mt-4 md:mb-8 px-4 py-2 rounded-xl shadow-lg transform active:scale-95 transition-all font-medium cursor-pointer">
              {load ? <Loader2 className="animate-spin" size={20} /> : btn}
            </button>
          </div>
          <div className="output mx-auto mb-16 bg-gradient-to-tl from-blue-500 via-cyan-500 to-teal-500 w-[95%] md:w-full flex flex-col md:flex-row items-center justify-between rounded-xl p-4 ">
            <p className='md:pl-4 text-xl text-blue-950 baloo font-semibold '>Here is your <b>ilink </b>{emoji}</p>
            <div className=" bg-slate-100 w-full md:w-2/3 rounded-xl px-3 py-1 flex justify-between items-center">
              <div className=' text-blue-700 flex gap-3 hover:underline hover:font-bold xl::ml-10' >
                <div className="link-icon ">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1d4ed8"><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q83 0 155.5 31.5t127 86q54.5 54.5 86 127T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Zm0-82q26-36 45-75t31-83H404q12 44 31 83t45 75Zm-104-16q-18-33-31.5-68.5T322-320H204q29 50 72.5 87t99.5 55Zm208 0q56-18 99.5-55t72.5-87H638q-9 38-22.5 73.5T584-178ZM170-400h136q-3-20-4.5-39.5T300-480q0-21 1.5-40.5T306-560H170q-5 20-7.5 39.5T160-480q0 21 2.5 40.5T170-400Zm216 0h188q3-20 4.5-39.5T580-480q0-21-1.5-40.5T574-560H386q-3 20-4.5 39.5T380-480q0 21 1.5 40.5T386-400Zm268 0h136q5-20 7.5-39.5T800-480q0-21-2.5-40.5T790-560H654q3 20 4.5 39.5T660-480q0 21-1.5 40.5T654-400Zm-16-240h118q-29-50-72.5-87T584-782q18 33 31.5 68.5T638-640Zm-234 0h152q-12-44-31-83t-45-75q-26 36-45 75t-31 83Zm-200 0h118q9-38 22.5-73.5T376-782q-56 18-99.5 55T204-640Z" /></svg>
                </div>
                {isdone && <Link className='xs:w-[201px] xl:w-64 overflow-hidden text-ellipsis' target='_blank' href={isdone}>{isdone}</Link>}
              </div>
              <button onClick={handleCopy}>
                <div className="copy-icon hover:bg-slate-200 rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" /></svg>
                </div>
              </button>
            </div>
          </div>
        </motion.div>


        {isdone &&
         <Link href="/insights"
          className="relative p-1.5 text-white text-xl bg-transparent border-none rounded-[24px] transition-all duration-300 ease-in-out before:content-[''] before:absolute before:inset-0 before:p-[8px] before:rounded-[24px] before:bg-[conic-gradient(#488cfb,#29dbbc,#ddf505,#ff9f0e,#e440bb,#655adc,#488cfb)] before:mask before:mask-image-[linear-gradient(#000,#000)] before:mask-origin-[content-box_padding-box] before:mask-clip-[content-box_padding-box] before:mask-composite-exclude before:webkit-mask-composite-destination-out before:animate-[hue_500ms_linear_infinite] transform active:scale-95">
          <span className="relative z-10 px-8 py-1 bg-gradient-to-bl from-cyan-700 via-blue-500 to-indigo-600  rounded-[24px]">Check Analytics Now</span>
        </Link>
        }
      </div>
    </div>
  )
}

export default Shortener
