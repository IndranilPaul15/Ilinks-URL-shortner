import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url, `http://${req.headers.get("host")}`);
    const shortlink = searchParams.get("shortlink");


    if (!shortlink) {
      return NextResponse.json({ message: "Shortlink is required" }, { status: 400 });

    }

    const client = await clientPromise;
    const db = client.db("ilinks");
    const collection = db.collection("link");
    const isExist = await collection.findOne({ shortlink });

    if (!isExist || !isExist.active) {
      notFound();
    }

    const forwarded = req.headers.get("x-forwarded-for");

    const ip = forwarded ? forwarded.split(",")[0] : req.headers.get("remote-addr");

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

    const userAgent = req.headers.get("user-agent") || "Unknown";
    const deviceInfo = parseUserAgent(userAgent);

    if (!Array.isArray(isExist.visitors)) {
      await collection.updateOne(
        { shortlink },
        { $set: { visitors: [] } }
      );
    }

    await collection.updateOne(
      { shortlink },
      {
        $push: { visitors: { ip, deviceInfo, locationData, date: new Date() } },
        $inc: { clicks: 1 },
      }
    );

    return NextResponse.redirect(isExist.link);
  } catch (error) {
    console.error("Error tracking link:", error);
    return NextResponse.json({ message: "Internal Server Error Redirecting to a Invalid link" }, { status: 500 });
  }
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