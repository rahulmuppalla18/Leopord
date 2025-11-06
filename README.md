🏍️ Leopard Website: Full-Stack Contact Management System
This repository contains the complete codebase for the Leopard Pvt. Ltd. marketing website, featuring a dynamic contact form fully integrated
with an Oracle SQL database. This is a robust, production-ready implementation of a modern web application structure.

🚀 Project Overview
The primary goal of this project is to provide a clean, responsive front-end experience for users while securely collecting contact inquiries through a
Node.js backend. All submitted data is immediately stored in an Oracle Database, ensuring data persistence and integrity.

Key Features:

Responsive Frontend: Built with HTML5, CSS3, and Bootstrap for optimal viewing on all devices.

RESTful API: Node.js/Express handles POST requests from the contact form.

Secure Data Storage: Utilizes Oracle SQL as the primary database for reliable data management.

Local Setup Instructions
Follow these steps to get a local copy of the project running.

Prerequisites
Node.js: Ensure Node.js (version 14+) is installed.

Oracle Database: A running Oracle Database instance (local or remote).

Oracle Instant Client: Required for the oracledb driver to function.

Database Setup
The following components must be created in your Oracle Database instance:
CREATE USER Leopad_User IDENTIFIED BY your_app_password;
GRANT CONNECT, RESOURCE, CREATE SESSION TO Leopad_User;
ALTER USER Leopad_User QUOTA UNLIMITED ON users;
Table Structure (Including Sequence and Trigger for auto-increment): Run the complete set of CREATE TABLE,
CREATE SEQUENCE, and CREATE TRIGGER commands (as executed during setup) while connected as the Leopad_User schema.

Backend Configuration
Navigate to the directory containing server.js.

Install required dependencies:
Update server.js: Open server.js and modify the DB_CONFIG object with your actual Oracle credentials and connection string:
const DB_CONFIG = {
    user: "Leopad_User",
    password: "your_app_password",
    connectString: "localhost:1521/service_name" // e.g., localhost/ORCL or localhost:1521/XE
};
Run the Application
Start the Backend Server:

Bash

node server.js
Confirm the output shows: Oracle connection pool successfully created.

Access the Frontend: Open the index2.html file in your web browser.

The contact form is now fully active. Submitting the form will send data to the Node.js API, which will securely insert it into your Oracle database.

Important Security Note
The server.js file currently contains database credentials hardcoded in the DB_CONFIG object. For any production deployment
these credentials must be moved to environment variables(using a library like dotenv) and kept private.
