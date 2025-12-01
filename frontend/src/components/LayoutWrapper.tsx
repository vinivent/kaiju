"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "./ui/navbar";
import Footer from "./ui/footer";
import ProtectedNav from "./ui/ProtectedNav";
import { useUser } from "@/contexts/UserContext";
import Loader from "./ui/Loader";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, loading } = useUser();
  const [mounted, setMounted] = useState(false);

  // Routes that have their own layout with navbar (protected routes)
  const isProtectedRoute =
    pathname.startsWith("/profile") || pathname.startsWith("/home");
  // Routes that should hide navbar completely
  const hideNavbar =
    ["/login", "/register"].includes(pathname) || isProtectedRoute;
  const hideFooter = ["/login", "/register"].includes(pathname);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!mounted) {
    return (
      <>
        {!hideNavbar && <Navbar />}
        <main>{children}</main>
        {!hideFooter && <Footer />}
      </>
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
