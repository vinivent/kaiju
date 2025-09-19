import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-row justify-center gap-3 py-8">
      <Link
        href={"/login"}
        className="bg-transparent border border-green-600 px-4 py-2 rounded-full hover:bg-green-600 transition-all"
      >
        Login
      </Link>
      <Link
        href={"/register"}
        className="bg-green-600 px-4 py-2 rounded-full  hover:bg-transparent border hover:border-green-600 transition-all"
      >
        Cadastro
      </Link>
    </div>
  );
}
