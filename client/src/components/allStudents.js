import React, { useEffect, useState } from "react";

const AllStudents = () => {
  const [students, setStudents] = useState([]);

  const getStudents = async () => {
    try {
      const response = await fetch("http://localhost:8000/student");
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      console.error("Error fetching students:", err.message);
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-700">All Students</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {students.map((student) => (
          <div
            key={student.studentid}
            className="bg-gray-100 hover:bg-gray-200 p-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            <h3 className="font-bold text-xl text-gray-800 mb-2">{`${student.firstname} ${student.lastname}`}</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-semibold">Student ID:</span> {student.studentid}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {student.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {student.phonenumber}
              </p>
              <p>
                <span className="font-semibold">Address:</span> {student.address}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllStudents;
