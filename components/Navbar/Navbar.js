"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Profile from "@/components/Profile";
import { useOpen } from "../context/OpenContext";
import { useSession } from "next-auth/react";


const Navbar = () => {
    const [bgStyle, setBgStyle] = useState({});
    const [Color, setColor] = useState("white");
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isRendered, setIsRendered] = useState(false);
    const { setOpenA, settoggle } = useOpen();
    const { status } = useSession();
    const toggleMenu = () => {
        if (!isMenuOpen) {
            setIsRendered(true);
            setTimeout(() => setIsMenuOpen(true), 1);
        } else {
            setIsMenuOpen(false);
            setTimeout(() => setIsRendered(false), 300);
        }
    };

    useEffect(() => {

        const getNonTransparentBgColor = (element) => {
            while (element) {
                const computedStyle = getComputedStyle(element);
                const bgColor = computedStyle.backgroundColor;

                if (bgColor !== "rgba(0, 0, 0, 0)" && bgColor !== "transparent") {
                    return bgColor;
                }
                element = element.parentElement;
            }
            return "rgb(255, 255, 255)";
        };
        const updateBgAndColor = () => {
            const pageContainer = document.getElementById("page");
            if (!pageContainer) return;

            const computedStyle = getComputedStyle(pageContainer);
            const bgImage = computedStyle.backgroundImage;

            if (bgImage !== "none") {
                setBgStyle({ backgroundImage: bgImage });
                setColor("white");
            }
            else {


                const bgColor = getNonTransparentBgColor(pageContainer);
                setBgStyle({ backgroundColor: bgColor });
                const rgbMatch = bgColor.match(/\d+/g);
                if (rgbMatch) {
                    const [r, g, b] = rgbMatch.map(Number);
                    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

                    setColor(brightness > 128 ? "black" : "white");
                }
            }
        };

        updateBgAndColor();
    }, [pathname]);

    return (
        <nav
            className={`flex top-0 justify-between z-20 items-center md:px-3 pt-2 pb-2 text-${Color}`}
            style={bgStyle}
        >
            <div className="logo">
                <Link href={"/"}>
                    <div
                        className={`text-3xl border border-${Color} p-2 md:ml-10 mx-3 md:mx-0`}
                        style={{ fontFamily: "Imprint MT Shadow" }}
                    >
                        <h1 className="text-center">ilinks</h1>
                        <p className="text-xs text-center tracking-[0.3rem] font-serif">
                            Link Shortener
                        </p>
                    </div>
                </Link>
            </div>
            {!isMenuOpen && (<button className="md:hidden text-2xl p-2" onClick={toggleMenu}>
                <Menu size={40} />
            </button>)}

            {/* Mobile Menu */}
            {(isRendered &&
                <ul className={`abril fixed top-2 right-2 text-${Color} text-lg w-40 rounded-lg shadow-2xl p-3 flex flex-col gap-2 transition-transform duration-300 md:hidden border border-${Color} ${isMenuOpen ? "translate-x-0" : "translate-x-full"} backdrop-blur-md bg-gray-700/5 z-50 pointer-events-auto`}>
                    <button className="absolute top-3 right-0 " onClick={toggleMenu}>
                        <X size={40} />
                    </button>
                    <li className={`w-fit hover:font-bold ${pathname === "/" ? "font-bold scale-105 " : ""} `}><Link href="/" onClick={toggleMenu}>Home</Link></li>
                    <li className={`hover:font-bold ${pathname === "/about" ? "font-bold scale-105 " : ""} `}><Link href="/about" onClick={toggleMenu}>About</Link></li>
                    <li className={`hover:font-bold ${pathname === "/insights" ? "font-bold scale-105 " : ""} `}><Link href="/insights" onClick={toggleMenu}>Insights</Link></li>
                    <li className={`hover:font-bold ${pathname === "/Shortener" ? "font-bold scale-105 " : ""} `}><Link href="/Shortener" onClick={toggleMenu}>Shortener</Link></li>
                    <li className={`hover:font-bold ${pathname === "/Shortener" ? "font-bold scale-105 " : ""} `}>
                        {status === "unauthenticated"
                            ? (
                                <div onClick={() => { settoggle("signin"); setOpenA(true) }}>
                                    <div
                                        className="rounded-full transform active:scale-95 text-base px-3 py-2 overflow-hidden relative group cursor-pointer border font-bold border-black text-black bg-white/50 text-center"
                                    >
                                        <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-black top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                                        <span className="relative text-black transition duration-300 group-hover:text-white ease ">
                                            Sign In Now
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className=""><Profile /></div>
                            )
                        }
                    </li>
                </ul>)}
            <ul className="abril tracking-widest hidden md:flex justify-between items-center text-xl md:gap-5 ">
                <li className={`hover:font-bold ${pathname === "/" ? "font-medium underline scale-105 " : ""} `}><Link href="/">Home</Link></li>
                <li className={`hover:font-bold ${pathname === "/about" ? "font-medium underline scale-105 " : ""} `}><Link href="/about">About</Link></li>
                <li className={`hover:font-bold ${pathname === "/insights" ? "font-medium underline scale-105 " : ""} `}><Link href="/insights">Insights</Link></li>
            </ul>
            <ul className="md:flex justify-between items-center text-lg md:gap-3 font-semibold hidden">
                <Link
                    href="/Shortener"
                    className="rounded-full transform active:scale-95 text-base px-3.5 py-2 overflow-hidden relative group cursor-pointer border-2 font-bold border-[#255ac3] text-[#255ac3] bg-white"
                >
                    <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-[#255ac3] top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                    <span className="relative text-[#255ac3] transition duration-300 group-hover:text-white ease">
                        Try Now
                    </span>
                </Link>
                {status === "unauthenticated"
                    ? (
                        <div onClick={() => { settoggle("signin"); setOpenA(true) }}>
                            <div
                                className="rounded-full transform active:scale-95 text-base px-3.5 py-2 overflow-hidden relative group cursor-pointer border-2 font-bold border-black text-black bg-white"
                            >
                                <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-black top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                                <span className="relative text-black transition duration-300 group-hover:text-white ease">
                                    Sign In Now
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className=""><Profile /></div>
                    )
                }

            </ul>
        </nav>
    );
};

export default Navbar;
