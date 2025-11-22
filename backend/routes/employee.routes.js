// // routes/employee.routes.js
// const express = require('express');
// const xlsx = require('xlsx');
// const csv = require('csv-parser');
// const fs = require('fs');
// const path = require('path');
// require('dotenv').config();

// const { getDB } = require('../utils/db');
// const { authenticateToken } = require('../utils/auth');
// const { upload, csvUpload } = require('../utils/multerConfig');
// const { buildEmployeeQuery } = require('../middleware/employeeQueryBuilder');

// const router = express.Router();
// const db = getDB();
// const api_url = process.env.API_URL;


// // ==================== HOME DATA (Protected) ====================
// router.get('/home', authenticateToken, (req, res) => {
//     db.query('SELECT * FROM `home`', (err, results) => {
//         if (err) {
//             console.error("❌ Home Data Error:", err);
//             return res.status(500).json({ message: 'Database fetch error', error: err.message });
//         }
//         res.status(200).json(results);
//     });
// });


// // ==================== IMAGE UPLOAD (Protected) ====================
// router.post('/upload', authenticateToken, upload.single('image'), (req, res) => {
//     if (!req.file) return res.status(400).json({ message: 'No image file uploaded.' });
//     const imageUrl = `${api_url}/uploads/${req.file.filename}`;
//     res.status(200).json({ imageUrl });
// });


// // ==================== ADD EMPLOYEE (Protected) ====================
// router.post('/employees', authenticateToken, (req, res) => {
//     const {
//         name, position, email, phone, gender, joining, leaving,
//         department, status, working_mode, emp_type, salary,
//         profile_pic, manager, birth, education, address, emer_cont_no, relation, referred_by
//     } = req.body;

//     // Simplified validation for brevity, keep your original validation logic
//     if (!name || !department || !email) { 
//         return res.status(400).json({ message: 'Required fields are missing.' });
//     }

//     const dateOfLeaving = leaving ? leaving : null;

//     const query = `INSERT INTO home 
//         (name, position, email, phone, gender, joining, leaving, department, status, working_mode, emp_type, salary, profile_pic, manager, birth, education, address, emer_cont_no, relation, referred_by)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

//     const values = [name, position, email, phone, gender, joining, dateOfLeaving, department, status, working_mode,
//         emp_type, salary, profile_pic, manager, birth, education, address, emer_cont_no, relation, referred_by];

//     db.query(query, values, (err, result) => {
//         if (err) {
//             console.error("❌ Database Insert Error:", err);
//             return res.status(500).json({ message: 'Database insert error.', error: err.message });
//         }
//         res.status(201).json({ message: 'Employee added successfully!', id: result.insertId });
//     });
// });


// // ==================== UPDATE EMPLOYEE (Protected) ====================
// router.put('/employees/:id', authenticateToken, (req, res) => {
//     const { id } = req.params;
//     const {
//         name, position, email, phone, gender, joining, leaving,
//         department, status, working_mode, emp_type, salary,
//         profile_pic, manager, birth, education, address, emer_cont_no, relation, referred_by
//     } = req.body;

//     const query = `UPDATE home SET name=?, position=?, email=?, phone=?, gender=?, joining=?, leaving=?, department=?, status=?, working_mode=?, emp_type=?, salary=?, profile_pic=?, manager=?, birth=?, education=?, address=?, emer_cont_no=?, relation=?, referred_by=? WHERE id=?`;
//     const values = [name, position, email, phone, gender, joining, leaving, department, status,
//         working_mode, emp_type, salary, profile_pic, manager, birth, education, address, emer_cont_no, relation, referred_by, id];

//     db.query(query, values, (err, result) => {
//         if (err) {
//             console.error("❌ Employee Update Error:", err);
//             return res.status(500).json({ message: 'Database update error', error: err.message });
//         }

//         if (result.affectedRows === 0) return res.status(404).json({ message: 'Employee not found.' });
//         res.status(200).json({ message: 'Employee updated successfully!' });
//     });
// });


// // ==================== DELETE MULTIPLE EMPLOYEES (Protected) ====================
// router.delete('/employees', authenticateToken, (req, res) => {
//     const ids = req.body.ids;
//     if (!ids || !Array.isArray(ids) || ids.length === 0)
//         return res.status(400).json({ message: 'No employee IDs provided for deletion.' });

//     const query = 'DELETE FROM home WHERE id IN (?)';
//     db.query(query, [ids], (err, result) => {
//         if (err) return res.status(500).json({ message: 'Internal server error during deletion.' });
//         res.status(200).json({
//             message: `${result.affectedRows} employee(s) deleted successfully!`,
//             deletedCount: result.affectedRows
//         });
//     });
// });


// // ==================== 📁 SAMPLE CSV ROUTE (Public) ====================
// router.get('/sample-csv', (req, res) => {
//     const sampleData = [{
//         name: 'John Doe',
//         position: 'Software Engineer',
//         email: 'john@example.com',
//         phone: '9876543210',
//         gender: 'Male',
//         joining: '2024-01-15',
//         leaving: '',
//         department: 'IT',
//         status: 'Active',
//         working_mode: 'Hybrid',
//         emp_type: 'Full-time',
//         salary: '50000',
//         profile_pic: '',
//         manager: 'Jane Smith',
//         birth: '1995-05-10',
//         education: 'B.Tech',
//         address: 'Pune, India',
//         emer_cont_no: '9123456789',
//         relation: 'Brother',
//         referred_by: 'HR'
//     }];

//     const worksheet = xlsx.utils.json_to_sheet(sampleData);
//     const csvData = xlsx.utils.sheet_to_csv(worksheet);

//     res.setHeader('Content-Type', 'text/csv');
//     res.setHeader('Content-Disposition', 'attachment; filename="sample_employee_import_file.csv"');
//     res.status(200).send(csvData);
// });


// // ==================== EXPORT CSV (Protected) ====================
// router.get('/employees/export-csv', authenticateToken, (req, res) => {
//     const searchTerm = req.query.search || '';
//     const statusFilter = req.query.filter || 'All';
//     const selectFields = 'id, name, manager, department, salary, profile_pic, email, phone, position, birth, status, education, joining, leaving, working_mode, emp_type, address, gender, emer_cont_no, relation, referred_by';
//     const { sqlQuery, queryParams } = buildEmployeeQuery(searchTerm, statusFilter, selectFields);

//     db.query(sqlQuery, queryParams, (err, results) => {
//         if (err) return res.status(500).json({ message: 'Internal server error during export.' });
//         if (results.length === 0) return res.status(404).json({ message: 'No employees found to export.' });

//         const worksheet = xlsx.utils.json_to_sheet(results);
//         const csvData = xlsx.utils.sheet_to_csv(worksheet);
//         res.setHeader('Content-Type', 'text/csv');
//         res.setHeader('Content-Disposition', 'attachment; filename=employees.csv');
//         res.status(200).send(csvData);
//     });
// });


// // ==================== GET ALL EMPLOYEES (Protected) ====================
// router.get('/employees', authenticateToken, (req, res) => {
//     const searchTerm = req.query.search || '';
//     const statusFilter = req.query.filter || 'All';
//     const selectFields = 'id, name, manager, department, salary, profile_pic, status, email, phone, position';
//     const { sqlQuery, queryParams } = buildEmployeeQuery(searchTerm, statusFilter, selectFields);

//     db.query(sqlQuery, queryParams, (err, results) => {
//         if (err) return res.status(500).json({ error: "Failed to fetch employees" });
//         res.json(results);
//     });
// });


// // ==================== GET EMPLOYEE BY ID (Protected) ====================
// router.get('/employees/:id', authenticateToken, (req, res) => {
//     const employeeId = req.params.id;
//     db.query('SELECT * FROM home WHERE id = ?', [employeeId], (err, results) => {
//         if (err) return res.status(500).json({ message: 'Internal server error.' });
//         if (results.length > 0) res.status(200).json(results[0]);
//         else res.status(404).json({ message: 'Employee not found.' });
//     });
// });


// // ==================== IMPORT CSV (Protected - with improved Error Handling) ====================
// router.post('/employees/import', authenticateToken, csvUpload.single('employeesFile'), (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ message: 'No file uploaded.' });
//     }

//     const filePath = req.file.path;
//     const employeesToInsert = [];
//     let rowCount = 0;
//     let skippedRows = 0;

//     const requiredFields = ['name', 'department', 'email', 'salary', 'phone', 'position', 'status', 'education', 'working_mode', 'emp_type', 'gender'];

//     // Function to clean up the temporary file
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

//     stream.on('error', (err) => {
//         console.error('❌ File Stream Error during CSV Read:', err);
//         cleanupFile();
//         return res.status(500).json({ message: 'Error reading the uploaded file stream.' });
//     });

//     stream.pipe(csv())
//         .on('data', (row) => {
//             rowCount++;
            
//             const isValid = requiredFields.every(field => row[field] && String(row[field]).trim() !== '');

//             if (!isValid) {
//                 skippedRows++;
//                 return;
//             }

//             // Helper for safely trimming and setting null/empty string
//             const safe = val => (val && String(val).trim() !== '' ? String(val).trim() : null); 
            
//             const dateOfLeaving = safe(row.leaving);
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
//             cleanupFile(); // Delete file after parsing
            
//             if (employeesToInsert.length === 0) {
//                 return res.status(400).json({ 
//                     message: `Import failed. No valid rows found. Total processed: ${rowCount}, Skipped: ${skippedRows}.` 
//                 });
//             }

//             const query = `INSERT INTO home (name, position, email, phone, gender, joining, leaving, department, status, working_mode, emp_type, salary, profile_pic, manager, birth, education, address, emer_cont_no, relation, referred_by)
//                 VALUES ?`;
            
//             db.query(query, [employeesToInsert], (err, result) => {
//                 if (err) {
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
//         .on('error', (err) => {
//             console.error('❌ CSV Parsing Error:', err);
//             cleanupFile();
//             return res.status(500).json({ message: 'Error parsing CSV file content.' });
//         });
// });

// module.exports = router;


// routes/employee.routes.js
const express = require('express');
const xlsx = require('xlsx');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Utility and Middleware Imports
const { getDB } = require('../utils/db');
const { authenticateToken } = require('../utils/auth');
const { upload, csvUpload } = require('../utils/multerConfig');
const { buildEmployeeQuery } = require('../middleware/employeeQueryBuilder');

const router = express.Router();
// Get the initialized DB pool instance
const db = getDB(); 
const api_url = process.env.API_URL;

// =================================================================
// ➡️ Employee Management Routes
// =================================================================


// ==================== HOME DATA (Protected) ====================
// Fetches all employee data (often used for dashboard/summary)
router.get('/home', authenticateToken, (req, res) => {
    db.query('SELECT * FROM `home`', (err, results) => {
        if (err) {
            console.error("❌ Home Data Error:", err);
            return res.status(500).json({ message: 'Database fetch error', error: err.message });
        }
        res.status(200).json(results);
    });
});


// ==================== IMAGE UPLOAD (Protected) ====================
// Handles single image upload and returns the accessible URL
router.post('/upload', authenticateToken, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No image file uploaded.' });
    
    // Construct the full image URL using the environment variable API_URL
    const imageUrl = `${api_url}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
});


// ==================== ADD EMPLOYEE (Protected - Full Validation) ====================
// router.post('/employees', authenticateToken, (req, res) => {
//     const {
//         name, position, email, phone, gender, joining, leaving,
//         department, status, working_mode, emp_type, salary,
//         profile_pic, manager, birth, education, address, emer_cont_no, relation, referred_by
//     } = req.body;

//     // --- 🚨 Full Validation Check (Based on your original server.js logic) ---
//     if (!name || !position || !email || !phone || !gender || !joining || !department ||
//         !status || !working_mode || !emp_type || !salary || !profile_pic || !manager ||
//         !birth || !education || !address || !emer_cont_no || !relation || !referred_by) {
        
//         console.warn('⚠️ Missing required fields in ADD EMPLOYEE request:', req.body);
//         return res.status(400).json({ message: 'Required fields are missing.' });
//     }
//     // --------------------------------------------------------------------------

//     // Treat 'leaving' field as NULL if empty, as per MySQL best practice for optional dates
//     const dateOfLeaving = leaving ? leaving : null; 

//     const query = `INSERT INTO home 
//         (name, position, email, phone, gender, joining, leaving, department, status, working_mode, emp_type, salary, profile_pic, manager, birth, education, address, emer_cont_no, relation, referred_by)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

//     const values = [name, position, email, phone, gender, joining, dateOfLeaving, department, status, working_mode,
//         emp_type, salary, profile_pic, manager, birth, education, address, emer_cont_no, relation, referred_by];

//     db.query(query, values, (err, result) => {
//         if (err) {
//             console.error("❌ Database Insert Error:", err);
//             // Provide a more user-friendly error message if possible
//             if (err.code === 'ER_DUP_ENTRY') {
//                  return res.status(409).json({ message: 'Email or phone number already registered.', error: err.message });
//             }
//             return res.status(500).json({ message: 'Database insert error.', error: err.message });
//         }
//         res.status(201).json({ message: 'Employee added successfully!', id: result.insertId });
//     });
// });

// ==================== ADD EMPLOYEE (Protected - Matching Frontend Validation) ====================
router.post('/employees', authenticateToken, (req, res) => {
    const {
        name, position, email, phone, gender, joining, leaving,
        department, status, working_mode, emp_type, salary,
        profile_pic, manager, birth, education, address, emer_cont_no, relation, referred_by
    } = req.body;

    // --- ✅ Updated Validation Check (Matching Frontend Requirements) ---
    // Required Fields: name, position, email, phone, gender, department, status, working_mode, emp_type, salary, education
    if (!name || !position || !email || !phone || !gender || !department ||
        !status || !working_mode || !emp_type || !salary || !education || !manager) {
        
        console.warn('⚠️ Missing required fields in ADD EMPLOYEE request:', req.body);
        return res.status(400).json({ message: 'Required fields (Name, Position, Email, Phone, Gender, Department, Status, Working Mode, Employee Type, Salary, Education, Manager) are missing.' });
    }
    // --------------------------------------------------------------------------

    // Treat 'leaving' field as NULL if empty, as per MySQL best practice for optional dates
    const dateOfLeaving = leaving ? leaving : null; 

    // Note: All fields are still inserted into the database, optional fields will be null/empty string if not provided.
    const query = `INSERT INTO home 
        (name, position, email, phone, gender, joining, leaving, department, status, working_mode, emp_type, salary, profile_pic, manager, birth, education, address, emer_cont_no, relation, referred_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        name, 
        position, 
        email, 
        phone, 
        gender, 
        joining || null, // Optional: joining date can be null if not provided
        dateOfLeaving, 
        department, 
        status, 
        working_mode,
        emp_type, 
        salary, 
        profile_pic || '', // Optional: profile_pic can be empty string
        manager || '', 
        birth || null, 
        education, 
        address || null, 
        emer_cont_no || '', 
        relation || '', 
        referred_by || ''
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("❌ Database Insert Error:", err);
            if (err.code === 'ER_DUP_ENTRY') {
                 return res.status(409).json({ message: 'Email or phone number already registered.', error: err.message });
            }
            return res.status(500).json({ message: 'Database insert error.', error: err.message });
        }
        res.status(201).json({ message: 'Employee added successfully!', id: result.insertId });
    });
});


// ==================== UPDATE EMPLOYEE (Protected) ====================
router.put('/employees/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const {
        name, position, email, phone, gender, joining, leaving,
        department, status, working_mode, emp_type, salary,
        profile_pic, manager, birth, education, address, emer_cont_no, relation, referred_by
    } = req.body;

    // Note: It's good practice to ensure all necessary fields for UPDATE are present, but assuming
    // the frontend sends a complete object.

    const query = `UPDATE home SET name=?, position=?, email=?, phone=?, gender=?, joining=?, leaving=?, department=?, status=?, working_mode=?, emp_type=?, salary=?, profile_pic=?, manager=?, birth=?, education=?, address=?, emer_cont_no=?, relation=?, referred_by=? WHERE id=?`;
    const values = [name, position, email, phone, gender, joining, leaving, department, status,
        working_mode, emp_type, salary, profile_pic, manager, birth, education, address, emer_cont_no, relation, referred_by, id];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("❌ Employee Update Error:", err);
            return res.status(500).json({ message: 'Database update error', error: err.message });
        }

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Employee not found.' });
        res.status(200).json({ message: 'Employee updated successfully!' });
    });
});


// ==================== DELETE MULTIPLE EMPLOYEES (Protected) ====================
router.delete('/employees', authenticateToken, (req, res) => {
    const ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length === 0)
        return res.status(400).json({ message: 'No employee IDs provided for deletion.' });

    const query = 'DELETE FROM home WHERE id IN (?)';
    db.query(query, [ids], (err, result) => {
        if (err) {
            console.error("❌ Employee Deletion Error:", err);
            return res.status(500).json({ message: 'Internal server error during deletion.' });
        }
        res.status(200).json({
            message: `${result.affectedRows} employee(s) deleted successfully!`,
            deletedCount: result.affectedRows
        });
    });
});


// ==================== 📁 SAMPLE CSV ROUTE (Public) ====================
// Provides a downloadable sample CSV file for import guidance
router.get('/sample-csv', (req, res) => {
    const sampleData = [{
        name: 'John Doe',
        position: 'Software Engineer',
        email: 'john@example.com',
        phone: '9876543210',
        gender: 'Male',
        joining: '2024-01-15',
        leaving: '', // Keep empty for optional/null date
        department: 'IT',
        status: 'Active',
        working_mode: 'Hybrid',
        emp_type: 'Full-time',
        salary: '50000',
        profile_pic: '',
        manager: 'Jane Smith',
        birth: '1995-05-10',
        education: 'B.Tech',
        address: 'Pune, India',
        emer_cont_no: '9123456789',
        relation: 'Brother',
        referred_by: 'HR'
    }];

    const worksheet = xlsx.utils.json_to_sheet(sampleData);
    const csvData = xlsx.utils.sheet_to_csv(worksheet);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="sample_employee_import_file.csv"');
    res.status(200).send(csvData);
});


// ==================== EXPORT CSV (Protected) ====================
// Exports filtered/searched employee data as a CSV file
router.get('/employees/export-csv', authenticateToken, (req, res) => {
    const searchTerm = req.query.search || '';
    const statusFilter = req.query.filter || 'All';
    const selectFields = 'id, name, manager, department, salary, profile_pic, email, phone, position, birth, status, education, joining, leaving, working_mode, emp_type, address, gender, emer_cont_no, relation, referred_by';
    
    // Uses the centralized query builder logic
    const { sqlQuery, queryParams } = buildEmployeeQuery(searchTerm, statusFilter, selectFields);

    db.query(sqlQuery, queryParams, (err, results) => {
        if (err) {
            console.error("❌ CSV Export DB Error:", err);
            return res.status(500).json({ message: 'Internal server error during export.' });
        }
        if (results.length === 0) return res.status(404).json({ message: 'No employees found to export.' });

        const worksheet = xlsx.utils.json_to_sheet(results);
        const csvData = xlsx.utils.sheet_to_csv(worksheet);
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=employees.csv');
        res.status(200).send(csvData);
    });
});


// ==================== GET ALL EMPLOYEES (Protected) ====================
// Fetches a list of employees based on search and filter parameters
router.get('/employees', authenticateToken, (req, res) => {
    const searchTerm = req.query.search || '';
    const statusFilter = req.query.filter || 'All';
    const selectFields = 'id, name, manager, department, salary, profile_pic, status, email, phone, position';
    const { sqlQuery, queryParams } = buildEmployeeQuery(searchTerm, statusFilter, selectFields);

    db.query(sqlQuery, queryParams, (err, results) => {
        if (err) {
            console.error("❌ Fetch All Employees DB Error:", err);
            return res.status(500).json({ error: "Failed to fetch employees" });
        }
        res.json(results);
    });
});


// ==================== GET EMPLOYEE BY ID (Protected) ====================
router.get('/employees/:id', authenticateToken, (req, res) => {
    const employeeId = req.params.id;
    db.query('SELECT * FROM home WHERE id = ?', [employeeId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Internal server error.' });
        if (results.length > 0) res.status(200).json(results[0]);
        else res.status(404).json({ message: 'Employee not found.' });
    });
});


// ==================== IMPORT CSV (Protected - with improved Error Handling) ====================
router.post('/employees/import', authenticateToken, csvUpload.single('employeesFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    const filePath = req.file.path;
    const employeesToInsert = [];
    let rowCount = 0;
    let skippedRows = 0;

    // Define fields required for a row to be considered valid
    const requiredFields = ['name', 'department', 'email', 'salary', 'phone', 'position', 'status', 'education', 'working_mode', 'emp_type', 'gender'];

    // Function to clean up the temporary file
    const cleanupFile = () => {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`🧹 Cleaned up temporary file: ${filePath}`);
            }
        } catch (unlinkErr) {
            console.error('❌ Error deleting temporary file:', unlinkErr);
        }
    };

    const stream = fs.createReadStream(filePath);

    stream.on('error', (err) => {
        console.error('❌ File Stream Error during CSV Read:', err);
        cleanupFile();
        return res.status(500).json({ message: 'Error reading the uploaded file stream.' });
    });

    stream.pipe(csv())
        .on('data', (row) => {
            rowCount++;
            
            // Validation check: ensure all required fields are present and not empty
            const isValid = requiredFields.every(field => row[field] && String(row[field]).trim() !== '');

            if (!isValid) {
                skippedRows++;
                return;
            }

            // Helper for safely trimming and setting null if empty
            const safe = val => (val && String(val).trim() !== '' ? String(val).trim() : null); 
            
            // Specific handling for optional/default fields
            const dateOfLeaving = safe(row.leaving);
            const profilePic = safe(row.profile_pic) === null ? '' : safe(row.profile_pic);

            employeesToInsert.push([
                safe(row.name), safe(row.position), safe(row.email), safe(row.phone), safe(row.gender),
                safe(row.joining), dateOfLeaving, safe(row.department), safe(row.status),
                safe(row.working_mode), safe(row.emp_type), safe(row.salary), profilePic,
                safe(row.manager), safe(row.birth), safe(row.education), safe(row.address),
                safe(row.emer_cont_no), safe(row.relation), safe(row.referred_by)
            ]);
        })
        .on('end', () => {
            cleanupFile(); 
            
            if (employeesToInsert.length === 0) {
                return res.status(400).json({ 
                    message: `Import failed. No valid rows found. Total processed: ${rowCount}, Skipped: ${skippedRows}.` 
                });
            }

            const query = `INSERT INTO home (name, position, email, phone, gender, joining, leaving, department, status, working_mode, emp_type, salary, profile_pic, manager, birth, education, address, emer_cont_no, relation, referred_by)
                VALUES ?`;
            
            db.query(query, [employeesToInsert], (err, result) => {
                if (err) {
                    console.error("❌ CSV Import Database Error:", err); 
                    let customMessage = 'Database insert failed.';

                    // Detailed error mapping for better client feedback
                    if (err.code === 'ER_DUP_ENTRY') {
                        customMessage = 'Import failed due to duplicate entry (e.g., email or unique ID already exists).';
                    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD' || err.code === 'ER_BAD_FIELD_ERROR') {
                        customMessage = 'Import failed due to incorrect data type or missing column header in the CSV file.';
                    }

                    return res.status(500).json({ 
                        message: customMessage,
                        error: err.message 
                    });
                }
                
                res.status(200).json({ 
                    message: `${result.affectedRows} employees imported successfully. Skipped ${skippedRows} invalid row(s).`,
                    importedCount: result.affectedRows,
                    skippedCount: skippedRows
                });
            });
        })
        .on('error', (err) => {
            console.error('❌ CSV Parsing Stream Error:', err);
            cleanupFile();
            return res.status(500).json({ message: 'Error parsing CSV file content.' });
        });
});

module.exports = router;