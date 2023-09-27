"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

export default function Navbar() {
    const {data,status}= useSession()
  return (
    <>
    {
        status==='authenticated' &&
        <div className="navbar bg-gray-600">
        <div className="flex-1">
          <Link href={`/`} className="btn btn-ghost text-xl uppercase">Gitub ISSUE manager</Link>
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
