"use client";

import IssuDisplay from "@/components/IssuDisplay";
import IssueBar from "@/components/IssueBar";
import IssuesList from "@/components/issuesList";
import Loader from "@/components/loader";
import { GitHubIssueType } from "@/types/issueType";
import { Octokit } from "@octokit/core";
import { useEffect, useReducer } from "react";

const initialState = {
  issues: [] as GitHubIssueType[],
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
    default:
      return state
  }
}

export default function Home() {

  const [{issues,status},dispatch]=useReducer(reducer,initialState)

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
    }).then((res) => dispatch({type:'issuesReceived',payload:res.data})).catch((err) => dispatch({type:'err'}))
  },[])
  const totalIssues = issues.length;
  console.log(issues);
  return (
    <div className={`p-20 ${totalIssues < 10 ? 'h-screen' : 'h-content'}`}>
      {status==='loading' && <Loader/>}
      {
        status==='ready' && <IssuesList>
        <IssueBar totalIssues={totalIssues} />
        {issues.map((issue:GitHubIssueType) => <IssuDisplay issue={issue}  key={issue.id} />)}
        </IssuesList>
      }
     
    </div>
  );
}
