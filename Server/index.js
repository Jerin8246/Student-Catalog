const express = require("express");
const app = express();
const cors = require('cors');
const pool = require("./db")


//middleware
app.use(cors());
app.use(express.json()); //req.body

//Create a student
// Create a student
app.post("/student", async (req, res) => {
  try {
    const { dateOfBirth, firstName, lastName, phoneNumber, address, emergencyContact, email } = req.body;

    const newStudent = await pool.query(
      "INSERT INTO student (dateOfBirth, firstName, lastName, phoneNumber, address, emergencyContact, email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [dateOfBirth, firstName, lastName, phoneNumber, address, emergencyContact, email]
    );

    res.json(newStudent.rows[0]);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" }); // Send an error response
  }
});


//get all student

app.get("/student", async (req, res) => {

  try {
    
   

  } catch (error) {
    console.error(error.message)
  }
});


//get a student

//update a student


//delete a student





app.listen(8002, () => {
    console.log("server has started on port 8002");
  });
