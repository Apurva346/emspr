// const express = require('express');
// const mysql = require('mysql2');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const xlsx = require('xlsx');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const csv = require('csv-parser');
// const jwt = require('jsonwebtoken'); // <-- ADDED
// const bcrypt = require('bcrypt');     // <-- ADDED
// require('dotenv').config();

// // const generatePasswordHash = async () => {
// //     const plainPassword = 'admin1'; // <--- यहाँ अपना असली पासवर्ड लिखें
// //     const saltRounds = 10;
// //     const hash = await bcrypt.hash(plainPassword, saltRounds);
// //     console.log(`\n\n✅ HASH TO COPY: ${hash}\n\n`);
// // };
// // generatePasswordHash();


// const app = express();
// const port = process.env.API_PORT || 3001;

// // Mock Secret Key (***CHANGE THIS IN PRODUCTION***)
// // const JWT_SECRET = 'your_super_secret_jwt_key_12345'; // <-- ADDED
// // const JWT_SECRET = 'new_secret_key_67890_finance_app'; // <-- इस Value का उपयोग करें
// const JWT_SECRET = process.env.JWT_SECRET;

// // ==================== MIDDLEWARE SETUP ====================
// app.use(cors());
// app.use(bodyParser.json());

// const api_url = process.env.API_URL
// // console.log(api_url);

// // ==================== FOLDER SETUP ====================
// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// const tempUploadDir = path.join(__dirname, 'temp-uploads');
// if (!fs.existsSync(tempUploadDir)) fs.mkdirSync(tempUploadDir);

// // Serve static images
// app.use('/uploads', express.static(uploadDir));

// // ==================== MULTER CONFIG ====================
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
// });
// const upload = multer({ storage });
// const csvUpload = multer({ dest: 'temp-uploads/' });

// // ==================== DATABASE CONNECTION ====================
// // const db = mysql.createPool({
// //   host: 'localhost',
// //   user: 'root',
// //   password: '',
// //   database: 'sp_finance',
// //   port: 3307
// // });



// const db = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT
// });


// // ==================== AUTH MIDDLEWARE ====================
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1]; // Expects 'Bearer TOKEN'

//   if (token == null) {
//     // 401 Unauthorized: No token provided
//     return res.status(401).json({ message: 'Access denied. No token provided.' });
//   }

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) {
//       // 403 Forbidden: Token is invalid or expired
//       return res.status(403).json({ message: 'Invalid or expired token.' });
//     }
//     req.user = user; // Attach user info to request
//     next();
//   });
// };


// // ==================== TEST ROUTE ====================
// app.get('/', (req, res) => {
//   res.send('Node.js server is running and ready!');
// });

// // ==================== ADMIN LOGIN (SECURE - JWT & BCRYPT) ====================
// /**
//  * POST /api/login
//  * Handles user authentication, compares hashed passwords, and issues a JWT.
//  */
// app.post('/api/login', async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: 'Username and password are required.' });
//   }

//   // 1. Retrieve the user and their HASHED password
//   // NOTE: Requires a column named `hashed_password` in your `admin` table.
//   const query = 'SELECT `id`, `username`, `password` FROM `admin` WHERE `username` = ?';

//   db.query(query, [username], async (err, results) => {
//     if (err) {
//       console.error('Database query error:', err);
//       return res.status(500).json({ message: 'Internal server error.' });
//     }

//     const user = results[0];

//     // 2. Check if user exists
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid username or password.' });
//     }

//     let passwordMatch = false;
//     try {
//       // 3. Compare the plain password with the hashed password from the database
//       passwordMatch = await bcrypt.compare(password, user.password);
//     } catch (compareErr) {
//       console.error('Bcrypt comparison error:', compareErr);
//       // Treat comparison error as failed login attempt for security
//       return res.status(401).json({ message: 'Invalid username or password.' });
//     }

//     if (passwordMatch) {
//       // 4. Generate JWT
//       const token = jwt.sign(
//         { id: user.id, username: user.username },
//         JWT_SECRET,
//         { expiresIn: '1h' } // Token expires in 1 hour
//       );

//       // 5. Send successful response with token
//       return res.status(200).json({
//         message: 'Login successful!',
//         token: token // Sending the token to the client
//       });
//     } else {
//       // 6. Failed password match
//       return res.status(401).json({ message: 'Invalid username or password.' });
//     }
//   });
// });

// // ==================== HOME DATA ====================
// // ADDED AUTHENTICATION MIDDLEWARE
// app.get('/api/home', authenticateToken, (req, res) => {
//   db.query('SELECT * FROM `home`', (err, results) => {
//   if (err) {
//     console.error("❌ Update Error:", err);
//     return res.status(500).json({ message: 'Database update error', error: err.message });
//   }

//     res.status(200).json(results);
//   });
// });

// // ==================== IMAGE UPLOAD ====================
// // ADDED AUTHENTICATION MIDDLEWARE
// app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
//   if (!req.file) return res.status(400).json({ message: 'No image file uploaded.' });
//   const imageUrl = `${api_url}/uploads/${req.file.filename}`;
//   res.status(200).json({ imageUrl });
// });

// // ==================== ADD EMPLOYEE ====================
// // ADDED AUTHENTICATION MIDDLEWARE
// app.post('/api/employees', authenticateToken, (req, res) => {
//   const {
//     name, position, email, phone, gender, joining, leaving,
//     department, status, working_mode, emp_type, salary,
//     profile_pic, manager, birth, education, address, emer_cont_no, relation, referred_by
//   } = req.body;

//   if (!name || !position || !email || !phone || !gender || !joining || !department ||
//     !status || !working_mode || !emp_type || !salary || !profile_pic || !manager ||
//     !birth || !education || !address || !emer_cont_no || !relation || !referred_by) {
//     return res.status(400).json({ message: 'Required fields are missing.' });
//   }

//   const dateOfLeaving = leaving ? leaving : null;

//   const query = `INSERT INTO home 
//     (name, position, email, phone, gender, joining, leaving, department, status, working_mode, emp_type, salary, profile_pic, manager, birth, education, address, emer_cont_no, relation, referred_by)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

//   const values = [name, position, email, phone, gender, joining, dateOfLeaving, department, status, working_mode,
//     emp_type, salary, profile_pic, manager, birth, education, address, emer_cont_no, relation, referred_by];

//   db.query(query, values, (err, result) => {
//     if (err) {
//       console.error("❌ Database Insert Error:", err);
//       return res.status(500).json({ message: 'Database insert error.', error: err.message });
//     }

//     res.status(201).json({ message: 'Employee added successfully!', id: result.insertId });
//   });
// });

// // ==================== UPDATE EMPLOYEE ====================
// // ADDED AUTHENTICATION MIDDLEWARE
// app.put('/api/employees/:id', authenticateToken, (req, res) => {
//   console.log("🔄 Received PUT request to update employee:", req.params.id);
//   const { id } = req.params;
//   const {
//     name, position, email, phone, gender, joining, leaving,
//     department, status, working_mode, emp_type, salary,
//     profile_pic, manager, birth, education, address, emer_cont_no, relation, referred_by
//   } = req.body;

//   const query = `UPDATE home SET name=?, position=?, email=?, phone=?, gender=?, joining=?, leaving=?, department=?, status=?, working_mode=?, emp_type=?, salary=?, profile_pic=?, manager=?, birth=?, education=?, address=?, emer_cont_no=?, relation=?, referred_by=? WHERE id=?`;
//   const values = [name, position, email, phone, gender, joining, leaving, department, status,
//     working_mode, emp_type, salary, profile_pic, manager, birth, education, address, emer_cont_no, relation, referred_by, id];

//   db.query(query, values, (err, result) => {
//   if (err) {
//     console.error("❌ Employee Update Error:", err);
//     return res.status(500).json({ message: 'Database update error', error: err.message });
//   }

//     if (result.affectedRows === 0) return res.status(404).json({ message: 'Employee not found.' });
//     res.status(200).json({ message: 'Employee updated successfully!' });
//   });
// });

// // ==================== DELETE MULTIPLE EMPLOYEES ====================
// // ADDED AUTHENTICATION MIDDLEWARE
// app.delete('/api/employees', authenticateToken, (req, res) => {
//   const ids = req.body.ids;
//   if (!ids || !Array.isArray(ids) || ids.length === 0)
//     return res.status(400).json({ message: 'No employee IDs provided for deletion.' });

//   const query = 'DELETE FROM home WHERE id IN (?)';
//   db.query(query, [ids], (err, result) => {
//     if (err) return res.status(500).json({ message: 'Internal server error during deletion.' });
//     res.status(200).json({
//       message: `${result.affectedRows} employee(s) deleted successfully!`,
//       deletedCount: result.affectedRows
//     });
//   });
// });

// // ==================== 📁 SAMPLE CSV ROUTE (keep before :id) ====================
// // This route is public as it serves a static sample file
// app.get('/api/sample-csv', (req, res) => {
//   // नमुना डेटा तयार करा. 
//   const sampleData = [{
//     // तुम्ही दिलेले fields
//     name: 'John Doe',
//     position: 'Software Engineer',
//     email: 'john@example.com',
//     phone: '9876543210',
//     gender: 'Male',
//     joining: '2024-01-15',
//     leaving: '',
//     department: 'IT',
//     status: 'Active',
//     working_mode: 'Hybrid',
//     emp_type: 'Full-time',
//     salary: '50000',
//     profile_pic: '',
//     manager: 'Jane Smith',
//     birth: '1995-05-10',
//     education: 'B.Tech',
//     address: 'Pune, India',
//     emer_cont_no: '9123456789',
//     relation: 'Brother',
//     referred_by: 'HR'
//   }];

//   // 1. JSON डेटाला worksheet मध्ये रूपांतरित करा
//   const worksheet = xlsx.utils.json_to_sheet(sampleData);
//   // 2. worksheet ला CSV स्ट्रिंगमध्ये रूपांतरित करा
//   const csvData = xlsx.utils.sheet_to_csv(worksheet);

//   // 3. आवश्यक HTTP headers सेट करा 
//   // Content-Type: ब्राउझरला सांगा की हा डेटा CSV फॉरमॅटचा आहे.
//   res.setHeader('Content-Type', 'text/csv');

//   // Content-Disposition: ब्राउझरला सांगा की ही फाईल डाउनलोड करायची आहे आणि त्याचे नाव काय असावे.
//   res.setHeader('Content-Disposition', 'attachment; filename="sample_employee_import_file.csv"');

//   // 4. स्टेटस कोड 200 (Success) सह डेटा थेट क्लायंटला पाठवा
//   res.status(200).send(csvData);

//   // नोट: res.download() किंवा fs.unlink() वापरण्याची गरज नाही.
// });


// // ==================== EXPORT CSV ====================
// const buildEmployeeQuery = (searchTerm, statusFilter, selectClause) => {
//   let whereClause = '';
//   const queryParams = [];

//   if (statusFilter && statusFilter.toLowerCase() !== 'all') {
//     whereClause += ' WHERE status = ?';
//     queryParams.push(statusFilter);
//   }

//   if (searchTerm) {
//     const condition = ` (CAST(id AS CHAR) LIKE ? OR name LIKE ? OR manager LIKE ? OR department LIKE ? OR CAST(salary AS CHAR) LIKE ?)`;
//     whereClause += whereClause ? ` AND ${condition}` : ` WHERE ${condition}`;
//     const term = `${searchTerm}%`;
//     queryParams.push(term, term, term, term, term);
//   }

//   const finalSelect = selectClause || '*';
//   return { sqlQuery: `SELECT ${finalSelect} FROM home ${whereClause}`, queryParams };
// };

// // ADDED AUTHENTICATION MIDDLEWARE
// app.get('/api/employees/export-csv', authenticateToken, (req, res) => {
//   const searchTerm = req.query.search || '';
//   const statusFilter = req.query.filter || 'All';
//   const selectFields = 'id, name, manager, department, salary, profile_pic, email, phone, position, birth, status, education, joining, leaving, working_mode, emp_type, address, gender, emer_cont_no, relation, referred_by';
//   const { sqlQuery, queryParams } = buildEmployeeQuery(searchTerm, statusFilter, selectFields);

//   db.query(sqlQuery, queryParams, (err, results) => {
//     if (err) return res.status(500).json({ message: 'Internal server error.' });
//     if (results.length === 0) return res.status(404).json({ message: 'No employees found to export.' });

//     const worksheet = xlsx.utils.json_to_sheet(results);
//     const csvData = xlsx.utils.sheet_to_csv(worksheet);
//     res.setHeader('Content-Type', 'text/csv');
//     res.setHeader('Content-Disposition', 'attachment; filename=employees.csv');
//     res.status(200).send(csvData);
//   });
// });

// // ==================== GET ALL EMPLOYEES ====================
// // ADDED AUTHENTICATION MIDDLEWARE
// app.get('/api/employees', authenticateToken, (req, res) => {
//   const searchTerm = req.query.search || '';
//   const statusFilter = req.query.filter || 'All';
//   const selectFields = 'id, name, manager, department, salary, profile_pic, status, email, phone, position';
//   const { sqlQuery, queryParams } = buildEmployeeQuery(searchTerm, statusFilter, selectFields);

//   db.query(sqlQuery, queryParams, (err, results) => {
//     if (err) return res.status(500).json({ error: "Failed to fetch employees" });
//     res.json(results);
//   });
// });

// // ==================== GET EMPLOYEE BY ID (must be LAST) ====================
// // ADDED AUTHENTICATION MIDDLEWARE
// app.get('/api/employees/:id', authenticateToken, (req, res) => {
//   const employeeId = req.params.id;
//   db.query('SELECT * FROM home WHERE id = ?', [employeeId], (err, results) => {
//     if (err) return res.status(500).json({ message: 'Internal server error.' });
//     if (results.length > 0) res.status(200).json(results[0]);
//     else res.status(404).json({ message: 'Employee not found.' });
//   });
// });


// // ==================== IMPORT CSV (सुधारित Error Handling) ====================
// // ADDED AUTHENTICATION MIDDLEWARE
// app.post('/api/employees/import', authenticateToken, csvUpload.single('employeesFile'), (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ message: 'No file uploaded.' });
//     }

//     const filePath = req.file.path;
//     const employeesToInsert = [];
//     let rowCount = 0;
//     let skippedRows = 0;

//     // Schema: name, position, email, phone, gender, joining, leaving, department, 
//     // status, working_mode, emp_type, salary, profile_pic, manager, birth, 
//     // education, address, emer_cont_no, relation, referred_by
//     const requiredFields = ['name', 'department', 'email', 'salary', 'phone', 'position', 'status', 'education', 'working_mode', 'emp_type', 'gender'];

//     // Stream process पूर्ण झाल्यानंतर (end/error) temporary file delete करण्यासाठी एक function
//     const cleanupFile = () => {
//         try {
//             if (fs.existsSync(filePath)) {
//                 fs.unlinkSync(filePath);
//                 console.log(`🧹 Cleaned up temporary file: ${filePath}`);
//             }
//         } catch (unlinkErr) {
//             console.error('❌ Error deleting temporary file:', unlinkErr);
//         }
//     };

//     const stream = fs.createReadStream(filePath);

//     // 1. File Stream Error Handling (उदा. फाईल करप्ट झाल्यास)
//     stream.on('error', (err) => {
//         console.error('❌ File Stream Error during CSV Read:', err);
//         cleanupFile();
//         return res.status(500).json({ message: 'Error reading the uploaded file stream.' });
//     });

//     stream.pipe(csv())
//         .on('data', (row) => {
//             rowCount++;
//             // Required fields तपासणी. सर्व fields अस्तित्वात आहेत आणि रिकामे नाहीत.
//             const isValid = requiredFields.every(field => row[field] && String(row[field]).trim() !== '');

//             if (!isValid) {
//                 skippedRows++;
//                 return;
//             }

//             // रिकाम्या किंवा undefined values साठी '-' (किंवा null) सेट करण्यासाठी
//             const safe = val => (val && String(val).trim() !== '' ? String(val).trim() : null); 
            
//             // NOTE: leaving field साठी null किंवा रिकामी स्ट्रिंग वापरली जाऊ शकते
//             const dateOfLeaving = safe(row.leaving) === null ? null : safe(row.leaving);
//             const profilePic = safe(row.profile_pic) === null ? '' : safe(row.profile_pic);

//             employeesToInsert.push([
//                 safe(row.name), safe(row.position), safe(row.email), safe(row.phone), safe(row.gender),
//                 safe(row.joining), dateOfLeaving, safe(row.department), safe(row.status),
//                 safe(row.working_mode), safe(row.emp_type), safe(row.salary), profilePic,
//                 safe(row.manager), safe(row.birth), safe(row.education), safe(row.address),
//                 safe(row.emer_cont_no), safe(row.relation), safe(row.referred_by)
//             ]);
//         })
//         .on('end', () => {
//             cleanupFile(); // फाईल पार्स झाल्यावर delete करा
            
//             if (employeesToInsert.length === 0) {
//                 return res.status(400).json({ 
//                     message: `Import failed. No valid rows found. Total processed: ${rowCount}, Skipped: ${skippedRows}.` 
//                 });
//             }

//             // MySQL मध्ये Multiple Inserts साठी VALUES ? चा वापर
//             const query = `INSERT INTO home (name, position, email, phone, gender, joining, leaving, department, status, working_mode, emp_type, salary, profile_pic, manager, birth, education, address, emer_cont_no, relation, referred_by)
//                 VALUES ?`;
            
//             // 2. Database Query Error Handling
//             db.query(query, [employeesToInsert], (err, result) => {
//                 if (err) {
//                     // ❌ Database Insert Error Console मध्ये प्रिंट करा
//                     console.error("❌ CSV Import Database Error:", err); 
//                     let customMessage = 'Database insert failed.';

//                     if (err.code === 'ER_DUP_ENTRY') {
//                         customMessage = 'Import failed due to duplicate entry (e.g., email or unique ID already exists).';
//                     } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
//                         customMessage = 'Import failed due to incorrect data type (e.g., text in a number field, or wrong date format).';
//                     }

//                     return res.status(500).json({ 
//                         message: customMessage,
//                         error: err.message 
//                     });
//                 }
                
//                 res.status(200).json({ 
//                     message: `${result.affectedRows} employees imported successfully. Skipped ${skippedRows} invalid row(s).`,
//                     importedCount: result.affectedRows,
//                     skippedCount: skippedRows
//                 });
//             });
//         })
//         .on('error', (err) => { // 3. CSV Parsing Error Handling
//             console.error('❌ CSV Parsing Error:', err);
//             cleanupFile();
//             // हा एरर सहसा stream.on('error') मध्ये पकडला जातो, पण احتياत म्हणून ठेवला आहे.
//             return res.status(500).json({ message: 'Error parsing CSV file content.' });
//         });
// });

// // ==================== START SERVER ====================
// app.listen(port, () => {
//   console.log(`✅ Server running at ${api_url} on port ${port}`);
// });


// // server.js
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// require('dotenv').config();

// // Imports from utils and routes
// const employeeRoutes = require('./routes/employee.routes');
// const authRoutes = require('./routes/auth.routes');
// const { initDBPool } = require('./utils/db');
// const { uploadDir } = require('./utils/multerConfig');
// const path = require('path');
// const fs = require('fs');

// const app = express();
// const port = process.env.API_PORT || 3001;
// const api_url = process.env.API_URL;

// // ==================== INITIAL SETUP ====================
// // Initialize DB Pool
// initDBPool();

// // FOLDER SETUP
// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
// const tempUploadDir = path.join(__dirname, 'temp-uploads');
// if (!fs.existsSync(tempUploadDir)) fs.mkdirSync(tempUploadDir);


// // ==================== MIDDLEWARE SETUP ====================
// app.use(cors());
// app.use(bodyParser.json());
// // Serve static images
// app.use('/uploads', express.static(uploadDir));


// // ==================== TEST ROUTE ====================
// app.get('/', (req, res) => {
//     res.send('Node.js server is running and ready!');
// });


// // ==================== ROUTE REGISTRATION ====================
// // Auth Routes (Login)
// app.use('/api', authRoutes); 
// // Employee Routes (All other logic, using Express Router)
// app.use('/api', employeeRoutes);


// // ==================== START SERVER ====================
// app.listen(port, () => {
//     console.log(`✅ Server running at ${api_url} on port ${port}`);
// });



// server.js (MODIFIED)
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// Imports from utils (These do not call getDB() immediately)
const { initDBPool } = require('./utils/db');
const { uploadDir } = require('./utils/multerConfig');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.API_PORT || 3001;
const api_url = process.env.API_URL;

// ==================== INITIAL SETUP ====================
// FOLDER SETUP
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const tempUploadDir = path.join(__dirname, 'temp-uploads');
if (!fs.existsSync(tempUploadDir)) fs.mkdirSync(tempUploadDir);

// 1. 🥇 FIRST: Initialize DB Pool (Call initDBPool before importing routes)
initDBPool(); 

// 2. 🥈 SECOND: Now, import the routes. 
//    When these files execute, getDB() will now return the initialized pool.
const employeeRoutes = require('./routes/employee.routes'); // Now safe to import
const authRoutes = require('./routes/auth.routes');         // Now safe to import


// ==================== MIDDLEWARE SETUP ====================
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(uploadDir));


// ==================== TEST ROUTE ====================
app.get('/', (req, res) => {
    res.send('Node.js server is running and ready!');
});


// ==================== ROUTE REGISTRATION ====================
app.use('/api', authRoutes); 
app.use('/api', employeeRoutes);


// ==================== START SERVER ====================
app.listen(port, () => {
    console.log(`✅ Server running at ${api_url} on port ${port}`);
});