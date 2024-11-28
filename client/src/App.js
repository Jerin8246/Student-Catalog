import React, { useState } from "react";
import AddStudent from "./components/AddStudent";
import AllStudents from "./components/AllStudents";
import GetStudent from "./components/GetStudent";
import LogsSidebar from "./components/LogsSidebar";
import LogAdminActivity from "./components/LogAdminActivity";

function App() {
  const [showLogs, setShowLogs] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-green-600 text-white shadow-md z-10 relative">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold">Student Management System</h1>
          <div className="flex space-x-4">
            <AddStudent />
            <LogAdminActivity />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-12 space-y-12 z-0 relative">
        {/* Search Student Section */}
          <GetStudent />
       

        {/* All Students Section */}
          <AllStudents />
     
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4 relative">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Student Management System. All rights reserved.
        </p>
      </footer>

      {/* Sidebar Toggle */}
      <button
        onClick={() => setShowLogs(!showLogs)}
        className="fixed top-1/2 right-4 transform -translate-y-1/2 bg-blue-500 text-white px-6 py-3 rounded-l-full shadow-lg hover:bg-blue-600 transition z-20"
      >
        View Logs
      </button>

      {/* Logs Sidebar */}
      {showLogs && <LogsSidebar onClose={() => setShowLogs(false)} />}
    </div>
  );
}

export default App;
