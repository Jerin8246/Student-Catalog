import React, { useState, useRef, useEffect } from "react";

const AddStudent = () => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [error, setError] = useState(""); // Error state
  const [student, setStudent] = useState({
    studentID: "",
    dateOfBirth: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    emergencyContact: "",
    email: "",
    major: "",
    isEnrolled: true,
    gpa: "",
    enrollmentYear: "",
  });

  const formRef = useRef(null);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prevStudent) => ({ ...prevStudent, [name]: value }));
  };

  // Reset form fields
  const resetForm = () => {
    setStudent({
      studentID: "",
      dateOfBirth: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      emergencyContact: "",
      email: "",
      major: "",
      isEnrolled: true,
      gpa: "",
      enrollmentYear: "",
    });
    setError(""); // Clear any errors
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (
      !student.studentID ||
      !student.dateOfBirth ||
      !student.firstName ||
      !student.lastName ||
      !student.phoneNumber ||
      !student.address ||
      !student.emergencyContact ||
      !student.email ||
      !student.major ||
      !student.gpa ||
      !student.enrollmentYear
    ) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Log outgoing payloads for debugging
      console.log("Submitting to /student:", {
        studentID: student.studentID,
        dateOfBirth: student.dateOfBirth,
        firstName: student.firstName,
        lastName: student.lastName,
        phoneNumber: student.phoneNumber,
        address: student.address,
        emergencyContact: student.emergencyContact,
        email: student.email,
      });

      // Add student to the "student" table
      const studentResponse = await fetch("http://localhost:8000/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentID: student.studentID,
          dateOfBirth: student.dateOfBirth,
          firstName: student.firstName,
          lastName: student.lastName,
          phoneNumber: student.phoneNumber,
          address: student.address,
          emergencyContact: student.emergencyContact,
          email: student.email,
        }),
      });

      if (!studentResponse.ok) {
        const errorData = await studentResponse.json();
        console.error("Error from /student:", errorData);
        throw new Error(errorData.error || "Failed to add student.");
      }

      console.log("Submitting to /student_information:", {
        studentID: student.studentID,
        major: student.major,
        isEnrolled: student.isEnrolled,
        gpa: parseFloat(student.gpa),
        enrollmentYear: parseInt(student.enrollmentYear, 10),
      });

      // Add student information to the "student_information" table
      const studentInfoResponse = await fetch("http://localhost:8000/student_information", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentID: student.studentID,
          major: student.major,
          isEnrolled: student.isEnrolled,
          gpa: parseFloat(student.gpa),
          enrollmentYear: parseInt(student.enrollmentYear, 10),
        }),
      });

      if (!studentInfoResponse.ok) {
        const errorData = await studentInfoResponse.json();
        console.error("Error from /student_information:", errorData);
        throw new Error(errorData.error || "Failed to add student information.");
      }

      alert("Student and student information added successfully!");
      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error("Error adding student:", err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
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
      {/* Add Student Button */}
      <button
        onClick={() => setShowForm(true)}
        className="bg-purple-600 text-white px-4 py-2 rounded shadow-md hover:bg-purple-700 transition"
      >
        + Add Student
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
                Add a New Student
              </h2>

              {/* Validation Error */}
              {error && (
                <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">
                  {error}
                </div>
              )}

              {/* Student Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: "Student ID", name: "studentID", type: "text" },
                  { label: "Date of Birth", name: "dateOfBirth", type: "date" },
                  { label: "First Name", name: "firstName", type: "text" },
                  { label: "Last Name", name: "lastName", type: "text" },
                  { label: "Phone Number", name: "phoneNumber", type: "text" },
                  { label: "Address", name: "address", type: "text" },
                  { label: "Emergency Contact", name: "emergencyContact", type: "text" },
                  { label: "Email", name: "email", type: "email" },
                  { label: "Major", name: "major", type: "text" },
                  { label: "GPA", name: "gpa", type: "number" },
                  { label: "Enrollment Year", name: "enrollmentYear", type: "number" },
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
                      value={student[field.name]}
                      onChange={handleChange}
                      className="mt-1 w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 bg-white"
                      required
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  className={`w-full ${
                    loading ? "bg-gray-400" : "bg-purple-600"
                  } text-white px-4 py-2 rounded shadow-md hover:bg-purple-700 transition mt-6`}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddStudent;
