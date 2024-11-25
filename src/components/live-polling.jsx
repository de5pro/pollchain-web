'use client'

import { useRouter } from 'next/navigation'

export default function LivePollingPage() {
  const router = useRouter();

  return (
    <>
        <div className='px-44'>
            <div className='mt-6'>
                <h1 className='text-center text-4xl font-bold my-2'>Live Polling</h1>
                <h2 className='text-center text-gray-600 font-semibold'>Real-Time Polling Dashboard: Cast, Track, and Engage in Live Elections</h2>
            </div>
            <div className='my-8 grid grid-cols-3 gap-20'>
                <div className='border-2 rounded-2xl h-80  border-black flex flex-col items-center'>
                    <div className='rounded-full h-28 w-28 mt-4'>
                        <img src="https://freenaturestock.com/wp-content/uploads/freenaturestock-2228-768x1152.jpg" alt="user_profile" className='h-full w-full object-cover rounded-full' />
                    </div>
                    <h1 className='text-black font font-semibold text-xl mt-4 mb-1'>Candidate 1</h1>
                    <h2 className='text-sm text-gray-500'>0xajkKJAibuaOAIBbhjAKnsij</h2>
                    <div>
                        <h1 className='text-black text-center font-bold mt-4 text-5xl'>10</h1>
                        <h2 className='text-center text-xl'>Votes</h2>
                    </div>
                </div>
                <div className='border-2 rounded-2xl h-80 border-black flex flex-col items-center'>
                    <div className='rounded-full h-28 w-28 mt-4'>
                        <img src="https://freenaturestock.com/wp-content/uploads/freenaturestock-2228-768x1152.jpg" alt="user_profile" className='h-full w-full object-cover rounded-full' />
                    </div>
                    <h1 className='text-black font font-semibold text-xl mt-4 mb-1'>Candidate 2</h1>
                    <h2 className='text-sm text-gray-500'>0xajkKJAibuaOAIBbhjAKnsij</h2>
                    <div>
                        <h1 className='text-black text-center font-bold mt-4 text-5xl'>20</h1>
                        <h2 className='text-center text-xl'>Votes</h2>
                    </div>
                </div>
                <div className='border-2 rounded-2xl h-80  border-black flex flex-col items-center'>
                    <div className='rounded-full h-28 w-28 mt-4'>
                        <img src="https://freenaturestock.com/wp-content/uploads/freenaturestock-2228-768x1152.jpg" alt="user_profile" className='h-full w-full object-cover rounded-full' />
                    </div>
                    <h1 className='text-black font font-semibold text-xl mt-4 mb-1'>Candidate 3</h1>
                    <h2 className='text-sm text-gray-500'>0xajkKJAibuaOAIBbhjAKnsij</h2>
                    <div>
                        <h1 className='text-black text-center font-bold mt-4 text-5xl'>30</h1>
                        <h2 className='text-center text-xl'>Votes</h2>
                    </div>
                </div>
            </div>
            <div className="border-2  rounded-2xl  border-black py-6 col-span-3">
                <div className='grid grid-cols-6 gap-4'>
                    <div className="flex justify-end mr-6">
                        <span className="text-md font-semibold">Candidate 1</span>
                    </div>
                    <div className="bg-gray-200 rounded-full col-span-4">
                        <div className="bg-black h-full rounded-full w-[10%]"></div>
                    </div>
                    <div className='flex justify-start ml-6'>
                        <span className="text-md font-semibold">10% (10 Votes)</span>
                    </div>
                </div>
                <div className='grid grid-cols-6 gap-4 mt-3'>
                    <div className="flex justify-end mr-6">
                        <span className="text-md font-semibold">Candidate 2</span>
                    </div>
                    <div className="bg-gray-200 rounded-full col-span-4">
                        <div className="bg-black h-full rounded-full w-[20%]"></div>
                    </div>
                    <div className='flex justify-start ml-6'>
                        <span className="text-md font-semibold">20% (20 Votes)</span>
                    </div>
                </div>
                <div className='grid grid-cols-6 gap-4 mt-3'>
                    <div className="flex justify-end mr-6">
                        <span className="text-md font-semibold">Candidate 3</span>
                    </div>
                    <div className="bg-gray-200 rounded-full col-span-4">
                        <div className="bg-black h-full rounded-full w-[30%]"></div>
                    </div>
                    <div className='flex justify-start ml-6'>
                        <span className="text-md font-semibold">30% (30 Votes)</span>
                    </div>
                </div>
            </div>

        </div>
    </>
  )
}