// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const oracledb = require('oracledb'); // Import the Oracle driver

// ===============================================
// 1. ORACLE DATABASE CONFIGURATION
// ===============================================

// !! IMPORTANT: REPLACE THESE BOLD PLACEHOLDERS WITH YOUR ACTUAL CREDENTIALS !!
const DB_CONFIG = {
    user: "Leopad_User",                   // The exact username you created in SQL*Plus
    password: "your_app_password",          // The password you set for the user
    connectString: "localhost:1521/service_name" // Example: "localhost/ORCL" or "localhost:1521/XE"
};

const app = express();
const PORT = 3000;

// ===============================================
// 2. MIDDLEWARE SETUP
// ===============================================
app.use(cors()); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize the Oracle connection pool
async function initializeDatabase() {
    try {
        await oracledb.createPool(DB_CONFIG);
        console.log("Oracle connection pool successfully created.");
    } catch (err) {
        console.error("Database initialization failed. Check credentials and Instant Client setup:", err);
        process.exit(1); 
    }
}

// Immediately initialize the database when the server starts
initializeDatabase();

// ===============================================
// 3. CONTACT FORM ROUTE (DB INSERT)
// ===============================================

app.post('/api/contact', async (req, res) => {
    const { name, email, phone, message } = req.body;

    // Server-side Validation: Basic check for NOT NULL columns
    if (!name || !email || !message) {
        return res.status(400).json({ 
            success: false, 
            message: 'Validation Error: Name, email, and message are required.' 
        });
    }

    let connection;
    try {
        // 1. Get a connection from the pool
        connection = await oracledb.getConnection();
        
        // 2. SQL INSERT Query - Relying on the trigger for 'id'
        const queryText = `
            INSERT INTO ContactMessages (name, email, phone, message)
            VALUES (:name, :email, :phone, :message)
        `;
        
        // Data object must match the bind variable names in the query
        // If 'phone' is an empty string (""), the database will accept it as NULL
        const queryValues = { name, email, phone, message };

        // 3. Execute the insert statement
        const result = await connection.execute(queryText, queryValues, { autoCommit: true });
        
        if (result.rowsAffected === 1) {
            console.log(`New message saved successfully.`);
            
            return res.status(200).json({ 
                success: true, 
                message: 'Your message has been successfully saved to the Oracle database!' 
            });
        } else {
             throw new Error('Database reported no rows were inserted.');
        }

    } catch (error) {
        // 🛑 CRITICAL DEBUGGING STEP: This logs the exact ORA error code 
        console.error('CRITICAL ORACLE INSERT ERROR:', error.message);
        console.error('Full Error Stack:', error.stack);
        
        // Return 500 status to the frontend
        return res.status(500).json({ 
            success: false, 
            message: 'A critical server error occurred in the backend. Check server logs for details.' 
        });
    } finally {
        // 4. Always close the connection
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error("Error closing connection:", err);
            }
        }
    }
});


// ===============================================
// 4. START SERVER
// ===============================================
app.listen(PORT, () => {
    console.log(`Leopard Backend Server running on http://localhost:${PORT}`);
});