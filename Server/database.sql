CREATE DATABASE studentcat;


CREATE TABLE student (
    studentID INTEGER PRIMARY KEY,
    dateOfBirth DATE,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    phoneNumber BIGINT,
    address VARCHAR(255),
    emergencyContact VARCHAR(100),
    email VARCHAR(100)
);

CREATE TABLE Student_Information (
    studentID INTEGER PRIMARY KEY,
    major VARCHAR(100),
    isEnrolled BOOLEAN,
    gpa DECIMAL(3, 2),
    enrollmentYear INTEGER,
    FOREIGN KEY (studentID) REFERENCES Student(studentID)
);