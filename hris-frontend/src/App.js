import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-800 text-white transform transition-transform duration-300 ease-in-out
            ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:inset-0`}
        >
          <Sidebar />
        </aside>

        {/* Overlay for mobile when sidebar is open */}
        {open && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 md">
          {/* Header */}
          <header className="bg-slate-100 shadow p-4 flex items-center justify-between md:hidden">
            <h1 className="font-bold text-lg">HRIS</h1>
            <button
              className="bg-slate-800 text-white px-3 py-2 rounded"
              onClick={() => setOpen(!open)}
            >
              ☰
            </button>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-4 md overflow-auto bg-gray-50 min-w-0 max-w-screen-xl mx-auto w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/workshifts" element={<WorkShifts />} />
              <Route path="/attendances" element={<Attendances />} />
            </Routes>
          </main>
        </div>

        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
          draggable
        />
      </div>
    </Router>
  );
}

export default App;
