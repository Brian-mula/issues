import { GitHubIssueType } from "@/types/issueType";
import { Octokit } from "octokit";

import { useRef, useState } from "react";

type PostStatus = "off-topic"| "too heated" | "spam" | "resolved" | "Choose Topic";

const reasons = [
  'Choose Topic',
  'off-topic',
  'too heated',
  'spam',
  "resolved",

]
const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
})

export default function LockModal({issue}:{issue:GitHubIssueType}) {
  const lockIssueModal = useRef<HTMLDialogElement>(null);
  const showModal = () => {
    if (lockIssueModal.current) {
      lockIssueModal.current.showModal();
    }
  };
  const closeModal = () => {
    if (lockIssueModal.current) {
      lockIssueModal.current.close();
    }
  };

  const [selectedReason, setSelectedReason] = useState(reasons[0])
  const handleLockIssue = async() => {
    if(selectedReason === reasons[0]) return
    const reason = selectedReason === reasons[1] ? 'off-topic' : selectedReason === reasons[2] ? 'too heated' : selectedReason === reasons[3] ? 'spam' : 'resolved'
    await octokit.request('PUT /repos/{owner}/{repo}/issues/{issue_number}/lock', {
      owner: "Taquana-LTD",
      repo: "nganya-apis",
      issue_number: issue.number,
      lock_reason: reason,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    closeModal()
    console.log(reason)

  }
  const handleUnlockIssue = async() => {
    await octokit.request('DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock', {
      owner: "Taquana-LTD",
      repo: "nganya-apis",
      issue_number: issue.number,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    closeModal()
    console.log('unlocked')
  }

  return (
    <div>
     {
      issue.locked ? ( <label className="hover:text-blue-600 cursor-pointer" onClick={showModal}>
      Unlock this issue?
    </label>):( <label className="hover:text-blue-600 cursor-pointer" onClick={showModal}>
      Lock this issue?
    </label>)
     }
      <dialog ref={lockIssueModal} className="modal">
        <div className="modal-box bg-gray-700">
          <div className="flex justify-between">
          <h3 className=" text-lg">{issue.locked ? 'Unlock' : 'Lock'} Conversation on this issue?</h3>
          <span onClick={closeModal} className="cursor-pointer text-2xl">X</span>
          </div>
          {
            issue.locked ?(
              <>
              <p className="text-xs">
              Everyone will be able to comment on this issue once more.
          </p>
          <p className="text-xs">
          You can always lock this issue again in the future.
          </p>
          
          
          <div className=" w-full mt-3">
            <button type="button" onClick={handleUnlockIssue} className="btn btn-sm w-full">
              Unlock Conversion on this issue
            </button>
          </div>
              </>
            ):(<>
              <p className="text-xs">
            Other users can’t add new comments to this issue.
          </p>
          <p className="text-xs">
            You and other collaborators with access to this repository can still
            leave comments that others can see.
          </p>
          <p className="text-xs">
            You and other collaborators with access to this repository can still
            leave comments that others can see.
          </p>
          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="bg-gray-500 border border-gray-300 text-gray-100 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
          >
            {reasons.map((reason) => (
              <option key={reason} value={reason}>{reason}</option>
            ))}
          </select>
          <div className=" w-full mt-3">
            <button type="button" onClick={handleLockIssue} className="btn btn-sm w-full">
              Lock Conversion on this issue
            </button>
          </div>
              </>)
          }
        </div>
      </dialog>
    </div>
  );
}
