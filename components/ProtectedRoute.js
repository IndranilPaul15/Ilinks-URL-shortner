import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useOpen } from "./context/OpenContext";

export default function ProtectedRoute({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const {setOpenA}=useOpen()

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
            setTimeout(() => {               
                setOpenA(true)
            }, 2000);
        }
    }, [status, router]);

    if (status === "loading") return <p>Loading...</p>;

    return children;
}
