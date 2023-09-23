"use client";

import IssuDisplay from "@/components/IssuDisplay";
import IssueBar from "@/components/IssueBar";
import NoItemsFound from "@/components/empty";
import IssuesList from "@/components/issuesList";
import Loader from "@/components/loader";
import OnError from "@/components/onerror";
import TopNavSection from "@/components/topNav";
import { GitHubIssueType } from "@/types/issueType";
import { Octokit } from "@octokit/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useReducer } from "react";

const initialState = {
  issues: [] as GitHubIssueType[],
  memberIssues: [] as GitHubIssueType[],
  status: 'loading',
}

const reducer = (state:any, action:any) => {
  switch (action.type) {
    case "issuesReceived":
      return{
        ...state,
        issues: action.payload,
        status:'ready'
      }
    case "err":
      return{
        ...state,
        status:'error'
      }
    case "author":
      return{
        ...state,
        memberIssues: action.payload,
        status:'searching'
      }
    default:
      return state
  }
}

export default function Home() {

  const [{issues,memberIssues,status},dispatch]=useReducer(reducer,initialState)

  useEffect(() => {
    const octokit = new Octokit({
      auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
    });
    octokit.request("GET /repos/{owner}/{repo}/issues", {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      },
      owner: 'Taquana-LTD',
      repo: 'nganya-apis',
      per_page: 100,
    }).then((res) => dispatch({type:'issuesReceived',payload:res.data})).catch((err) => dispatch({type:'err'}))
  },[])
  // const totalIssues = issues.length;
  // console.log(issues);
  const openIssues = issues.filter((issue:GitHubIssueType) => issue.state === "open")
  const totalIssues = openIssues.length;
  const filteredIssues = memberIssues.length
  const brianIssues = (name:string)=> {
    
    const issu= issues.filter((issue:GitHubIssueType) => issue.assignee?.login === name)
    dispatch({type:'author',payload:issu})
  }
  
  const {data,status:level} = useSession()
  const router = useRouter()
  if(level==='unauthenticated') {
    router.push('/authentication/login')
  }else{
    return (
      
        <div className={`px-20 pt-5 pb-20 max-h-fit ${filteredIssues < 10 ? 'h-[calc(100vh-4rem)]':''}`}>
        {status==='loading' && <Loader/>}
        {status==='error' && <OnError/>}
        {
          status==='ready' && <>
          <TopNavSection/>
          <IssuesList>
            
          <IssueBar totalIssues={totalIssues} onFilter={brianIssues} />
          {issues.map((issue:GitHubIssueType) => <IssuDisplay issue={issue}  key={issue.id} />)}
          </IssuesList>
          </>
        }
        
         {
          status==='searching' && <IssuesList>
          <IssueBar totalIssues={filteredIssues} onFilter={brianIssues} />
          {memberIssues.length === 0 && <NoItemsFound/>}
          {memberIssues.map((issue:GitHubIssueType) => <IssuDisplay issue={issue}  key={issue.id} />)}
          </IssuesList>
        }
       
      </div>
     
     );
  }

  
}
