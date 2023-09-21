
export default function DropDown() {
  return (
    <div>
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn m-1">
          Click
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <a>Item 1</a>
          </li>
          <li>
            <a>Item 2</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
