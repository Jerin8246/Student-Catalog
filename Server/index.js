const express = require("express");
const app = express();
const cors = require('cors');
const pool = require("./db")


//middleware
app.use(cors());
app.use(express.json()); //req.body


// Create a student
app.post("/student", async (req, res) => {
  try {
    const { studentID, dateOfBirth, firstName, lastName, phoneNumber, address, emergencyContact, email } = req.body;

    const newStudent = await pool.query(
      "INSERT INTO student (studentID, dateOfBirth, firstName, lastName, phoneNumber, address, emergencyContact, email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [studentID, dateOfBirth, firstName, lastName, phoneNumber, address, emergencyContact, email]
    );

    res.json(newStudent.rows[0]);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" }); // Send an error response
  }
});


// Create a student information record
app.post("/student_information", async (req, res) => {
  try {
    const { studentID, major, isEnrolled, gpa, enrollmentYear } = req.body;

    const newStudentInfo = await pool.query(
      "INSERT INTO student_information (studentID, major, isEnrolled, gpa, enrollmentYear) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [studentID, major, isEnrolled, gpa, enrollmentYear]
    );

    res.json(newStudentInfo.rows[0]);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" }); // Send an error response
  }
});


//get all student

app.get("/student", async (req, res) => {

  try {
    
   const allStudents = await pool.query("SELECT * FROM student")
   res.json(allStudents.rows);

  } catch (error) {
    console.error(error.message)
  }
});

// get student ifromation
app.get("/student_information", async (req, res) => {
  try {
    const allStudentInformation = await pool.query("SELECT * FROM Student_Information");
    res.json(allStudentInformation.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//get a student by first and last name

app.get("/student/:firstName/:lastName", async (req, res) => {
  try {
    const { firstName, lastName } = req.params; // Extract parameters from the URL

    const student = await pool.query(
      "SELECT * FROM Student WHERE firstName = $1 AND lastName = $2",
      [firstName, lastName]
    );

    if (student.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student.rows[0]); // Return the student record
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// get detailed information about a student using their studentID:
app.get("/student_information/:studentID", async (req, res) => {
  try {
    const { studentID } = req.params; // Extract studentID from URL parameters

    const studentInfo = await pool.query(
      `SELECT s.studentID, dateOfBirth, s.firstName, s.lastName, s.phoneNumber, s.address, s.emergencyContact, s.email, si.major, si.gpa, si.isEnrolled, si.enrollmentYear
       FROM Student s
       JOIN Student_Information si
       ON s.studentID = si.studentID
       WHERE s.studentID = $1`,
      [studentID]
    );

    if (studentInfo.rows.length === 0) {
      return res.status(404).json({ error: "Student information not found" });
    }

    res.json(studentInfo.rows[0]); // Return the detailed student information
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});






// Update a student's Information
app.put("/student/:studentID", async (req, res) => {
  try {
    const { studentID } = req.params; // Extract studentID from URL parameters
    const {
      dateOfBirth,
      firstName,
      lastName,
      phoneNumber,
      address,
      emergencyContact,
      email,
      major,
      isEnrolled,
      gpa,
      enrollmentYear
    } = req.body; // Extract fields from the request body

    // Validate input: Ensure all required fields are provided
    if (
      !dateOfBirth ||
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !address ||
      !emergencyContact ||
      !email ||
      !major ||
      isEnrolled === undefined ||
      !gpa ||
      !enrollmentYear
    ) {
      return res.status(400).json({ error: "All fields are required for updating the student and their information." });
    }

    // Start a transaction to update both tables
    await pool.query("BEGIN");

    // Update the Student table
    const updatedStudent = await pool.query(
      `UPDATE Student
       SET dateOfBirth = $1, firstName = $2, lastName = $3, phoneNumber = $4,
           address = $5, emergencyContact = $6, email = $7
       WHERE studentID = $8
       RETURNING *`,
      [dateOfBirth, firstName, lastName, phoneNumber, address, emergencyContact, email, studentID]
    );

    if (updatedStudent.rows.length === 0) {
      await pool.query("ROLLBACK");
      return res.status(404).json({ error: "Student not found" });
    }

    // Update the Student_Information table
    const updatedStudentInfo = await pool.query(
      `UPDATE Student_Information
       SET major = $1, isEnrolled = $2, gpa = $3, enrollmentYear = $4
       WHERE studentID = $5
       RETURNING *`,
      [major, isEnrolled, gpa, enrollmentYear, studentID]
    );

    if (updatedStudentInfo.rows.length === 0) {
      await pool.query("ROLLBACK");
      return res.status(404).json({ error: "Student information not found" });
    }

    // Commit the transaction
    await pool.query("COMMIT");

    // Combine and send the updated data as a response
    res.json({
      student: updatedStudent.rows[0],
      studentInformation: updatedStudentInfo.rows[0]
    });
  } catch (error) {
    // Rollback in case of any error
    await pool.query("ROLLBACK");
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});



// Delete a student record by studentID
// Delete a student record by studentID
app.delete("/student/:studentID", async (req, res) => {
  try {
    const { studentID } = req.params; // Extract studentID from URL parameters

    // Begin a transaction to delete both records
    await pool.query("BEGIN");

    // Delete dependent records in the Student_Information table
    const deleteStudentInfo = await pool.query(
      "DELETE FROM Student_Information WHERE studentID = $1 RETURNING *",
      [studentID]
    );

    // Delete the main student record in the Student table
    const deleteStudent = await pool.query(
      "DELETE FROM Student WHERE studentID = $1 RETURNING *",
      [studentID]
    );

    // If the student record is not found
    if (deleteStudent.rows.length === 0) {
      await pool.query("ROLLBACK");
      return res.status(404).json({ error: "Student not found" });
    }

    // Commit the transaction
    await pool.query("COMMIT");

    // Return success message with deleted records
    res.json({
      message: "Student and associated information deleted successfully",
      deletedStudent: deleteStudent.rows[0],
      deletedStudentInfo: deleteStudentInfo.rows
    });
  } catch (error) {
    // Rollback the transaction in case of an error
    await pool.query("ROLLBACK");
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Add administrator

app.post("/administrator", async (req, res) => {
  try {
    const { adminID, username, email, role, department, privileges, lastLogin, activityLog } = req.body;

    const newAdmin = await pool.query(
      "INSERT INTO Administrator (adminID, username, email, role, department, privileges, lastLogin, activityLog) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [adminID, username, email, role, department, privileges, lastLogin, activityLog]
    );

    res.json(newAdmin.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Post administrator log

app.post("/audit-log", async (req, res) => {
  try {
    const { logID, adminID, studentID, comments, action, changes, timestamp } = req.body;

    const newLog = await pool.query(
      "INSERT INTO AuditLog_Logs (logID, adminID, studentID, comments, action, changes, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [logID, adminID, studentID, comments, action, changes, timestamp]
    );

    res.json(newLog.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Get all logs

app.get("/audit-logs", async (req, res) => {
  try {
    const logs = await pool.query("SELECT * FROM AuditLog_Logs");

    res.json(logs.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});






app.listen(8000, () => {
    console.log("server has started on port 8000");
  });
