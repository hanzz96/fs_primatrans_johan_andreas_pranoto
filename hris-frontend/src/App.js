import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Pages
function Home() {
  return <h2 className="text-2xl font-bold">Welcome to HRIS</h2>;
}

function Employees() {
  return <h2 className="text-xl font-semibold">Employees Page</h2>;
}

function WorkShifts() {
  return <h2 className="text-xl font-semibold">Work Shifts Page</h2>;
}

function Attendances() {
  return <h2 className="text-xl font-semibold">Attendances Page</h2>;
}

function App() {
  const [open, setOpen] = useState(false);

  return (
    <Router>
      <div className="flex h-screen">
        {/* Sidebar */}
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

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {/* Header with mobile menu button */}
          <header className="bg-slate-100 shadow p-4 flex items-center justify-between md:hidden">
            <h1 className="font-bold text-lg">HRIS</h1>
            <button
              className="bg-slate-800 text-white px-3 py-2 rounded"
              onClick={() => setOpen(!open)}
            >
              ☰
            </button>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/workshifts" element={<WorkShifts />} />
              <Route path="/attendances" element={<Attendances />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
