import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Sidebar from "./components/Sidebar";

// Pages
import Home from "./pages/Home";
import Employees from "./pages/Employees";
import WorkShifts from "./pages/Workshifts";
import Attendances from "./pages/Attendances";

function App() {
  const [open, setOpen] = useState(false);

  return (
    <Router>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar open={open} />

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
