import React from "react";
import { Link } from "react-router-dom";

function Sidebar({ open }) {
  return (
    <div
      className={`fixed md:static z-20 bg-slate-800 text-white w-64 h-full p-5 transition-transform transform ${
        open ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <h1 className="text-xl font-bold mb-6">HRIS Menu</h1>
      <ul className="space-y-3">
        <li>
          <Link to="/" className="block hover:bg-slate-700 rounded p-2">
            🏠 Home
          </Link>
        </li>
        <li>
          <Link to="/employees" className="block hover:bg-slate-700 rounded p-2">
            👨‍💼 Employees
          </Link>
        </li>
        <li>
          <Link to="/workshifts" className="block hover:bg-slate-700 rounded p-2">
            📅 Work Shifts
          </Link>
        </li>
        <li>
          <Link to="/attendances" className="block hover:bg-slate-700 rounded p-2">
            📝 Attendances
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
