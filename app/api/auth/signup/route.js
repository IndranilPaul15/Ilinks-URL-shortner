import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
    try {
        const { email, name, password } = await req.json();
        if (!email || !name || !password) return new Response(JSON.stringify({ message: "All fields are required" }), { status: 400 });

        const client = await clientPromise;
        const db = client.db("ilinks");
        const users = db.collection("User");
        
        const existingUser = await users.findOne({ email });
        if (existingUser) return new Response(JSON.stringify({ message: "User already exists" }), { status: 400 });

        const hashedPassword = await bcrypt.hash(password, 10);
        await users.insertOne({email, name, password: hashedPassword });

        return new Response(JSON.stringify({ message: "User created successfully" }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}
