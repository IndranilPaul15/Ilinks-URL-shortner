"use client"
import Link from 'next/link'
import { useEffect,useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
    const Router = useRouter()
    const [count, setcount] = useState(5)
    useEffect(() => {
        if (count===1){
            Router.push("/")
            return
        }
        const timer = setTimeout(() => {
            setcount(count-1)
        }, 1000);

        return () => {
            clearTimeout(timer)
        }
    }, [count,Router])

    return (
        <div id='page' className='flex-1 flex flex-col items-center justify-center bg-[#d3d3d3] text-gray-800'>
        <div className= 'size-full bg-no-repeat flex flex-col items-center justify-center bg-[url(/404-error-found.avif)] bg-center bg-contain'>
            <p className='absolute top-[20%] md:top-[15%] text-2xl kalam-font'>The Link you entered does not exist.</p>
            <p className='absolute bottom-[10%] md:bottom-1/2 md:right-[20%] text-2xl kalam-font'>Redirecting to <a href="/">Home</a> in <b>{count}</b> seconds...</p>
            <Link legacyBehavior href="/">
                <a className='mr-56 mb-48 px-24 py-12  text-white rounded transition duration-300'>
                </a>
            </Link>
        </div>
        </div>
    )
}