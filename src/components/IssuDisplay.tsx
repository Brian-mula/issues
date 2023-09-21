import { GitHubIssueType } from "@/types/issueType";
import Rounded from "./rounded";

export default function IssuDisplay({ issue }: { issue: GitHubIssueType }) {
  return (
    <div className="bg-gray-500 px-3 py-4 flex items-center justify-between border border-t border-gray-300">
      <div className="flex items-start">
        <input type="checkbox" />
        <Rounded />
        <div>
          <h1>{issue.title}</h1>
          <p className="text-xs">
            #{issue.number} Opened on {issue.title.slice(0, 6)} By{" "}
            {issue.user.login}
          </p>
        </div>
      </div>
      <div className="flex items-center">
        {
            issue.assignee && <img src={issue.assignee.avater_url} alt={issue.assignee.login} className="h-12 w-12 rounded-full" />
        }
        <div></div>
      </div>
    </div>
  );
}
