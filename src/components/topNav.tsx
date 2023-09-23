import Link from 'next/link'

export default function TopNavSection() {
  return (
    <div className='px-3 py-4 bg-gray-600 mb-4'>
        <div className='flex justify-end items-center'>
            <Link href='/issues/new' className='bg-green-600 font-bold px-3 py-2 rounded-md' >New Issue</Link>
        </div>
    </div>
  )
}
