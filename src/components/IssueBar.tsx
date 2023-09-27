import AssigneeDropdown from './assignee_dropdown'
import DropDown from './dropdown'
import LabelDropdown from './labels_dropdown'
import Rounded from './rounded'

export default function IssueBar({totalIssues,onFilter}:{totalIssues:number,onFilter:Function}) {
  return (
    <div className="bg-gray-600 block md:flex md:justify-between md:items-center px-3 py-4 rounded-md">
          {/* number of issues section */}
          <div className="flex items-center">
            <input type="checkbox" />
            <Rounded />
            <p className=''>{totalIssues} Open</p>
          </div>
          <div className="flex items-center">
            <DropDown title='Author' onFilter={onFilter} />
            <LabelDropdown title='Labels' />
            <p className="px-2">Projects</p>
            <p>Milestones</p>
            <AssigneeDropdown title='Assignee' onFilter={onFilter} />
            <p>Sort</p>

          </div>
        </div>
  )
}
