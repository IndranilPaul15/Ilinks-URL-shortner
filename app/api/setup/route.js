import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";


export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const client = await clientPromise;
    const db = client.db("ilinks");
    const collection = db.collection("link");

    let query = {};
    if (session) {
        query = { userId: session.user.id }; // Fetch logged-in user's links
    } else {
        return Response.json({ success: false, error: true, message: "No user session or token provided!" });
    }

    const links = await collection.find(query).toArray();

    return NextResponse.json({ links }, { status: 200 });
  } catch (error) {
    console.error("Error fetching links:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
