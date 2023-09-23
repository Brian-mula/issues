'use client';
import { Octokit } from "octokit";
import { useState } from "react";


const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});
const tabs = ["Write", "Preview"];

export default function NewIssue() {
  const [title, setTitle] = useState("");
  const[content,setcontent]=useState("")
  const[labels,setLabels]=useState([])
  const[assignees,setAssignees]=useState([])
  const[milestone,setMilestone]=useState(1)
  const[project,setProject]=useState(0)
  const[status,setStatus]=useState("open")

  const handleNewIssue=async(e:any)=>{
    e.preventDefault()
    if(!title){
      return
    }
  try {
    await octokit.request('POST /repos/{owner}/{repo}/issues', {
      owner: 'Brian-mula',
      repo: 'accordion',
      title: title,
      body: content,
      assignees: assignees,
      // milestone: milestone,
      labels: labels,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
        authorization: `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
      }
    })
    console.log(title)
  } catch (error:any) {
    console.log(error.message)
  }
    
  }

  
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className="h-[calc(100vh-4rem)] mt-4 px-20">
      <div className="flex items-start">
        <form onSubmit={handleNewIssue} className="w-2/3 bg-gray-500 border border-gray-300 rounded-md p-3">
        
          <input
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
            type="text"
            className="w-full p-2 border bg-gray-600 rounded-md outline-blue-500 text-white"
            placeholder="Title"
          />
          <div className="tabs mt-3">
            {
              tabs.map((tab, index) => (
                <a
                  key={index}
                  className={`tab tab-lifted ${
                    activeTab === index ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab(index)}
                >
                  {tab}
                </a>
              ))
            }
           
          </div>
         {
          activeTab === 0 &&  <div>
          <textarea
          value={content}
          onChange={(e)=>setcontent(e.target.value)}
            className="w-full p-2 border bg-gray-800 rounded-md outline-blue-500 text-white mt-3"
            placeholder="Leave a comment"
            rows={6}
          ></textarea>
        </div>
         }
         <div className="flex justify-end items-center">
       <button type="submit" className="btn bg-green-600 btn-sm text-white hover:bg-green-500">Submit new issue</button>
         </div>
        
        </form>
      </div>
    </div>
  );
}
