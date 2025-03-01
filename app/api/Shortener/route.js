import clientPromise from "@/lib/mongodb";
import { v4 as uuidv4 } from 'uuid';
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";


export async function POST(request) {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("ilinks");
    const collection = db.collection("link");
    const isExist = await collection.findOne({ shortlink: body.shortlink });
    if (isExist) {
        return Response.json({ success: false, error: true, message: "This Shortlink is Already Taken!" });
    }

    // Determine user identity
    let userId
    if (session) {
        userId = session.user.id;
    } else {
        userId = "guest";
    }



    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("remote-addr");

    let locationData = { country: "Unknown", city: "Unknown", region: "Unknown" };
    try {
        const locationResponse = await fetch(`http://ip-api.com/json/${ip}`);
        const locationJson = await locationResponse.json();
        if (locationJson.status === "success") {
            locationData = {
                country: locationJson.country,
                city: locationJson.city,
                region: locationJson.regionName
            };
        }
    } catch (error) {
        console.error("Error fetching location:", error);
    }

    const userAgent = request.headers.get("user-agent") || "Unknown";
    const deviceInfo = parseUserAgent(userAgent);


    const result = await collection.insertOne({
        id: uuidv4(),
        link: body.link,
        shortlink: body.shortlink,
        userId: userId,
        clicks: 0,
        date: new Date(),
        active: true,
        ip: ip,
        location: locationData,
        device: deviceInfo,
        visitors: []
    });
    return Response.json({ success: true, error: false, message: "Your Link Has Been Generated Successfully!" });
}
function parseUserAgent(userAgent) {
    let os = "Unknown OS";
    let browser = "Unknown Browser";

    if (/windows/i.test(userAgent)) os = "Windows";
    else if (/macintosh|mac os x/i.test(userAgent)) os = "Mac OS";
    else if (/linux/i.test(userAgent)) os = "Linux";
    else if (/android/i.test(userAgent)) os = "Android";
    else if (/iphone|ipad|ipod/i.test(userAgent)) os = "iOS";

    if (/chrome|crios/i.test(userAgent)) browser = "Chrome";
    else if (/firefox|fxios/i.test(userAgent)) browser = "Firefox";
    else if (/safari/i.test(userAgent) && !/chrome|crios/i.test(userAgent)) browser = "Safari";
    else if (/edg/i.test(userAgent)) browser = "Edge";
    else if (/opr|opera/i.test(userAgent)) browser = "Opera";

    return { os, browser };
}