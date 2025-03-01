import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import SignIn from "@/components/auth/SignIn";
import { v4 as uuidv4 } from 'uuid'; 

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const client = await clientPromise;
                const db = client.db("ilinks");
                const users = db.collection("User");

                const user = await users.findOne({ email: credentials.email });
                if (!user) throw new Error("User not found");

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) throw new Error("Invalid credentials");

                return { id: user._id.toString(), email: user.email, name: user.name, image: user.image };
            }
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks: {

        async signIn({ account, profile }) {
            if (account.provider === "github" || account.provider === "google") {
                const client = await clientPromise;
                const db = client.db("ilinks");
                const users = db.collection("User");
                let user = await users.findOne({ email: profile.email });
                if (!user) {
                    const newUser = {
                        email: profile.email,
                        name: profile.name,
                        image: profile.picture || profile.avatar_url,
                        password: null,
                        createdAt: new Date()
                    };
                    await users.insertOne(newUser);
                }
            }
            return true;
        },


        async session({ session, token }) {
            session.user.id = token.sub;
            return session;
        },
        async jwt({ token, user }) {
            if (user) token.sub = user.id;
            return token;
        }
    },

    events: {
        async signIn({ account }) {
            // Redirect
            if (account.provider === "github" || account.provider === "google") {
                return "/";
            }
        }
    },

    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: SignIn
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };