"use client"

import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <div className="h-screen w-screen pt-40">
        <div className="bg-gray-600 shadow-md w-96 rounded-md py-4 px-3 mr-auto ml-auto ">
            <h3 className="text-center">Login with Github</h3>
            <div className="flex justify-center items-center">
            <img src="/github.png" alt="git logo" className="w-20 h-20 rounded-full mt-5" />
            </div>
            <div className="flex justify-center items-center">
            <button onClick={()=>signIn('github',{callbackUrl:'/'})} className="btn btn-success flex mt-8">
                    <span className="text-lg">Login with Github</span>
            </button>
            </div>
        </div>
    </div>
  )
}
