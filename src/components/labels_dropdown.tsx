import { LabelsType } from "@/types/labelsType";
import { Octokit } from "@octokit/core";
import { useEffect, useReducer } from "react";

const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});

const initialState = {
  labels: [] as LabelsType[],
  status: "loading",
};
const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "isready":
      return {
        ...state,
        labels: action.payload,
        status: "ready",
      };
    case "onError":
      return {
        ...state,
        status: "error",
      };
    default:
      return {
        ...state,
      };
  }
};

export default function LabelDropdown({ title }: { title: string }) {
  const [{ labels, status }, dispatch] = useReducer(reducer, initialState);

  // const handleMemberIssues = (login:string) => {
  //    issues.filter((issue:GitHubIssueType) => issue.assignee?.login === login)

  // }

  useEffect(() => {
    octokit
      .request("GET /repos/{owner}/{repo}/labels", {
        owner: "Taquana-LTD",
        repo: "nganya-apis",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      })
      .then((res) => dispatch({ type: "isready", payload: res.data }))
      .catch((err) => dispatch({ type: "onError" }));
  }, []);

  return (
    <div>
      {status === "loading" && <p>Loading...</p>}
      {status === "ready" && (
        <div className="dropdown dropdown-bottom ">
          <label tabIndex={0} className="m-1 cursor-pointer">
            {title}
          </label>
          <ul
            tabIndex={0}
            className="p-2 shadow menu dropdown-content z-[1] bg-gray-600 rounded-sm w-64 h-96 overflow-y-auto block"
          >
            {labels.map((label: LabelsType) => (
              <li className="bg-gray-600 hover:bg-gray-500 hover:text-white w-full block text-white" key={label.id}>
                <div className="flex items-start">
                  <div
                    className="rounded-full h-3 w-3"
                    style={{ backgroundColor: `#${label.color}` }}
                  ></div>
                  <div className="w-full">
                  <p className="px-2">{label.name}</p>
                  <p className="truncate px-2">{label.description}</p>
                  </div>
                </div>
                
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
