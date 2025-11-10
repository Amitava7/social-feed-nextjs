
import GridMotion from '@/components/GridMotion';
import Link from 'next/link';
  
const items = [
"Friends",
"Family",
"Work",
"Travel",
"Fitness",
"Hobbies",
"Education",
"Health",
"Finance",
"Shopping",
"Entertainment",
"Productivity",
"Pets",
"Nature",
"Technology",
"Food",
"Art",
"Music",
"Sports",
"Gaming",
"Photography",
"Fashion",
"DIY",
"Cars",
"Movies",
];

async function submitAction(formData: FormData) {
  'use server';
  const username = formData.get('username');
  const password = formData.get('password');

  console.log('Username:', username);
  console.log('Password:', password);
}
function page() {
  return (
  <>
    <GridMotion items={items} />
    <div className="absolute inset-0 flex items-center justify-center z-20">
      <form className="w-80 bg-black/10 backdrop-blur-sm p-6 rounded-lg shadow-md" action={submitAction}>
      <h2 className="text-lg font-semibold mb-4 text-center">Login</h2>

      <label className="block text-sm mb-2">
        <span className="text-white-700">Username</span>
        <input
        name="username"
        type="text"
        autoComplete="username"
        required
        className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </label>

      <label className="block text-sm mb-4">
        <span className="text-white-700">Password</span>
        <input
        name="password"
        type="password"
        autoComplete="current-password"
        required
        className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </label>

      <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
        Sign in
      </button>
      <p className="mt-3 text-center text-sm text-white/80">
        Don't have an account?{' '}
        <Link href="/signup" className="text-indigo-400 hover:underline">
          Sign up
        </Link>
      </p>
      </form>
    </div>
    </>
  
  )
}

export default page
