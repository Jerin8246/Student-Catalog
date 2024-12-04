# Student Catalog Management System

This project is a **Student Catalog Management System** that allows university administration to manage student records. The system enables creating, updating, retrieving, and deleting student information and provides detailed logging of administrative actions for audit purposes.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Client-Side Application](#client-side-application)
- [Backup and Restore](#backup-and-restore)
- [License](#license)

---

## Project Overview

The **Student Catalog Management System** facilitates the following functionalities:
- Create, update, delete, and fetch student records.
- Log administrative activities for auditing purposes.
- Manage administrator details and privileges.

---

## Features

- **CRUD Operations**: Perform create, read, update, and delete operations on student and administrator data.
- **Detailed Student Information**: Manage student academic details like major, GPA, and enrollment year.
- **Audit Logging**: Track changes and actions performed by administrators.
- **Relational Database**: Ensure data integrity through foreign key relationships.

---

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React.js
- **Database**: PostgreSQL
- **Middleware**: `pg` for database interactions, `cors` for handling cross-origin requests.

---

## Database Schema

### Tables
1. **Student**: Stores general student information.
2. **Student_Information**: Stores academic details of students.
3. **Administrator**: Stores administrator credentials and activity logs.
4. **AuditLog_Logs**: Stores logs of administrative actions for audit purposes.

---

## Setup Instructions

### Prerequisites
1. **Node.js** (v14 or later)
2. **PostgreSQL** (v12 or later)
3. **NPM** (v6 or later)

### Steps
1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd <repository_directory>

2. Install dependencies:

    npm install

3. Set up the PostgreSQL database:

    Create a database named studentcat.
    Import the backup file

    pg_restore -U studentcat -d studentcat studentcat_backup.dump

4. Start the server:

    cd Server
    nodemon index.js

5. Set up the client:
    cd client
    npm install
    npm start

6. Access the application at:
    Backend: http://localhost:8000
    Frontend: http://localhost:3000


# API Endpoints

## Student Endpoints

- **Create Student**: `POST /student`
- **Get All Students**: `GET /student`
- **Get Student by Name**: `GET /student/:firstName/:lastName`
- **Get Detailed Student Info**: `GET /student_information/:studentID`
- **Update Student**: `PUT /student/:studentID`
- **Delete Student**: `DELETE /student/:studentID`

---

## Administrator Endpoints

- **Create Administrator**: `POST /administrator`

---

## Audit Log Endpoints

- **Add Log**: `POST /audit-log`
- **Get All Logs**: `GET /audit-logs`

---

## Client-Side Application

The client-side React application provides an interface to interact with the backend APIs. It includes:
- Forms for creating and updating records.
- Tables for viewing data.
- Controls for managing the database.

---

## Backup and Restore

### To back up the database:

pg_dump -U <your_postgres_user> -Fc studentcat > studentcat_backup.dump

### To restore the database:

createdb -U <your_postgres_user> studentcat

pg_restore -U <your_postgres_user> -d studentcat -v studentcat_backup.dump
