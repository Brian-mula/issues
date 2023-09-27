'use client';
import IssueAssignees from "@/components/issue_assinees";
import IssueLabels from "@/components/issue_labels";
import IssueMileStones from "@/components/issue_milestone";
import IssueProjects from "@/components/issue_projects";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Octokit } from "octokit";
import { useState } from "react";


const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});
const tabs = ["Write", "Preview"];

export default function NewIssue() {
  const [title, setTitle] = useState("");
  const[content,setcontent]=useState("")
  const[labels,setLabels]=useState<string[]>([])
  const[assignees,setAssignees]=useState<string[]>([])
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
    useRouter().push('/')
    console.log(title)
  } catch (error:any) {
    console.log(error.message)
  }
    
  }

  const handleAssignees=(name:string)=>{
    setAssignees((val)=>[...val,name])
  }
  const handleLabels=(name:string)=>{
    setLabels((val)=>[...val,name])
  }

  
  const [activeTab, setActiveTab] = useState(0);
  const { data, status: level } = useSession();
  const router = useRouter();
  if (level === "unauthenticated") {
    router.push("/authentication/login");
  }
  return (
    <div className="h-[calc(100vh-4rem)] min-h-screen pt-4 px-20 bg-slate-900">
      <div className="block md:flex md:items-start">
        <form onSubmit={handleNewIssue} className="w-full md:w-2/3 bg-gray-500 border border-gray-300 rounded-md p-3">
        
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
        <div className="w-96 px-3">
          <div className="border-b border-gray-500 w-full py-2">
          <IssueAssignees onAssignee ={handleAssignees} />
          <p>{assignees.length ===0 ? `None yet`: `${assignees}`} </p>
          </div>
          <div className="border-b border-gray-500 w-full py-2">
          <IssueLabels onAssignLabel={handleLabels} />
          <p>{labels.length ===0 ? `None yet`: `${labels}`} </p>
          </div>
          <div className="border-b border-gray-500 w-full py-2">
          <IssueProjects/>
          <p>{project ? `${project}`: `No project`} </p>
          </div>
          <div className="border-b border-gray-500 w-full py-2">
          <IssueMileStones/>
          <p>{milestone ? `${milestone}`: `No milestone`} </p>
          </div>
        </div>
      </div>
    </div>
  );
}
