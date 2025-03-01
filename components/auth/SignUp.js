"use client";
import { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { X } from "lucide-react";
import { FaRegEye } from "react-icons/fa6";
import { LuEyeClosed } from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";
import { VscGithubInverted } from "react-icons/vsc";
import Image from "next/image";
import { motion } from "framer-motion";

const Bgauth = () => {
    return (
        <div className="absolute size-full overflow-hidden top-0 left-0 z-[-1] rounded-xl bg-gradient-to-br from-[#D0F0E5_4%] via-[#85d2dd_29%] to-[#f6b4fa] ">
            <div className="size-full relative overflow-hidden">
                <motion.div className="absolute -right-2 -top-3"
                    initial={{ x: "100%",y:"-100%" }}
                    animate={{ x: "0%",y:"0%" }}
                    transition={{ duration: 0.7, ease: "linear" }}
                >
                    <Image src={'/authbot.png'} alt="authbot" width={500} height={500} className="w-[200px]" />
                </motion.div>
                <div className="absolute size-28 -top-3 -left-3 bg-gradient-to-br from-[#459FC3_48%] to-[#d91fe3_100%] rounded-full">
                    <div className="bg-gradient-to-r from-[#BB84E8] to-[#71DBBA] size-20 rounded-full"></div>
                </div>
            </div>

        </div>
    )
}




export default function SignUp({ settoggle, setOpenA }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const passRef = useRef(null);

    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();
            setLoading(false);

            if (!res.ok) throw new Error(data.message || "Signup failed");
            settoggle("signin")
        } catch (err) {
            setLoading(false);
            setError(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center px-3 rounded-xl">
            <div className="w-full relative max-w-md shadow-2xl rounded-xl p-6 pb-2 md:mt-10 ">
                <Bgauth />
                <button onClick={() => setOpenA(false)} className="absolute right-3 top-4 active:scale-110 "><X color="white" size={30} /></button>
                <div className="space-y-3 mt-12 md:px-10">
                    <div className=" relative flex justify-center items-center">
                        <h1 className="text-3xl bg-clip-text text-transparent drop-shadow-[0_0_4px_black] font-semibold text-center text-white baloo">Join ilinks Now!</h1>
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="User name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <div className="relative flex">
                            <input
                                type={showPassword ? "text" : "password"}
                                ref={passRef}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <span className='right-3 top-2.5 absolute cursor-pointer ' onClick={togglePassword}>
                                {showPassword ? <FaRegEye size={24} /> : <LuEyeClosed size={24} />}
                            </span>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition duration-300"
                        >
                            {loading ? "Signing Up..." : "Sign Up"}
                        </button>
                    </form>

                    <div className="flex items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="px-3 text-gray-500">OR</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <button
                        onClick={() => signIn("github", { callbackUrl: "/" })}
                        className="w-full flex items-center justify-center bg-gray-800 hover:bg-gray-900 active:scale-95 text-white py-2 rounded-lg transition duration-300">
                        <span className="mr-5"><VscGithubInverted size={25} /></span>
                        <span>Sign up with Git-Hub</span>
                    </button>

                    <button
                        onClick={() => signIn("google", { callbackUrl: "/" })}
                        className="w-full flex items-center justify-center bg-white hover:bg-gray-300 active:scale-95 border-2 border-black py-2 rounded-lg transition duration-300">
                        <span className="mr-5"><FcGoogle size={25} /></span>
                        <span>Sign up with Google</span>
                    </button>
                    <div className=" flex justify-center pt-2">
                        <span>Already have an account?</span>
                        <button onClick={() => settoggle("signin")} className="text-blue-500 mx-2 hover:font-bold active:scale-95"> Sign In Now!</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
