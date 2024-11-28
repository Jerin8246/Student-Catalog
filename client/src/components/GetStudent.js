import React, { useState } from "react";

const GetStudent = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");
  const [studentInfo, setStudentInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const searchStudent = async () => {
    try {
      // Trim spaces from firstName and lastName
      const trimmedFirstName = firstName.trim();
      const trimmedLastName = lastName.trim();

      if (!trimmedFirstName || !trimmedLastName) {
        setError("Both first name and last name are required.");
        setStudent(null);
        return;
      }

      // Encode for URL safety
      const encodedFirstName = encodeURIComponent(trimmedFirstName);
      const encodedLastName = encodeURIComponent(trimmedLastName);

      const response = await fetch(
        `http://localhost:8000/student/${encodedFirstName}/${encodedLastName}`
      );

      if (response.ok) {
        const data = await response.json();
        setStudent(data);
        setError("");
      } else if (response.status === 404) {
        setError("Student not found.");
        setStudent(null);
      } else {
        setError("An error occurred while fetching the student.");
        setStudent(null);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred while fetching the student.");
      setStudent(null);
    }
  };

  const deleteStudent = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/student/${student.studentid}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        alert("Student deleted successfully!");
        setStudent(null);
        setStudentInfo(null);
      } else {
        alert("Failed to delete student.");
      }
    } catch (err) {
      console.error("Error deleting student:", err.message);
    }
  };

  const getStudentInfo = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/student_information/${student.studentid}`
      );
      if (response.ok) {
        const data = await response.json();
        setStudentInfo({
          dateOfBirth: data.dateofbirth || "",
          firstName: data.firstname || "",
          lastName: data.lastname || "",
          phoneNumber: data.phonenumber || "",
          address: data.address || "",
          emergencyContact: data.emergencycontact || "",
          email: data.email || "",
          major: data.major || "",
          isEnrolled: data.isenrolled || false,
          gpa: parseFloat(data.gpa) || 0,
          enrollmentYear: data.enrollmentyear || "",
        });
        setIsEditing(false);
      } else {
        alert("Failed to fetch student information.");
      }
    } catch (err) {
      console.error("Error fetching student information:", err.message);
    }
  };

  const validateStudentInfo = () => {
    return (
      studentInfo.dateOfBirth &&
      studentInfo.firstName &&
      studentInfo.lastName &&
      studentInfo.phoneNumber &&
      studentInfo.address &&
      studentInfo.emergencyContact &&
      studentInfo.email &&
      studentInfo.major &&
      studentInfo.gpa &&
      studentInfo.enrollmentYear
    );
  };

  const updateStudentInfo = async () => {
    if (!validateStudentInfo()) {
      alert("All fields are required.");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8000/student/${student.studentid}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(studentInfo),
        }
      );
      if (response.ok) {
        alert("Student information updated successfully!");
        setIsEditing(false);
      } else {
        alert("Failed to update student information.");
      }
    } catch (err) {
      console.error("Error updating student information:", err.message);
    }
  };

  return (
    <div className="bg-white shadow-md rounded p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Search Student</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value.trimStart())}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter first name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value.trimStart())}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter last name"
          />
        </div>
        <button
          onClick={searchStudent}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
        >
          Search
        </button>
      </div>

      {student && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow-md">
          <h3 className="font-bold text-lg mb-2">{`${student.firstname} ${student.lastname}`}</h3>
          <p className="text-sm text-gray-600">Student ID: {student.studentid}</p>
          <p className="text-sm text-gray-600">Email: {student.email}</p>
          <p className="text-sm text-gray-600">Phone: {student.phonenumber}</p>
          <p className="text-sm text-gray-600">Address: {student.address}</p>

          <div className="mt-4 flex gap-4">
            <button
              onClick={deleteStudent}
              className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition"
            >
              Delete
            </button>
            <button
              onClick={getStudentInfo}
              className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
            >
              Get Student Info
            </button>
          </div>
        </div>
      )}

      {studentInfo && (
        <div className="mt-6 bg-white shadow-md rounded p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Student Info</h2>
          <form className="space-y-4">
            {Object.entries(studentInfo).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1 capitalize">
                  {key}:
                </label>
                <input
                  type={key === "gpa" || key === "enrollmentYear" ? "number" : "text"}
                  value={value}
                  onChange={(e) =>
                    setStudentInfo({ ...studentInfo, [key]: e.target.value })
                  }
                  disabled={!isEditing}
                  className={`w-full border ${
                    isEditing ? "border-gray-300" : "border-gray-200"
                  } p-2 rounded focus:outline-none ${
                    isEditing ? "focus:ring-2 focus:ring-green-500" : ""
                  }`}
                />
              </div>
            ))}
            {isEditing && (
              <button
                type="button"
                onClick={updateStudentInfo}
                className="w-full bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
              >
                Save
              </button>
            )}
          </form>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition mt-4"
            >
              Edit
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-500 text-sm font-medium">{error}</div>
      )}
    </div>
  );
};

export default GetStudent;
