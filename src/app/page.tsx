"use client";

import IssuDisplay from "@/components/IssuDisplay";
import IssueBar from "@/components/IssueBar";
import ClearSearch from "@/components/clear_search";
import NoItemsFound from "@/components/empty";
import IssuesList from "@/components/issuesList";
import OnError from "@/components/onerror";
import TopNavSection from "@/components/topNav";
import SkeletonArticle from "@/skeletons/SkeletonIssue";
import { GitHubIssueType } from "@/types/issueType";
import { Octokit } from "@octokit/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useReducer, useState } from "react";

const initialState = {
  issues: [] as GitHubIssueType[],
  memberIssues: [] as GitHubIssueType[],
  status: "loading",
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "issuesReceived":
      return {
        ...state,
        issues: action.payload,
        status: "ready",
      };
    case "err":
      return {
        ...state,
        status: "error",
      };
    case "author":
      return {
        ...state,
        memberIssues: action.payload,
        status: "searching",
      };
    default:
      return state;
  }
};

export default function Home() {
  const [{ issues, memberIssues, status }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    const octokit = new Octokit({
      auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
    });
    octokit
      .request("GET /repos/{owner}/{repo}/issues", {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
        owner: "Taquana-LTD",
        repo: "nganya-apis",
        per_page: 100,
        query: {
          state: "all",
          
        }
      })
      .then((res) => dispatch({ type: "issuesReceived", payload: res.data }))
      .catch((err) => dispatch({ type: "err" }));
  }, []);
  // const totalIssues = issues.length;
  console.log(issues);
  const openIssues = issues.filter(
    (issue: GitHubIssueType) => issue.state === "open"
  );
  const totalIssues = openIssues.length;
  const filteredIssues = memberIssues.length;
  const brianIssues = (name: string) => {
    const issu = issues.filter(
      (issue: GitHubIssueType) => issue.assignee?.login === name
    );
    dispatch({ type: "author", payload: issu });
  };

  const handleClearSearch = () => {
    dispatch({ type: "issuesReceived", payload: issues });
  };
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const pages = Math.ceil(totalIssues / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = issues.slice(indexOfFirstRecord, indexOfLastRecord);
  const numbers = [...Array(pages + 1).keys()].slice(1);
  const handleNextPage = () => {
    if (currentPage < pages) {
      setCurrentPage(currentPage + 1);
    }
  }
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  const { data, status: level } = useSession();
  const router = useRouter();
  if (level === "unauthenticated") {
    router.push("/authentication/login");
  } else {
    return (
      <div
        className={`px-20 pt-5 pb-20 bg-gray-700 h-fit w-full min-h-screen`}
      >
        {status === "loading" && [1,2,3,4,5].map((n) => <SkeletonArticle key={n} />)}
        {status === "error" && <OnError />}
        {status === "ready" && (
          <>
            <TopNavSection />
            <IssuesList>
              <IssueBar totalIssues={totalIssues} onFilter={brianIssues} />
              {currentRecords.map((issue: GitHubIssueType) => (
                <IssuDisplay issue={issue} key={issue.id} />
              ))}
            </IssuesList>
            <div className="flex justify-center items-center mt-4">
              {currentPage >1 && <button type="button" className="btn btn-success btn-sm" onClick={handlePrevPage}>Prev</button>}
              <div className="join mx-2">
                {
                  numbers.map((number) => (
                    <button
                      key={number}
                      className={`join-item btn ${currentPage === number ? "btn-active" : ""}`}
                      onClick={() => setCurrentPage(number)}
                    >
                      {number}
                    </button>
                  ))
                }
               
              </div>
              {currentPage < pages && <button type="button" className="btn btn-success btn-sm" onClick={handleNextPage} >Next</button>}
            </div>
          </>
        )}

        {status === "searching" && (
          <>
            <ClearSearch handleClearSearch={handleClearSearch} />
            <IssuesList>
              <IssueBar totalIssues={filteredIssues} onFilter={brianIssues} />
              {memberIssues.length === 0 && <NoItemsFound />}
              {memberIssues.map((issue: GitHubIssueType) => (
                <IssuDisplay issue={issue} key={issue.id} />
              ))}
            </IssuesList>
          </>
        )}
      </div>
    );
  }
}
