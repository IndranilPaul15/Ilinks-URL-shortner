import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
    try {
        
        const client = await clientPromise;
        const db = client.db("ilinks");
        const collection = db.collection("link");
        const { id } = await params;
        const updatedData = await req.json();
        if (!id) {
            return NextResponse.json({ message: "ID is required" }, { status: 400 });
        }

        const result = await collection.updateOne(
            { id },
            { $set: updatedData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: "Link not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Link updated successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error updating link:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}


export async function DELETE(req, { params }) {
    try {
        const client = await clientPromise;
        const db = client.db("ilinks");
        const collection = db.collection("link");

        const { id } = params;
        const result = await collection.deleteOne({ id });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: "Link not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Link deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting link:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}



