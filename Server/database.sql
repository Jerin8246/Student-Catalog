CREATE DATABASE student2;


CREATE TABLE student (
    studentID SERIAL PRIMARY KEY,
    dateOfBirth DATE,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    phoneNumber BIGINT,
    address VARCHAR(255),
    emergencyContact VARCHAR(100),
    email VARCHAR(100)
);