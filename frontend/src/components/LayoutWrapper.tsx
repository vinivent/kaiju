"use client";

import { usePathname } from "next/navigation";
import Navbar from "./ui/navbar";
import Footer from "./ui/footer";
import ProtectedNav from "./ui/ProtectedNav";
import { useUser } from "@/contexts/UserContext";
import Loader from "./ui/Loader";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useUser(); // <-- veja abaixo como adicionar o loading
  const hideNavbar = ["/login", "/register", "/home"].includes(pathname);
  const hideFooter = ["/login", "/register"].includes(pathname);

  // 🔹 Enquanto o user está sendo buscado
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {!hideNavbar && (user ? <ProtectedNav /> : <Navbar />)}
      <main>{children}</main>
      {!hideFooter && <Footer />}
    </>
  );
}
