import Link from "next/link";

function Home() {
return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-semibold">Welcome to Social Feed 👋</h1>
      <Link href="/login" className="mt-4 text-blue-500 underline">
        Login
      </Link>
    </main>
  );
}

export default Home
