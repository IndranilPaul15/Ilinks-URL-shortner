"use client";

import { useState } from "react";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import { motion, AnimatePresence } from "framer-motion";
import { useOpen } from "../context/OpenContext";

export default function AuthManager() {
    const {toggle, settoggle, setOpenA} = useOpen()
    return (

        <AnimatePresence mode="wait">
            {toggle === "signup" ? (
                <motion.div
                    key="A"
                    initial={{ x: "-100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <SignUp settoggle={settoggle} setOpenA={setOpenA} />
                </motion.div>
            ) : (
                <motion.div
                    key="B"
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "-100%", opacity: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <SignIn settoggle={settoggle} setOpenA={setOpenA} />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
