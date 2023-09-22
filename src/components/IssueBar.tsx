import DropDown from './dropdown'
import Rounded from './rounded'

export default function IssueBar({totalIssues,onFilter}:{totalIssues:number,onFilter:Function}) {
  return (
    <div className="bg-gray-600 flex justify-between items-center px-3 py-4 rounded-md">
          {/* number of issues section */}
          <div className="flex items-center">
            <input type="checkbox" />
            <Rounded />
            <p>{totalIssues} Open</p>
          </div>
          <div className="flex items-center">
            <DropDown title='Author' onFilter={onFilter} />
            <p>Label</p>
            <p className="px-2">Projects</p>
            <p>Milestones</p>
            <p className="px-2">Assignee</p>
            <p>Sort</p>

          </div>
        </div>
  )
}
