import { GitHubIssueType } from "@/types/issueType";
import { months } from "@/types/months";
import Image from "next/image";
import Link from "next/link";
import Rounded from "./rounded";

// const months = [
//   "Jan",
//   "Feb",
//   "Mar",
//   "April",
//   "May",
//   "June",
//   "July ",
//   "Aug",
//   "Sept",
//   "Oct",
//   "Nov",
//   "Dec",
// ];


export default function IssuDisplay({ issue }: { issue: GitHubIssueType }) {
  const date = new Date(issue.created_at);
  const month = date.getHours();
  const day = date.getDay();

  return (
    <div  className="bg-gray-700 px-3 py-4 flex items-center justify-between border border-t border-gray-400 hover:bg-gray-600">
      <div className="flex items-start">
        <input type="checkbox" />
        <Rounded />
        <div>

          <Link href={`/issues/${encodeURIComponent(issue.number)}`} className="hover:text-blue-500 text-lg">{issue.title}</Link>
          <p className="text-xs">
            #{issue.number} Opened on {day} {months[month]} By{" "}
            {issue.user.login}
          </p>
        </div>
      </div>
      <div className="flex items-center">
        {
            issue.assignee &&  <div className="tooltip" data-tip={`Assigned to ${issue.assignee.login}`} >
              <Image src={issue.assignee.avatar_url} alt="Picture of the author" width={30} height={30} className="rounded-full" />
            </div>
            
        }
        <div></div>
      </div>
    </div>
  );
}
