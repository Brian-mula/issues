"use client"

import { signOut, useSession } from "next-auth/react"

export default function Navbar() {
    const {data,status}= useSession()
  return (
    <>
    {
        status==='authenticated' &&
        <div className="navbar bg-gray-600">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">IBUQA ISSUES</a>
        </div>
        <div className="flex-none">
          <div className="flex items-center">
           <p className="px-3">
              { data?.user?.name }
           </p>
           <button onClick={()=>signOut()} className="btn btn-warning btn-sm text-white font-bold">
             Logout
           </button>
          </div>
        </div>
      </div>
    }
    </>
  )
}
