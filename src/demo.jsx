// Import required packages
// const express = require('express');
// const mysql = require('mysql2');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const multer = require('multer');
// const path = require('path');
// const xlsx = require('xlsx');

// // Create an Express application instance
// const app = express();

// // Define the port for your server
// const port = 3001;

// // Middleware setup
// // Enable CORS for your React app
// app.use(cors());
// // Parse incoming JSON data
// app.use(bodyParser.json());

// // Create a connection pool to your database
// const db = mysql.createPool({
//     host: 'localhost',
//     user: 'root', // Replace with your phpMyAdmin username
//     password: '', // Replace with your phpMyAdmin password
//     database: 'sp_finance', // Replace with your database name
//     port: 3307
// });

// // A simple test route to ensure the server is running
// app.get('/', (req, res) => {
//     res.send('Node.js server is running and ready!');
// });

// // Admin login route (TEMPORARY: uses plain text password comparison)
// app.post('/api/login', (req, res) => {
//     const { username, password } = req.body;

//     // Check if username and password are provided
//     if (!username || !password) {
//         return res.status(400).json({ message: 'Username and password are required.' });
//     }

//     // SQL query to find the user by username and plain text password
//     const query = 'SELECT * FROM `admin` WHERE username = ? AND password = ?';

//     // Execute the query
//     db.query(query, [username, password], (err, results) => {
//         if (err) {
//             console.error('Database query error:', err);
//             return res.status(500).json({ message: 'Internal server error.' });
//         }

//         // Check if a user was found
//         if (results.length > 0) {
//             // User found, login successful
//             res.status(200).json({ message: 'Login successful!', user: { id: results[0].id, username: results[0].username } });
//         } else {
//             // User not found or password incorrect
//             res.status(401).json({ message: 'Invalid username or password.' });
//         }
//     });
// });

// // Route to fetch all data from the 'home' table
// app.get('/api/home', (req, res) => {
//     const query = 'SELECT * FROM `home`';
//     db.query(query, (err, results) => {
//         if (err) {
//             console.error('Database query error:', err);
//             return res.status(500).json({ message: 'Internal server error.' });
//         }
//         res.status(200).json(results);
//     });
// });

// // New PUT route to update an employee in the 'home' table
// app.put('/api/home/:id', (req, res) => {
//     const { id } = req.params;
//     const { name, manager, department, salary, email, phone } = req.body;

//     const query = 'UPDATE `home` SET name = ?, manager = ?, department = ?, salary = ?, email = ?, phone = ? WHERE id = ?';

//     db.query(query, [name, manager, department, salary, email, phone, id], (err, result) => {
//         if (err) {
//             console.error('Database update error:', err);
//             return res.status(500).json({ message: 'Internal server error.' });
//         }
//         if (result.affectedRows === 0) {
//             return res.status(404).json({ message: 'Employee not found.' });
//         }
//         res.status(200).json({ message: 'Employee updated successfully!' });
//     });
// });

// // Export साठी नवीन API endpoint
// app.get('/api/employees/export', (req, res) => {
//     // SQL query to fetch all data from the `home` table
//     const query = 'SELECT id, name, manager, department, salary, email, phone FROM `home`';
//     db.query(query, (err, results) => {
//         if (err) {
//             console.error('Database query error:', err);
//             return res.status(500).json({ message: 'Internal server error.' });
//         }

//         if (results.length === 0) {
//             return res.status(404).json({ message: 'No employees found to export.' });
//         }

//         // Convert JSON data to a worksheet
//         const worksheet = xlsx.utils.json_to_sheet(results);
//         const workbook = xlsx.utils.book_new();
//         xlsx.utils.book_append_sheet(workbook, worksheet, "Employees");

//         // Generate a buffer from the workbook
//         const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });

//         // Set the headers to make the browser download the file
//         res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//         res.setHeader('Content-Disposition', 'attachment; filename=employees.xlsx');

//         // Send the Excel file buffer
//         res.status(200).send(excelBuffer);
//     });
// });

// // Multer storage setup
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // Import साठी नवीन API endpoint
// app.post('/api/employees/import', upload.single('employeesFile'), (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ message: 'No file uploaded.' });
//     }

//     try {
//         const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];
//         const data = xlsx.utils.sheet_to_json(worksheet);

//         // डेटाबेसमध्ये डेटा सेव्ह करण्यासाठी एक Transaction सुरु करा
//         db.getConnection((err, connection) => {
//             if (err) throw err;

//             connection.beginTransaction(err => {
//                 if (err) throw err;
                
//                 let successCount = 0;
//                 let failureCount = 0;

//                 const processData = (index) => {
//                     if (index >= data.length) {
//                         connection.commit(err => {
//                             if (err) {
//                                 return connection.rollback(() => {
//                                     throw err;
//                                 });
//                             }
//                             connection.release();
//                             return res.status(200).json({ 
//                                 message: `Successfully imported ${successCount} employees. ${failureCount} failed.`, 
//                                 success: successCount, 
//                                 failed: failureCount 
//                             });
//                         });
//                         return;
//                     }

//                     const row = data[index];
//                     const { name, manager, department, salary, email, phone } = row;

//                     // डेटाबेसमध्ये नवीन डेटा घाला
//                     const insertQuery = 'INSERT INTO `home` (name, manager, department, salary, email, phone) VALUES (?, ?, ?, ?, ?, ?)';
//                     connection.query(insertQuery, [name, manager, department, salary, email, phone], (err, result) => {
//                         if (err) {
//                             console.error('Error inserting data:', err);
//                             failureCount++;
//                         } else {
//                             successCount++;
//                         }
//                         processData(index + 1);
//                     });
//                 };

//                 processData(0);
//             });
//         });
//     } catch (err) {
//         console.error('Error processing file:', err);
//         res.status(500).json({ message: 'Error importing file.' });
//     }
// });


// // Start the server
// app.listen(port, () => {
//     console.log(`Server listening at http://localhost:${port}`);
// });
