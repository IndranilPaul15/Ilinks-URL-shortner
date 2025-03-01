import { notFound, redirect } from "next/navigation"
import clientPromise from "@/lib/mongodb"


export default async function Page({ params }) {
    
    const shortlink = (await params).shortlink
    const client = await clientPromise  
    const db = client.db("ilinks")
    const collection = db.collection("link")
    const isExist = await collection.findOne({ shortlink: shortlink });
    // await collection.updateOne({ shortlink }, { $inc: { clicks: 1 } });
    if (isExist && isExist.active === true) {
        console.log(`${process.env.NEXT_PUBLIC_HOST}/api/track?shortlink=${isExist.shortlink}`)
        redirect (`${process.env.NEXT_PUBLIC_HOST}/api/track?shortlink=${isExist.shortlink}`)
        
    }
    else{
        notFound()
    }
  }



  