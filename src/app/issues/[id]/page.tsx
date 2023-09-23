"use client";

import Loader from "@/components/loader";
import OnError from "@/components/onerror";
import Rounded from "@/components/rounded";
import { GitHubIssueType } from "@/types/issueType";
import { months } from "@/types/months";
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
  const date = new Date(issue.created_at);
  const year = date.getFullYear();
  const month = date.getHours();
  const day = date.getDay();
  console.log(issue)
  return (
    <>
      {status === "loading" && <Loader />}
      {status === "error" && <OnError />}
      {status === "ready" && (
        <div className="h-[calc(100vh-4rem)] px-20 bg-gray-800 ">
          <div className="mt-2 py-3 flex justify-between items-start border-b border-b-gray-300">
            <div>
              <h1 className="text-xl font-bold">
                {issue.title} <span className="text-gray-500">#{issue.number}</span>
              </h1>
              <div className="flex items-center">
                <div className="flex bg-green-500 py-2 px-2 rounded-full w-24 items-center mt-2">
                  <Rounded /> <span className="text-white">{issue.state}</span>
                </div>
                <p className="px-2">{issue.user.login} opened this on {day} {months[month]} {year}</p>
                <p>{issue.comments} comments</p>
              </div>
            </div>
            <div className="flex items-center">
              <button className="bg-green-600 px-3 py-2 rounded-md text-gray-300 hover:bg-green-500">
                Edit
              </button>
              <button className="bg-green-600 px-3 py-2 rounded-md text-gray-300 hover:bg-green-500 ml-3">
                New Issue
              </button>
            </div>
          </div>
          <div className="flex">
            <div className="w-2/3 mt-4 border border-blue-600">
              <div className="flex justify-between border border-blue-600 py-1 px-2 w-full">
                <p>{issue.user.login} Commented on {day} {months[month]} {year}</p>
                <div className="border border-blue-500 px-1 py-1 rounded-full text-white/40">
                  owner
                </div>
              </div>
              <div className="w-full py-10 px-2 bg-gray-900">
                <p>{issue.body ? `${issue.body}` :'No description provided'}</p>
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
                    className="btn bg-green-600 btn-sm text-white hover:bg-green-500"
                  >
                    Submit new issue
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
