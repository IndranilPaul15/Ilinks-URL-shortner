"use client";
import Background from "@/components/Bg/Background";
import Link from "next/link";
import { motion } from "framer-motion";
import AuthManager from "@/components/auth/AuthManager";
import { useOpen } from "@/components/context/OpenContext";
import { useSession } from "next-auth/react";

export default function Page() {
  const { open, setOpenA, toggle } = useOpen();
  const { status } = useSession();

  return (
    <div id="page" className="relative flex flex-col flex-1  bg-gradient-to-r from-[#3236B4] to-[#56CDEEFC]">
      <div className="flex-1 flex-col  flex items-start z-10 justify-center text-white">
        <div><Background /></div>
        <div className="md:pl-48  size-full flex flex-col md:justify-center gap-2">
          <motion.div
            className="pl-5"
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 0.7, ease: "linear" }}
          >
            <div className="text-[50px] mt-20 md:mt-0 font-bold my-5 baloo ">Short Links, Big Results </div>
            <div className="md:mb-20 mb-10 baloo2 tracking-wider text-xl font-thin">
              <p className="">iLinks - URL Shortener built with powerful tools, to help</p>
              <p className="">and simplify your work links</p>
            </div>
          </motion.div>
          <motion.div
            className=" flex md:pl-5 w-fit flex-col mx-auto md:mx-0"
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 0.9, ease: "linear" }}
          >
            <Link className="mx-auto md:mx-0" href="/Shortener">
              <button
                className=" group active:scale-90 relative inline-flex items-center justify-center rounded-full overflow-hidden border-2 border-purple-500 p-4   px-20 md:px-32  py-3 text-2xl font-bold text-white shadow-2xl  transition duration-300 ease-out hover:border-4 hover:border-double">
                <span className="ease absolute inset-0 flex h-full w-full -translate-x-full items-center justify-center bg-purple-500 text-white duration-300 group-hover:translate-x-0">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </span>
                <span className="ease absolute flex h-full w-full transform items-center justify-center bg-[aliceblue] text-purple-500 transition-all duration-300 group-hover:translate-x-full">Get Started</span>
                <span className="invisible relative">Get Started</span>
              </button>
            </Link>
            {status === "unauthenticated" && (
              <div className="md:pl-7 mt-4" >
                <button onClick={() => setOpenA(true)} className="baloo mx-auto md:mx-0 text-2xl md:text-xl font-bold hover:font-extrabold flex flex-col md:flex-row gap-1 justify-center items-start active:scale-95" >
                  <span className="drop-shadow-[0_0_3px_black]">Create an account to enjoy</span>
                  <span className="drop-shadow-[0_0_5px_white] text-blue-900"> More Features</span>
                </button>
              </div>)}
            {open && (<div className="flex text-black fixed top-[20%] md:top-[10%] right-0 md:left-1/3 ">
              <div className="fixed inset-0 z-0 backdrop-blur-md bg-white/10">
              </div>
              <div className=" z-10">
                <AuthManager setOpenA={setOpenA} toggle={toggle} />
              </div>
            </div>)}
          </motion.div>
        </div>
      </div>
    </div >

  );
}
