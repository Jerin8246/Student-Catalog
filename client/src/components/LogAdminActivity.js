import React, { useState, useRef, useEffect } from "react";

const LogAdminActivity = () => {
  const [showForm, setShowForm] = useState(false);
  const [logData, setLogData] = useState({
    logID: "",
    adminID: "",
    studentID: "",
    comments: "",
    action: "",
    changes: "",
    timestamp: "",
  });

  const formRef = useRef(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogData((prevLogData) => ({ ...prevLogData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/audit-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logData),
      });

      if (response.ok) {
        alert("Log added successfully!");
        setShowForm(false);
        setLogData({
          logID: "",
          adminID: "",
          studentID: "",
          comments: "",
          action: "",
          changes: "",
          timestamp: "",
        });
      } else {
        alert("Failed to add log.");
      }
    } catch (err) {
      console.error("Error adding log:", err.message);
      alert("An error occurred. Please try again.");
    }
  };

  // Handle click outside the form
  const handleClickOutside = (event) => {
    if (formRef.current && !formRef.current.contains(event.target)) {
      setShowForm(false);
    }
  };

  useEffect(() => {
    if (showForm) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showForm]);

  return (
    <>
      {/* Button to show the form */}
      <button
        onClick={() => setShowForm(true)}
        className="bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600 transition"
      >
        Log Admin Activity
      </button>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div
            ref={formRef}
            className="relative bg-white rounded-lg shadow-lg w-full max-w-md m-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              {/* Close Button */}
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
              >
                &times;
              </button>

              {/* Form Title */}
              <h2 className="text-2xl font-bold mb-6 pt-2 text-center text-gray-900">
                Log Admin Activity
              </h2>

              {/* Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: "Log ID", name: "logID", type: "text" },
                  { label: "Admin ID", name: "adminID", type: "text" },
                  { label: "Student ID", name: "studentID", type: "text" },
                  { label: "Comments", name: "comments", type: "text" },
                  { label: "Action", name: "action", type: "text" },
                  { label: "Changes", name: "changes", type: "text" },
                  { label: "Timestamp", name: "timestamp", type: "datetime-local" },
                ].map((field, index) => (
                  <div key={index} className="flex flex-col">
                    <label
                      htmlFor={field.name}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {field.label}
                    </label>
                    <input
                      id={field.name}
                      type={field.type}
                      name={field.name}
                      value={logData[field.name]}
                      onChange={handleChange}
                      className="mt-1 w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 bg-white"
                      required
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600 transition mt-6"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogAdminActivity;
