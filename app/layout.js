import { Abril_Fatface, Baloo_Tamma_2, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Kalam, Baloo_Thambi_2 } from "next/font/google";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SessionWrapper from "@/components/sessionwrapper";
import { OpenProvider } from "@/components/context/OpenContext";


const abril = Abril_Fatface({
  display: 'swap',
  weight: ["400"],
  variable: "--font-abril"
})
const baloo2 = Baloo_Tamma_2({
  display: 'swap',
  weight: ["400", "700", "800"],
  variable: "--font-baloo2"
})
const baloo = Baloo_Thambi_2({
  display: 'swap',
  weight: ["400", "700", "800"],
  variable: "--font-baloo"
})

const kalam = Kalam({
  subsets: ['latin'],
  display: 'swap',
  weight: ["300", "400", "700"],
  variable: "--font-kalam"
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ilinks - your URL Shortener",
  description: "Powerful URL shortener Developed by Indranil Paul",
  image:"./ilinks-home.jpg",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <OpenProvider>
        <SessionWrapper>
          <body className={`${geistSans.variable} ${geistMono.variable} ${kalam.variable} ${baloo.variable} ${baloo2.variable} ${abril.variable} antialiased flex flex-col min-h-screen transition-all`}>
            <Navbar />
            <main className="flex-1 flex">
              {children}
            </main>
            <ToastContainer toastStyle={{ width: 'fit-content' }} />
            <Footer />
          </body>
        </SessionWrapper>
      </OpenProvider>
    </html>
  );
}
