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





//update a student


//delete a student





app.listen(8000, () => {
    console.log("server has started on port 8000");
  });
