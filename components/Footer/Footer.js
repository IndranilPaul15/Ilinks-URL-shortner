"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const [bgStyle, setBgStyle] = useState();
  const pathname = usePathname();
  const [textColor, setTextColor] = useState("text-white");


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
    const updateBgAndTextColor = () => {
      const pageContainer = document.getElementById("page");
      if (!pageContainer) return;

      const computedStyle = getComputedStyle(pageContainer);
      const bgImage = computedStyle.backgroundImage;

      if (bgImage !== "none") {
        setBgStyle({ backgroundImage: bgImage });
        setTextColor("text-white");
      }
      else {


        const bgColor = getNonTransparentBgColor(pageContainer);
        setBgStyle({ backgroundColor: bgColor });
        const rgbMatch = bgColor.match(/\d+/g);
        if (rgbMatch) {
          const [r, g, b] = rgbMatch.map(Number);
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;

          setTextColor(brightness > 128 ? "text-black" : "text-white");
        }
      }
    };

    updateBgAndTextColor();
  }, [pathname]);

  return (
    <footer className={`${textColor} text-center transition-all z-50 md:z-0`} style={bgStyle}>
      <span>Developed by &copy;Indranil Paul 💙 <span>| 2025</span></span>
    </footer>
  );
}
