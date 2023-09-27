

import { MemberType } from "@/types/memberTypes";
import { Octokit } from "@octokit/core";
import { useEffect, useReducer } from "react";

const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});

const initialState = {
  members: [] as MemberType[],
  status: "loading",
};
const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "isready":
      return {
        ...state,
        members: action.payload,
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

export default function IssueAssignees({onAssignee}: { onAssignee:Function}) {
  const [{ members, status }, dispatch] = useReducer(reducer, initialState);

  

  useEffect(() => {
    octokit
      .request("GET /orgs/{org}/members", {
        org: "Taquana-LTD",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      })
      .then((res) => dispatch({ type: "isready", payload: res.data }))
      .catch((err) => dispatch({ type: "onError" }));
  },[]);
  console.log(members)
  return (
    <div>
      {status === "ready" && (
        <div className="dropdown dropdown-bottom dropdown-end">
          <label tabIndex={0} className="m-1 cursor-pointer">Assignees</label>
          <ul tabIndex={0} className="p-2 shadow menu dropdown-content z-[1] bg-gray-600 rounded-sm w-64 h-96 overflow-y-auto block">
            {
              members.map((member:MemberType) => <li key={member.avatar_url} className="p-2 hover:bg-gray-500">
                <div onClick={()=>onAssignee(member.login)} className="flex items-center">
                  <img src={member.avatar_url} alt="" className="rounded-full w-6 h-6"/>
                  <p className="px-2">{member.login}</p>
                </div>
              </li>)
            }
            
          </ul>
        </div>
      )}
    </div>
  );
}
