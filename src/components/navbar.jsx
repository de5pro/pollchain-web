'use client'

import { useRouter } from 'next/navigation'

export default function Navbar() {
  const router = useRouter();

  return (
    <>
        <div className='h-16 rounded-xl mx-16 mt-4 bg-gradient-to-bl from-amber-200 to-yellow-400 grid grid-cols-2'>
            <div className='flex items-center pl-28'>
                <h1 className='text-black text-2xl font-semibold cursor-default'>PollPal</h1>
            </div>
            <div className='flex items-center justify-end pr-28'>
                <ul className='flex gap-12'>
                    <li className='text-black text-lg'><button>Home</button></li>
                    <li className='text-black text-lg'><button>About</button></li>
                    <li className='text-black text-lg'><button>How it works?</button></li>
                    <li className='text-black text-lg'><button>Login</button></li>
                </ul>
            </div>
        </div>
    </>
  )
}