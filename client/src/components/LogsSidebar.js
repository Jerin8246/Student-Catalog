import React, { useEffect, useState } from "react";

const LogsSidebar = ({ onClose }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("http://localhost:8000/audit-logs");
        const data = await response.json();
        setLogs(data);
      } catch (err) {
        console.error("Error fetching logs:", err.message);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-end">
      <div className="bg-white w-96 h-full shadow-lg p-6 overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4 text-gray-700">Audit Logs</h2>

        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log.logid}
              className="bg-gray-100 rounded p-4 shadow-md space-y-2"
            >
              <p>
                <span className="font-bold">Log ID:</span> {log.logid}
              </p>
              <p>
                <span className="font-bold">Admin ID:</span> {log.adminid}
              </p>
              <p>
                <span className="font-bold">Action:</span> {log.action}
              </p>
              <p>
                <span className="font-bold">Changes:</span> {log.changes}
              </p>
              <p>
                <span className="font-bold">Comments:</span> {log.comments}
              </p>
              <p>
                <span className="font-bold">Timestamp:</span>{" "}
                {new Date(log.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogsSidebar;
