"use client"

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Link from "next/link";

export default function Home() {
  const { theme } = useTheme();

  return (
    <div className="flex flex-row justify-center gap-3 py-8">
      <Link href={"/login"}>
        <Button className="cursor-pointer" variant={"ghost"}>Login</Button>
      </Link>
      <Link href={"/register"}>
        <Button className="cursor-pointer text-secondary-foreground ">Cadastro</Button>
      </Link>
      <ThemeToggle />
    </div>
  );
}
