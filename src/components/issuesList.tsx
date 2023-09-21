import React from 'react'

export default function IssuesList({children}: {children: React.ReactNode}) {
  return (
    <div className="border-gray-400 border rounded-md">
{children}
    </div>
  )
}
