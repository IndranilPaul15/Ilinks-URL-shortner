"use client"
import React from 'react'
import Image from 'next/image'
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { FaLink, FaLinkSlash } from "react-icons/fa6";
import { toast } from 'react-toastify';
import Visitordevices from '@/components/ClickAnalytics/Visitordevices';
import ProtectedRoute from '@/components/ProtectedRoute';
import Loader from '@/components/Loader';
import VisitorGraph from '@/components/ClickAnalytics/VisitorGraph';
import Loader2 from '@/components/Loader2';
import { LuRefreshCw } from "react-icons/lu";

const Insights = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loader, setLoader] = useState(true);
  const [clickloading, setClickLoading] = useState(false);
  const [Pieopen, setPieopen] = useState(false)
  const [Graphopen, setGraphopen] = useState(false)
  const [selectedShortlink, setSelectedShortlink] = useState(null);
  const [selectedClicks, setSelectedClicks] = useState(null);
  const [selectedVisitors, setSelectedVisitors] = useState(null);
  const [edit, setEdit] = useState(false)
  const [link, setlink] = useState('')
  const [shortlink, setshortlink] = useState('')
  const [editId, setEditId] = useState(null)


  useEffect(() => {
    const timer = setTimeout(() => {
      setLoader(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);



  async function fetchLinks() {
    setLoading(true)
    try {
      const response = await fetch("/api/setup");
      if (!response.ok) throw new Error("Failed to fetch links");

      const data = await response.json();
      setLinks(data.links || []);
    } catch (error) {
      console.error("Error fetching links:", error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {

    fetchLinks();
  }, []);

  const togglePie = () => {
    if (!Pieopen) {
      setPieopen(true)
    } else {
      setPieopen(false)
    }

  }


  const getDomain = (link) => {
    // console.log(link);

    try {
      return new URL(link).hostname.replace(/^www\./, "");
    } catch (error) {
      return "Invalid Link";
    }
  };

  const handleEdit = async (id, currentLink, currentShortlink) => {
    console.log(`Editing link with ID: ${id}`);
    const confirmEdit = confirm("Are you sure you want to edit this link?");
    if (!confirmEdit) return;

    setlink(currentLink); // Set previous URL
    setshortlink(currentShortlink); // Set previous shortlink
    setEditId(id);
    setEdit(true);
  }
  const handleUpdate = async () => {
    if (!shortlink || !link) {
      alert("Editing canceled: Both fields are required.");
      setEdit(false);
      return;
    }

    const updatedData = {
      shortlink: shortlink,
      link: link,
      date: new Date()
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/setup/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update the link. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Link updated successfully!", data);

      setLinks((prevLinks) =>
        prevLinks.map((link) =>
          String(link.id) === String(editId) ? { ...link, ...updatedData } : link
        )
      );

      toast.success("Link updated successfully! ✅");
    } catch (error) {
      console.error("Error updating link:", error);
      toast.error("Failed to update the link ❌");
    } finally {
      setEdit(false)
    }
  };


  const handleDel = async (id, shortlink) => {
    const ilink = `${process.env.NEXT_PUBLIC_HOST}/${shortlink}`
    if (!confirm(`Are you sure you want to delete ${ilink} ? 🚨`)) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/setup/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to delete link");
      }

      toast.success(`${ilink} deleted successfully`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLinks(prevLinks => prevLinks.filter(link => link.id !== id));
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  const handleActive = async (id, currentStatus) => {
    console.log(`Toggling active status for ID: ${id}, Current status: ${currentStatus}`);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/setup/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentStatus })
      });

      const data = await response.json();
      console.log("Response from API:", data);

      if (!response.ok) {
        throw new Error(`Failed to update link status: ${data.message}`);
      }

      console.log("Link status updated successfully!");
      setLinks(prevLinks =>
        prevLinks.map(link =>
          link.id === id ? { ...link, active: !currentStatus } : link
        )
      );

    } catch (error) {
      console.error("Error updating link status:", error.message);
    }
  };

  const handlerefresh = (e) => {
    const icon = e.currentTarget.querySelector(".refresh-icon")
    icon.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }], {
      duration: 500,
      easing: "linear",
    })
    fetchLinks()
  }


  const handlePie = (clicks, shortlink, visitors) => {
    setSelectedClicks(clicks);
    setSelectedShortlink(shortlink);
    setSelectedVisitors(visitors)
    if (!Pieopen) {
      setPieopen(true);
    }

  };

  if (loader) {
    return (
      <div id='page' className='w-[100vw] bg-gradient-to-r from-cyan-500 to-blue-500 flex flex-col flex-1'>
        <div className="flex-1 flex-col flex items-center justify-center text-white w-full">
          <Loader />
        </div>
      </div>
    )

  }

  return (
    <ProtectedRoute>
      <div id='page' className='w-[100vw] bg-gradient-to-r from-cyan-500 to-blue-500 flex flex-col flex-1'>
        <div className="flex-1 flex-col flex items-center justify-center text-white w-full">
          <div className="">
            <h1 className='text-5xl font-semibold text-center baloo'>Analytics of Your <b>ilinks</b></h1>

            <h1 className="text-xl text-center py-3 underline underline-offset-8 font-medium">
              Last Visited On:{" "}
              {(() => {
                if (!selectedVisitors || selectedVisitors.length === 0) {
                  return "No visits yet";
                }
                const visitDates = selectedVisitors.map(visitor => {
                  return visitor.date ? new Date(visitor.date) : null;
                }).filter(date => date && !isNaN(date.getTime()));

                if (visitDates.length === 0) {
                  return "No visits yet";
                }
                const latestVisit = new Date(Math.max(...visitDates.map(date => date.getTime())));
                const options = { day: "numeric", month: "short", year: "numeric" };
                const formattedDate = latestVisit.toLocaleDateString("en-GB", options);
                const formattedTime = latestVisit.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                });
                return `${formattedDate} at ${formattedTime.toLowerCase()}`;
              })()}
            </h1>
            <div className="Ilinks-insights flex flex-col  items-center justify-center  ">
              <div className="flex w-full flex-col lg:flex-row items-center justify-center">
                <div className="order-1 md:order-2">
                  <div className="container mx-auto md:px-4 ">
                    <div className="py-4">
                      <div className=" py-4 mx-auto flex flex-col gap-3 ">


                        <AnimatePresence>
                          {edit &&
                            (<motion.div
                              initial={{ opacity: 0, y: 50 }} 
                              animate={{ opacity: 1, y: 0 }} 
                              exit={{ opacity: 0, y: 50 }} 
                              transition={{ duration: 0.4, ease: "easeInOut" }}
                              className="edit text-blue-950 rounded-xl flex justify-between items-center gap-3 flex-col md:flex-row ">

                              <input type="text"
                                value={link} required
                                className="border pl-6 focus:outline-none focus:shadow focus:shadow-cyan-700 focus:border-blue-600 rounded-lg p-2  w-[95%] md:w-full"
                                placeholder="Enter Your URL Here"
                                onChange={(e) => { setlink(e.target.value) }}
                              />
                              <input type="text"
                                value={shortlink} required
                                className="border pl-6 focus:outline-none focus:shadow focus:shadow-cyan-700 focus:border-blue-600 rounded-lg p-2  w-[95%] md:w-full"
                                placeholder="Enter Your Preffered name"
                                onChange={(e) => { setshortlink(e.target.value) }}
                              />

                              <button onClick={handleUpdate}
                                className="box-border active:scale-95 relative z-30 inline-flex items-center justify-center w-auto px-20 md:px-8 py-3 md:py-2.5  overflow-hidden font-bold text-white transition-all duration-300 bg-indigo-600 rounded-md cursor-pointer group active:ring-offset-2 ring-1 ring-indigo-300 active:ring-offset-indigo-200 hover:ring-offset-indigo-500 ease focus:outline-none">
                                <span className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                                <span className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                                <span className="relative z-20 flex items-center text-sm">
                                  <svg className="relative w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                  Update
                                </span>
                              </button>

                            </motion.div>)}
                        </AnimatePresence>


                        <div className="overflow-x-auto max-w-[95vw] md:w-[75vw] overflow-y-auto max-h-96  rounded-lg overflow-hidden shadow-2xl">
                          <table className=" mx-auto w-full  ">
                            <thead className=" text-white  text-center">
                              <tr className=''>
                                <th className='sticky bg-[#43a77d] z-10 top-0 px-3  py-4 text-start'>
                                  <div className=" flex items-center gap-4 w-fit">
                                    <button onClick={handlerefresh}>
                                      <motion.div className="refresh-icon">
                                        <LuRefreshCw size={20} />
                                      </motion.div>
                                    </button>
                                    <span>iLink</span>
                                  </div>
                                </th>
                                <th className='sticky bg-[#43a77d] z-10 top-0 px-3 py-4 text-start'>Original Link</th>
                                <th className='sticky bg-[#43a77d] z-10 top-0 px-3 py-4 '>Clicks</th>
                                <th className='sticky bg-[#43a77d] z-10 top-0 px-3 py-4 '>Status</th>
                                <th className='sticky bg-[#43a77d] z-10 top-0 px-3 py-4 '>Date</th>
                                <th className='sticky bg-[#43a77d] z-10 top-0 px-3 py-4 '>Action</th>
                              </tr>
                            </thead>

                            <tbody key={links.length} className='text-center bg-[rgba(0,0,0,0.5)]'>
                              {loading ?
                                (
                                  <tr>
                                    <td colSpan="100%">
                                      <div className=" flex justify-center items-center my-4">
                                        <Loader2 />
                                      </div>
                                    </td>
                                  </tr>
                                ) : links.length === 0 ? (
                                  <tr>
                                    <td colSpan="100%">
                                      <p className="text-gray-400 text-4xl font-medium text-center m-4 p-4">No links found.
                                      </p>
                                    </td>
                                  </tr>
                                ) : (

                                  links.map((link) => {
                                    const ilink = `${process.env.NEXT_PUBLIC_HOST}/${link.shortlink}`;
                                    return (
                                      <tr key={link._id} className='border-b '>
                                        <td className='px-3 pl-8 text-start '>
                                          <div className="flex items-center justify-between gap-3 ">

                                            <a
                                              className='text-ellipsis md:w-48 w-10 overflow-hidden'
                                              target='_blank'
                                              href={ilink}>
                                              {ilink}
                                            </a>
                                            <button onClick={() => { navigator.clipboard.writeText(ilink) }} className='bg-[#181E29] transform active:scale-90 rounded-full p-2 my-2 hover:bg-slate-700  text-white'>
                                              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF"><path d="M744-192H312q-29 0-50.5-21.5T240-264v-576q0-29 21.5-50.5T312-912h312l192 192v456q0 29-21.5 50.5T744-192ZM576-672v-168H312v576h432v-408H576ZM168-48q-29 0-50.5-21.5T96-120v-552h72v552h456v72H168Zm144-792v195-195 576-576Z" /></svg>
                                            </button>
                                          </div>
                                        </td>
                                        <td className='px-3 w-48 '>
                                          <div className=" flex items-center justify-between">
                                            <Image
                                              className='mr-2 rounded-full'
                                              src={`https://www.google.com/s2/favicons?sz=64&domain=${getDomain(link.link)}`}
                                              width={21}
                                              height={21}
                                              alt=''
                                            />
                                            <a target='_blank' className='text-start hover:underline text-ellipsis md:w-48 truncate max-w-[150px] overflow-hidden' href={link.link}>
                                              {link.link}
                                            </a>
                                          </div>
                                        </td>
                                        <td onClick={() => { setClickLoading(true); if (!Pieopen) togglePie(); handlePie(link.clicks, link.shortlink, link.visitors); setGraphopen(true) }} className='px-3 text-nowrap cursor-pointer hover:font-bold active:scale-95 '>{link.clicks || 0}</td>
                                        <td className='px-3   '>
                                          <div className="flex justify-center items-center">
                                            <span className={`${link.active ? "text-green-500" : "text-red-500"}`}>
                                              {link.active ? "Active" : "Inactive"}
                                            </span>
                                            <button onClick={() => handleActive(link.id, link.active)} className='active:scale-95' >
                                              <div className='bg-[rgba(25,138,65,0.5)] rounded-full p-1.5 ml-2'>
                                                {link.active ? <FaLink /> : <FaLinkSlash />}
                                              </div>
                                            </button>
                                          </div>
                                        </td>
                                        <td className="px-3 text-nowrap">
                                          {link.date
                                            ? (() => {
                                              const dateObj = new Date(link.date);
                                              if (isNaN(dateObj.getTime())) return "N/A";
                                              const day = dateObj.getDate();
                                              const ordinalSuffix = (day) => {
                                                if (day > 3 && day < 21) return "th"
                                                switch (day % 10) {
                                                  case 1:
                                                    return "st";
                                                  case 2:
                                                    return "nd";
                                                  case 3:
                                                    return "rd";
                                                  default:
                                                    return "th";
                                                }
                                              };

                                              const options = { month: "short", year: "numeric" };
                                              const formattedDate = `${day}${ordinalSuffix(day)} ${dateObj.toLocaleDateString(
                                                "en-GB",
                                                options
                                              )}`;
                                              const formattedTime = dateObj.toLocaleTimeString("en-US", {
                                                hour: "numeric",
                                                minute: "2-digit",
                                                hour12: true,
                                              });
                                              return `${formattedDate}, ${formattedTime.toLowerCase()}`;
                                            })()
                                            : "N/A"}
                                        </td>

                                        <td className='px-3  '>
                                          <span className='flex gap-2 justify-center '>
                                            <button onClick={() => handleEdit(link.id, link.link, link.shortlink)} className='bg-[#181E29] transform active:scale-90 rounded-full p-2 my-2 hover:bg-slate-700  text-white'>
                                              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="white"><path d="M160-120v-170l527-526q12-12 27-18t30-6q16 0 30.5 6t25.5 18l56 56q12 11 18 25.5t6 30.5q0 15-6 30t-18 27L330-120H160Zm80-80h56l393-392-28-29-29-28-392 393v56Zm560-503-57-57 57 57Zm-139 82-29-28 57 57-28-29ZM560-120q74 0 137-37t63-103q0-36-19-62t-51-45l-59 59q23 10 36 22t13 26q0 23-36.5 41.5T560-200q-17 0-28.5 11.5T520-160q0 17 11.5 28.5T560-120ZM183-426l60-60q-20-8-31.5-16.5T200-520q0-12 18-24t76-37q88-38 117-69t29-70q0-55-44-87.5T280-840q-45 0-80.5 16T145-785q-11 13-9 29t15 26q13 11 29 9t27-13q14-14 31-20t42-6q41 0 60.5 12t19.5 28q0 14-17.5 25.5T262-654q-80 35-111 63.5T120-520q0 32 17 54.5t46 39.5Z" /></svg>
                                            </button>
                                            <button onClick={() => handleDel(link.id, link.shortlink)} className='bg-[#181E29] transform active:scale-90 rounded-full p-2 my-2 hover:bg-slate-700  text-white'>
                                              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="white"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg>
                                            </button>
                                          </span>
                                        </td>
                                      </tr>

                                    )
                                  })
                                )
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {(Pieopen &&
                    <div className="2nd container flex-1 mb-6 md:m-0 order-2 md:order-1">
                      <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        exit={{ x: "-100%" }}
                        transition={{ duration: 1, ease: "linear" }}>

                        <Visitordevices close={() => setPieopen(false)} shortlink={selectedShortlink} clicks={selectedClicks} visitors={selectedVisitors} />
                      </motion.div>
                    </div>)}
                </AnimatePresence>
              </div>
              <AnimatePresence>
                {Graphopen && (<div className="flex items-center justify-center">
                  <div className=" mb-10  rounded-lg flex items-center justify-center">
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: "0%" }}
                      exit={{ x: "-100%" }}
                      transition={{ duration: 1, ease: "linear" }}>
                      <VisitorGraph close={() => setGraphopen(false)} visitors={selectedVisitors} />
                    </motion.div>
                  </div>
                </div>)}
              </AnimatePresence>


            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute >
  )
}

export default Insights
