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

CREATE TABLE Administrator (
    adminID INTEGER PRIMARY KEY,
    username VARCHAR(100),
    email VARCHAR(100),
    role VARCHAR(50),
    department VARCHAR(100),
    privileges VARCHAR(255),
    lastLogin DATE,
    activityLog VARCHAR(255)
);



CREATE TABLE AuditLog_Logs (
    logID INTEGER PRIMARY KEY,
    adminID INTEGER,
    studentID INTEGER, -- Retained as a regular column
    comments VARCHAR(255),
    action VARCHAR(50),
    changes VARCHAR(255),
    timestamp TIMESTAMP,
    FOREIGN KEY (adminID) REFERENCES Administrator(adminID)
);