"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import { VscSignOut } from "react-icons/vsc";
import { AnimatePresence, motion } from "framer-motion";

export default function Profile() {
    const { data: session, status } = useSession();
    // console.log(status)
    const router = useRouter();
    const [imageError, setImageError] = useState(false);
    const userImage = session?.user?.image;
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push("/");
    };
    if (status === "loading") return <p>Loading...</p>;


    return (
        <div className="relative ">
            {!isProfileOpen ?
                (<div
                    className="rounded-full md:rounded-xl transform text-base px-3.5 py-2 overflow-hidden relative group cursor-pointer border md:border-2 font-bold border-black text-black md:bg-white bg-white/50"
                >
                    <span className="absolute w-56 h-0 transition-all duration-300 origin-center rotate-90 -translate-x-0 bg-black top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                    <span className="relative text-black transition duration-300 group-hover:text-white ease">
                        <div className="flex  justify-around items-center gap-2">
                            {userImage && !imageError ? (
                                <img
                                    src={session?.user?.image}
                                    alt="User Profile"
                                    onError={() => setImageError(true)}
                                    className="object-cover rounded-full border "
                                    width={25}
                                    height={25}
                                />
                            ) : (
                                <div className="">
                                    <div className="size-[25px] flex items-center justify-center rounded-full bg-slate-300">
                                        {session?.user?.name?.charAt(0)}
                                    </div>
                                </div>
                            )}
                            <span className="hidden md:block">{session?.user?.name}</span>
                            <button onClick={() => setIsProfileOpen(true)} className="text-2xl active:scale-125 "><GoChevronDown /></button>
                        </div>
                    </span>
                </div>)
                :
                (<AnimatePresence>
                    <motion.div
                        initial={{ y: "-100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "-100%", opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute -top-6 right-0 border bg-white text-black p-3 rounded-xl shadow-lg"
                    >
                        <div className=" flex flex-col w-56 justify-center items-center space-y-2">
                            <div className="flex w-32 ml-16 justify-between">
                                <h1 className="text-xl font-bold">Profile</h1>
                                <button onClick={() => setIsProfileOpen(false)} className="text-2xl active:scale-125">
                                    <GoChevronUp />
                                </button>
                            </div>
                            {userImage && !imageError ? (
                                <img
                                    src={session?.user?.image}
                                    alt="User Profile"
                                    onError={() => setImageError(true)}
                                    className="object-cover rounded-full border-2"
                                    width={60}
                                    height={60}
                                />
                            ) : (
                                <div className="">
                                    <div className="size-[60px] rounded-full bg-slate-300 flex items-center justify-center text-3xl">
                                        {session?.user?.name?.charAt(0)}
                                    </div>
                                </div>
                            )}
                            <p>{session?.user?.name}</p>
                            <p>{session?.user?.email}</p>
                            <button onClick={handleSignOut} className="relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-red-500 rounded-xl active:scale-95 group">
                                <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out  bg-red-700 rounded group-hover:-mr-4 group-hover:-mt-4">
                                    <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"></span>
                                </span>
                                <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full translate-y-full bg-red-600 rounded-2xl group-hover:mb-12 group-hover:translate-x-0"></span>
                                <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white">
                                    <span className="flex justify-center items-center gap-2">
                                        <span>Sign Out</span>
                                        <VscSignOut className="size-5" />
                                    </span>
                                </span>
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>)}


        </div>
    );
}
