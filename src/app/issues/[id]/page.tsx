"use client";

import IssueAssignees from "@/components/issue_assinees";
import IssueLabels from "@/components/issue_labels";
import IssueMileStones from "@/components/issue_milestone";
import IssueProjects from "@/components/issue_projects";
import LockModal from "@/components/lock_modal";
import OnError from "@/components/onerror";
import Rounded from "@/components/rounded";
import SkeletonArticle from "@/skeletons/SkeletonIssue";
import { GitHubIssueType } from "@/types/issueType";
import { months } from "@/types/months";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Octokit } from "octokit";
import { useEffect, useReducer, useState } from "react";

const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});
const tabs = ["Write", "Preview"];

const initialState = {
  issue: {} as GitHubIssueType,
  status: "loading",
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "issueReceived":
      return {
        ...state,
        issue: action.payload,
        status: "ready",
      };
    case "err":
      return {
        ...state,
        status: "error",
      };
    default:
      return state;
  }
};

export default function IssueDetails() {
  const [{ issue, status }, dispatch] = useReducer(reducer, initialState);
  const [activeTab, setActiveTab] = useState(0);
  const [content, setcontent] = useState("");
  const params = useParams();
  useEffect(() => {
    octokit
      .request("GET /repos/{owner}/{repo}/issues/{issue_number}", {
        owner: "Taquana-LTD",
        repo: "nganya-apis",
        issue_number: params.id as unknown as number,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      })
      .then((res) => dispatch({ type: "issueReceived", payload: res.data }))
      .catch((err) => dispatch({ type: "err" }));
  }, []);

  const [assignees, setAssignees] = useState<string[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  const handleAssignees = (name: string) => {
    setAssignees((val) => [...val, name]);
  };
  const handleLabels = (name: string) => {
    setLabels((val) => [...val, name]);
  };
  const [isActive, setIsActive] = useState(false);

  const [title, setTitle] = useState("");
  const handleActive = () => {
    setIsActive((val) => !val);
    setTitle(issue.title);
  };

  const date = new Date(issue.created_at);
  const year = date.getFullYear();
  const month = date.getHours();
  const day = date.getDay();

  const handleCloseIssue=async(e:any)=>{
    e.preventDefault()
    await octokit.request('PATCH /repos/{owner}/{repo}/issues/{issue_number}', {
      owner: 'Taquana-LTD',
      repo: 'nganya-apis',
      issue_number: issue.number,
      title: title,
      body: '',
      assignees: assignees,
      
      state: 'closed',
      labels: labels,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
  }
  
  const handleUpdateIssue=async(e:any)=>{
    e.preventDefault()
    await octokit.request('PATCH /repos/{owner}/{repo}/issues/{issue_number}', {
      owner: 'Taquana-LTD',
      repo: 'nganya-apis',
      issue_number: issue.number,
      title: title,
      body: '',
      assignees: assignees,
      
      state: 'open',
      labels: labels,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    setIsActive((val) => !val);
    console.log('done')
  }

  return (
    <>
      {status === "loading" && [1,2,3,4,5].map((n) => <SkeletonArticle key={n}/>)}
      {status === "error" && <OnError />}
      {status === "ready" && (
        <div className="min-h-screen px-20 bg-gray-800 ">
          {isActive && (
            <div className=" flex pt-4">
              <div className="w-2/3">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  className="w-full p-2 border bg-gray-600 rounded-md outline-blue-500 text-white"
                />
              </div>
              
              <div className="flex items-center pl-6">
                <button
                  onClick={handleUpdateIssue}
                  type="button"
                  className="bg-green-600 px-3 py-2 rounded-md text-gray-300 hover:bg-green-500"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleActive}
                  className=" btn btn-sm text-gray-800 ml-3"
                >
                  Cancel
                </button>
              </div>
             
            </div>
          )}
          <div className="mt-2 py-3 flex justify-between items-start border-b border-b-gray-300">
            <div>
              <h1 className="text-xl font-bold">
                {issue.title}{" "}
                <span className="text-gray-500">#{issue.number}</span>
              </h1>
              <div className="flex items-center">
                <div className="flex bg-green-500 py-2 px-2 rounded-full w-24 items-center mt-2">
                  <Rounded /> <span className="text-white">{issue.state}</span>
                </div>
                <p className="px-2">
                  {issue.user.login} opened this on {day} {months[month]} {year}
                </p>
                <p>{issue.comments} comments</p>
              </div>
            </div>
            <div className="flex items-center">
              {!isActive && (
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={handleActive}
                    className="bg-green-600 px-3 py-2 rounded-md text-gray-300 hover:bg-green-500"
                  >
                    Edit
                  </button>
                  <Link
                    href={`/issues/new`}
                    
                    className="bg-green-600 px-3 py-2 rounded-md text-gray-300 hover:bg-green-500 ml-3"
                  >
                    New Issue
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="block md:flex ">
            <div className="w-full md:w-2/3 mt-4 border border-blue-300">
              <div className="flex justify-between border border-blue-300 py-1 px-2 w-full">
                <p>
                  {issue.user.login} Commented on {day} {months[month]} {year}
                </p>
                <div className="border border-blue-500 px-1 py-1 rounded-full text-white/40">
                  owner
                </div>
              </div>
              <div className="w-full py-10 px-2 bg-gray-900">
                <p>
                  {issue.body ? `${issue.body}` : "No description provided"}
                </p>
              </div>
              <form className="full bg-gray-800 border border-gray-300 rounded-md p-3">
                <div className="tabs mt-3">
                  {tabs.map((tab, index) => (
                    <a
                      key={index}
                      className={`tab tab-lifted ${
                        activeTab === index ? "tab-active" : ""
                      }`}
                      onClick={() => setActiveTab(index)}
                    >
                      {tab}
                    </a>
                  ))}
                </div>
                {activeTab === 0 && (
                  <div>
                    <textarea
                      value={content}
                      onChange={(e) => setcontent(e.target.value)}
                      className="w-full p-2 border bg-gray-800 rounded-md outline-blue-500 text-white mt-3"
                      placeholder="Leave a comment"
                      rows={6}
                    ></textarea>
                  </div>
                )}
                <div className="flex justify-end items-center">
                <button
                    type="submit"
                    
                    className="btn bg-green-600 btn-sm text-white hover:bg-green-500 mx-2"
                  >
                    Close issue
                  </button>
                  <button
                    type="submit"
                    className="btn bg-green-600 btn-sm text-white hover:bg-green-500"
                  >
                    comment
                  </button>
                </div>
              </form>
            </div>
            <div className="px-4 pt-2 w-96">
              <div className="border-b border-gray-500 w-full py-2">
                <IssueAssignees onAssignee={handleAssignees} />
                <p>{issue.assignee ? `${issue.assignee.login}` : "No one"} </p>
              </div>
              <div className="border-b border-gray-500 w-full py-2">
                <IssueLabels onAssignLabel={handleLabels} />
                <p>
                  {issue.labels.length === 0 ? `None yet` : `${issue.labels}`}{" "}
                </p>
              </div>
              <div className="border-b border-gray-500 w-full py-2">
                <IssueProjects />
                <p>
                  {issue.labels.length === 0 ? `None yet` : `${issue.labels}`}{" "}
                </p>
              </div>
              <div className="border-b border-gray-500 w-full py-2">
                <IssueMileStones />
                <p>
                  {issue.milestone ? `${issue.milestone}` : `No milestone`}{" "}
                </p>
              </div>
              <div className=" w-full py-4">
                
                <LockModal issue={issue} />
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
