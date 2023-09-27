import { MouseEventHandler } from "react";

export default function ClearSearch({handleClearSearch}:{handleClearSearch:MouseEventHandler}) {
  return (
    <div onClick={handleClearSearch} className='flex my-2 items-center cursor-pointer hover:text-blue-600'>
        <div className='p-1 h-8 w-8 bg-gray-500 rounded-full flex items-center justify-center'>
            <span className='text-3xl'>x</span>
        </div>
        <p className="px-2">Clear current search query,filters and sorts</p>
    </div>
  )
}
