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

const normalizeDate = (dateStr) => {
  if (!dateStr) return null;

  // MM/DD/YY or MM/DD/YYYY → YYYY-MM-DD
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;

  let [mm, dd, yy] = parts;
  if (yy.length === 2) yy = `20${yy}`;

  return `${yy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
};


const getIdByName = (table, name, db) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT id FROM ${table} WHERE name = ?`,
            [name],
            (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return resolve(null);
                resolve(results[0].id);
            }
        );
    });
};
// ==================== HOME DATA (Protected) ====================
// Fetches all employee data (often used for dashboard/summary)
// router.get('/home', authenticateToken, (req, res) => {
//     db.query('SELECT * FROM `home`', (err, results) => {
//         if (err) {
//             console.error("❌ Home Data Error:", err);
//             return res.status(500).json({ message: 'Database fetch error', error: err.message });
//         }
//         res.status(200).json(results);
//     });
// });

//normalization

// ==================== HOME DATA (Protected) ====================
router.get('/home', authenticateToken, (req, res) => {
    // 🌟 जुन्या क्वेरी ऐवजी ही JOIN वाली क्वेरी वापरा
    const sql = `
        SELECT h.*, 
               d.name as department, 
               s.name as status, 
               w.name as working_mode, 
               e.name as emp_type
        FROM home h
        LEFT JOIN department d ON h.department_id = d.id
        LEFT JOIN status s ON h.status_id = s.id
        LEFT JOIN working_mode w ON h.mode_id = w.id
        LEFT JOIN emp_type e ON h.emp_type_id = e.id
    `;

    db.query(sql, (err, results) => {
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
    // const imageUrl = `${api_url}/uploads/${req.file.filename}`;
    const imageUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({ imageUrl });
});

// ==================== ADD EMPLOYEE (Protected - Matching Frontend Validation) ====================
// router.post('/employees', authenticateToken, (req, res) => {
//     const {
//         name, position, email, phone, gender, joining, leaving,
//         department, status, working_mode, emp_type, salary,
//         profile_pic, manager, birth, education, address, emer_cont_no, relation, referred_by, additional_information
//     } = req.body;

//     // --- ✅ Updated Validation Check (Matching Frontend Requirements) ---
//     // Required Fields: name, position, email, phone, gender, department, status, working_mode, emp_type, salary, education
//     if (!name || !position || !email || !phone || !gender || !department ||
//         !status || !working_mode || !emp_type || !salary || !education || !manager || !joining || ! birth) {
        
//         console.warn('⚠️ Missing required fields in ADD EMPLOYEE request:', req.body);
//         return res.status(400).json({ message: 'Required fields (Name, Position, Email, Phone, Gender, Department, Status, Working Mode, Employee Type, Salary, Education, Manager) are missing.' });
//     }
//     // --------------------------------------------------------------------------

//     // Treat 'leaving' field as NULL if empty, as per MySQL best practice for optional dates
//     const dateOfLeaving = leaving ? leaving : null; 

//     // Note: All fields are still inserted into the database, optional fields will be null/empty string if not provided.
//     const query = `INSERT INTO home 
//         (name, position, email, phone, gender, joining, leaving, department, status, working_mode, emp_type, salary, profile_pic, manager, birth, education, address, emer_cont_no, relation, referred_by, additional_information)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

//     const values = [
//         name, 
//         position, 
//         email, 
//         phone, 
//         gender, 
//         joining || null, // Optional: joining date can be null if not provided
//         dateOfLeaving, 
//         department, 
//         status, 
//         working_mode,
//         emp_type, 
//         salary, 
//         profile_pic || '', // Optional: profile_pic can be empty string
//         manager || '', 
//         birth || null, 
//         education, 
//         address || "", 
//         emer_cont_no || '', 
//         relation || '', 
//         referred_by || '',
//         additional_information || ''
//     ];

//     db.query(query, values, (err, result) => {
//         if (err) {
//             console.error("❌ Database Insert Error:", err);
//             if (err.code === 'ER_DUP_ENTRY') {
//                  return res.status(409).json({ message: 'Email or phone number already registered.', error: err.message });
//             }
//             return res.status(500).json({ message: 'Database insert error.', error: err.message });
//         }
//         res.status(201).json({ message: 'Employee added successfully!', id: result.insertId });
//     });
// });

//normalization
router.post('/employees', authenticateToken, async (req, res) => {
    try {
        const {
            name, position, email, phone, gender, joining, leaving,
            department, status, working_mode, emp_type, salary,
            profile_pic, manager, birth, education, address,
            emer_cont_no, relation, referred_by, additional_information
        } = req.body;

        // ✅ Basic validation
        if (!name || !email || !department || !status || !working_mode || !emp_type) {
            return res.status(400).json({ message: 'Required fields missing' });
        }

        // 🔑 Normalize function (VERY IMPORTANT)
        // const normalize = (v) => v?.toLowerCase().trim();
        const normalize = (v) => v?.toLowerCase().trim().replace(/\s+/g, '-');



        // 🔑 TEXT → ID mapping (NORMALIZED)
        const department_id = await getIdByName('department', normalize(department), db);
        const status_id = await getIdByName('status', normalize(status), db);
        const mode_id = await getIdByName('working_mode', normalize(working_mode), db);
        const emp_type_id = await getIdByName('emp_type', normalize(emp_type), db);

        // 🔍 DEBUG LOGS (TEMPORARY)
        console.log('Incoming values:', {
            department,
            status,
            working_mode,
            emp_type
        });

        console.log('Mapped IDs:', {
            department_id,
            status_id,
            mode_id,
            emp_type_id
        });

        // ❌ Invalid master data check
        if (!department_id || !status_id || !mode_id || !emp_type_id) {
            return res.status(400).json({ message: 'Invalid master data value' });
        }

        // ✅ Insert query (ONLY _id columns)
        const query = `
            INSERT INTO home (
                name, position, email, phone, gender, joining, leaving,
                department_id, status_id, mode_id, emp_type_id,
                salary, profile_pic, manager, birth, education,
                address, emer_cont_no, relation, referred_by, additional_information
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            name, position, email, phone, gender,
            joining || null, leaving || null,
            department_id, status_id, mode_id, emp_type_id,
            salary, profile_pic || '', manager || '',
            birth || null, education,
            address || '', emer_cont_no || '',
            relation || '', referred_by || '', additional_information || ''
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error('❌ Insert error:', err);
                return res.status(500).json({ message: 'Insert failed' });
            }

            res.status(201).json({
                message: 'Employee added successfully',
                id: result.insertId
            });
        });

    } catch (err) {
        console.error('❌ Server error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

//normalization update
// router.put('/employees/:id', authenticateToken, async (req, res) => {
//     try {
//         const { id } = req.params;
//         const {
//             name, position, email, phone, gender, joining, leaving,
//             department_id, status_id, mode_id, emp_type_id, salary, 
//             profile_pic, manager, birth, education, address,
//             emer_cont_no, relation, referred_by, additional_information
//         } = req.body;

//         // SQL Query - जिथे आपण थेट IDs वापरत आहोत
//         const query = `
//             UPDATE home SET
//                 name=?, position=?, email=?, phone=?, gender=?,
//                 joining=?, leaving=?,
//                 department_id=?, status_id=?, mode_id=?, emp_type_id=?,
//                 salary=?, profile_pic=?, manager=?, birth=?, education=?,
//                 address=?, emer_cont_no=?, relation=?, referred_by=?, additional_information=?
//             WHERE id=?
//         `;

//         const values = [
//             name, position, email, phone, (gender || "").toLowerCase(),
//             joining || null, leaving || null,
//             Number(department_id),  // थेट ID
//             Number(status_id),      // थेट ID
//             Number(mode_id),        // थेट ID
//             Number(emp_type_id),    // थेट ID
//             salary, 
//             profile_pic || '', 
//             manager || '',
//             birth || null, 
//             education,
//             address || '', 
//             emer_cont_no || '',
//             relation || '', 
//             referred_by || '', 
//             additional_information || '',
//             id
//         ];

//         db.query(query, values, (err, result) => {
//             if (err) {
//                 console.error("Database Error:", err);
//                 return res.status(500).json({ message: 'Update failed' });
//             }

//             if (result.affectedRows === 0) {
//                 return res.status(404).json({ message: 'Employee not found' });
//             }

//             res.status(200).json({ message: 'Employee updated successfully' });
//         });

//     } catch (err) {
//         console.error("Server Error:", err);
//         res.status(500).json({ message: 'Server error' });
//     }
// });
// router.put('/employees/:id', authenticateToken, async (req, res) => {
//     try {
//         const { id } = req.params;

//         const {
//             name, position, email, phone, gender, joining, leaving,
//             department, status, working_mode, emp_type,
//             salary, profile_pic, manager, birth, education,
//             address, emer_cont_no, relation, referred_by, additional_information
//         } = req.body;

//         const normalize = v => v?.toLowerCase().trim();

//         // 🔑 TEXT → ID mapping
//         const department_id = await getIdByName('department', normalize(department), db);
//         const status_id     = await getIdByName('status', normalize(status), db);
//         const mode_id       = await getIdByName('mode', normalize(working_mode), db);
//         const emp_type_id   = await getIdByName('emp_type', normalize(emp_type), db);

//         if (!department_id || !status_id || !mode_id || !emp_type_id) {
//             return res.status(400).json({ message: 'Invalid master data value' });
//         }

//         // 🔹 Fetch old image
//         const [rows] = await db.promise().query(
//             'SELECT profile_pic FROM home WHERE id = ?',
//             [id]
//         );

//         if (!rows.length) {
//             return res.status(404).json({ message: 'Employee not found' });
//         }

//         const oldImage = rows[0].profile_pic;

//         const finalProfilePic =
//             profile_pic && profile_pic.startsWith('/uploads/')
//                 ? profile_pic
//                 : oldImage;

//         const query = `
//             UPDATE home SET
//                 name=?, position=?, email=?, phone=?, gender=?,
//                 joining=?, leaving=?,
//                 department_id=?, status_id=?, mode_id=?, emp_type_id=?,
//                 salary=?, profile_pic=?, manager=?, birth=?, education=?,
//                 address=?, emer_cont_no=?, relation=?, referred_by=?, additional_information=?
//             WHERE id=?
//         `;

//         const values = [
//             name, position, email, phone, gender?.toLowerCase(),
//             joining || null, leaving || null,
//             department_id, status_id, mode_id, emp_type_id,
//             salary, finalProfilePic, manager || '',
//             birth || null, education,
//             address || '', emer_cont_no || '',
//             relation || '', referred_by || '', additional_information || '',
//             id
//         ];

//         await db.promise().query(query, values);

//         res.json({ message: 'Employee updated successfully' });

//     } catch (err) {
//         console.error('❌ UPDATE ERROR:', err);
//         res.status(500).json({ message: 'Update failed' });
//     }
// });


router.put('/employees/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name, position, email, phone, gender, joining, leaving,
            department, status, working_mode, emp_type,
            salary, profile_pic, manager, birth, education,
            address, emer_cont_no, relation, referred_by, additional_information
        } = req.body;

        // ✅ SAFE NORMALIZE (string + number support)
        const normalize = v =>
            v === null || v === undefined
                ? null
                : String(v).toLowerCase().trim();

        // 🔑 TEXT → ID mapping
        const department_id = await getIdByName('department', normalize(department), db);
        const status_id     = await getIdByName('status', normalize(status), db);
        const mode_id       = await getIdByName('mode', normalize(working_mode), db);
        const emp_type_id   = await getIdByName('emp_type', normalize(emp_type), db);

        if (!department_id || !status_id || !mode_id || !emp_type_id) {
            return res.status(400).json({ message: 'Invalid master data value' });
        }

        // 🔹 Fetch old image
        const [rows] = await db.promise().query(
            'SELECT profile_pic FROM home WHERE id = ?',
            [id]
        );

        if (!rows.length) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const oldImage = rows[0].profile_pic;

        // 🔹 Preserve old image if not changed
        const finalProfilePic =
            profile_pic && profile_pic.startsWith('/uploads/')
                ? profile_pic
                : oldImage;

        const query = `
            UPDATE home SET
                name=?, position=?, email=?, phone=?, gender=?,
                joining=?, leaving=?,
                department_id=?, status_id=?, mode_id=?, emp_type_id=?,
                salary=?, profile_pic=?, manager=?, birth=?, education=?,
                address=?, emer_cont_no=?, relation=?, referred_by=?, additional_information=?
            WHERE id=?
        `;

        const values = [
            name,
            position,
            email,
            phone,
            gender?.toLowerCase() || null,
            joining || null,
            leaving || null,
            department_id,
            status_id,
            mode_id,
            emp_type_id,
            salary,
            finalProfilePic,
            manager || '',
            birth || null,
            education,
            address || '',
            emer_cont_no || '',
            relation || '',
            referred_by || '',
            additional_information || '',
            id
        ];

        await db.promise().query(query, values);

        res.json({ message: 'Employee updated successfully' });

    } catch (err) {
        console.error('❌ UPDATE ERROR:', err);
        res.status(500).json({ message: 'Update failed' });
    }
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
        referred_by: 'HR',
        additional_information: 'Alternate No. 9874563215'
    }];

    const worksheet = xlsx.utils.json_to_sheet(sampleData);
    const csvData = xlsx.utils.sheet_to_csv(worksheet);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="sample_employee_import_file.csv"');
    res.status(200).send(csvData);
});

// ==================== EXPORT CSV (Protected) ====================
router.get('/employees/export-csv', authenticateToken, (req, res) => {
    const searchTerm = req.query.search || '';
    const statusFilter = req.query.filter || 'All';

    // 🌟 JOIN वापरून Query तयार करा जेणेकरून ID ऐवजी नावे मिळतील
    let sqlQuery = `
        SELECT h.id, h.name, h.manager, 
               d.name as department, 
               h.salary, h.email, h.phone, h.position, h.birth, 
               s.name as status, 
               h.education, h.joining, h.leaving, 
               w.name as working_mode, 
               e.name as emp_type, 
               h.address, h.gender, h.emer_cont_no, h.relation, h.referred_by, h.additional_information
        FROM home h
        LEFT JOIN department d ON h.department_id = d.id
        LEFT JOIN status s ON h.status_id = s.id
        LEFT JOIN working_mode w ON h.mode_id = w.id
        LEFT JOIN emp_type e ON h.emp_type_id = e.id
        WHERE 1=1
    `;

    const queryParams = [];

    // Search आणि Filter लॉजिक (तुमच्या buildEmployeeQuery प्रमाणेच)
    if (searchTerm) {
        sqlQuery += ` AND (h.name LIKE ? OR h.email LIKE ? OR h.phone LIKE ?)`;
        const searchVal = `%${searchTerm}%`;
        queryParams.push(searchVal, searchVal, searchVal);
    }

    if (statusFilter !== 'All') {
        sqlQuery += ` AND s.name = ?`;
        queryParams.push(statusFilter.toLowerCase());
    }

    db.query(sqlQuery, queryParams, (err, results) => {
        if (err) {
            console.error("❌ CSV Export DB Error:", err);
            return res.status(500).json({ message: 'Internal server error during export.' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ message: 'No employees found to export.' });
        }

        const worksheet = xlsx.utils.json_to_sheet(results);
        const csvData = xlsx.utils.sheet_to_csv(worksheet);
        
        let downloadName = `employees_${statusFilter.toLowerCase()}`;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${downloadName}.csv`);
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

    // IFNULL वापरल्यामुळे डेटा नसला तरी N/A येणार नाही, त्याऐवजी ID दिसेल
    const sql = `
        SELECT 
            h.*, 
            IFNULL(d.name, h.department_id) AS department_name, 
            IFNULL(s.name, h.status_id) AS status_name, 
            IFNULL(wm.name, h.mode_id) AS mode_name, 
            IFNULL(et.name, h.emp_type_id) AS emp_type_name
        FROM home h
        LEFT JOIN department d ON h.department_id = d.id
        LEFT JOIN status s ON h.status_id = s.id
        LEFT JOIN working_mode wm ON h.mode_id = wm.id
        LEFT JOIN emp_type et ON h.emp_type_id = et.id
        WHERE h.id = ?
    `;

    db.query(sql, [employeeId], (err, results) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({ message: 'Internal server error.' });
        }
        
        if (results.length > 0) {
            // खात्री करण्यासाठी हे टर्मिनलमध्ये प्रिंट करा
            console.log("Fetched Employee Details:", results[0]); 
            res.status(200).json(results[0]);
        } else {
            res.status(404).json({ message: 'Employee not found.' });
        }
    });
});

// ==================== IMPORT CSV (Protected - with improved Error Handling) ====================
router.post(
  '/employees/import',
  authenticateToken,
  csvUpload.single('employeesFile'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    const normalize = (v) => v?.toLowerCase().trim().replace(/\s+/g, '-');

    const filePath = req.file.path;
    const employeesToInsert = [];
    let rowCount = 0;
    let skippedRows = 0;

    const requiredFields = [
      'name', 'department', 'email', 'salary', 'phone', 
      'position', 'status', 'education', 'working_mode', 
      'emp_type', 'gender'
    ];

    const cleanupFile = () => {
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (err) {
        console.error('❌ File cleanup error:', err);
      }
    };

    const safe = (val) =>
      val && String(val).trim() !== '' ? String(val).trim() : null;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        rowCount++;
        const isValid = requiredFields.every(
          (field) => row[field] && String(row[field]).trim() !== ''
        );

        if (!isValid) {
          skippedRows++;
          return;
        }

        // CSV मधून आलेला कच्चा डेटा गोळा करणे
        employeesToInsert.push([
          safe(row.name), safe(row.position), safe(row.email), safe(row.phone),
          safe(row.gender), normalizeDate(row.joining), normalizeDate(row.leaving),
          normalize(row.department), normalize(row.status), normalize(row.working_mode), normalize(row.emp_type),
          safe(row.salary), safe(row.profile_pic) || '', safe(row.manager),
          normalizeDate(row.birth), safe(row.education), safe(row.address),
          safe(row.emer_cont_no), safe(row.relation), safe(row.referred_by),
          safe(row.additional_information)
        ]);
      })
      .on('end', async () => {
        cleanupFile();

        if (employeesToInsert.length === 0) {
          return res.status(400).json({
            message: `No valid rows found. Total processed: ${rowCount}, Skipped: ${skippedRows}`
          });
        }

        try {
          const normalizedRows = [];

          for (const row of employeesToInsert) {
            // १. नावे शोधताना toLowerCase() वापरा
            // २. 'mode' ऐवजी 'working_mode' टेबल नाव वापरा
            const department_id = await getIdByName('department', row[7].toLowerCase(), db);
            const status_id     = await getIdByName('status', row[8].toLowerCase(), db);
            const mode_id       = await getIdByName('working_mode', row[9].toLowerCase(), db); 
            const emp_type_id   = await getIdByName('emp_type', row[10].toLowerCase(), db);

            // जर मास्टर टेबलमध्ये नाव सापडले नाही तर ती ओळ स्किप करा
            if (!department_id || !status_id || !mode_id || !emp_type_id) {
              skippedRows++;
              continue;
            }

            normalizedRows.push([
              row[0], row[1], row[2], row[3], row[4],
              row[5], row[6],
              department_id, status_id, mode_id, emp_type_id, // IDs साठवले
              row[11], row[12], row[13], row[14], row[15],
              row[16], row[17], row[18], row[19], row[20]
            ]);
          }

          if (normalizedRows.length === 0) {
            return res.status(400).json({
              message: 'All rows skipped due to invalid master data (check spellings in CSV).'
            });
          }

          // डेटाबेस कॉलमची नावे तुमच्या स्ट्रक्चरनुसार (Screenshot 121)
          const insertQuery = `
            INSERT INTO home (
              name, position, email, phone, gender,
              joining, leaving,
              department_id, status_id, mode_id, emp_type_id,
              salary, profile_pic, manager, birth, education,
              address, emer_cont_no, relation, referred_by, additional_information
            ) VALUES ?
          `;

          db.query(insertQuery, [normalizedRows], (err, result) => {
            if (err) {
              console.error('❌ CSV Import DB Error:', err);
              return res.status(500).json({ message: 'CSV import failed.', error: err.message });
            }

            res.status(200).json({
              message: `${result.affectedRows} employees imported successfully.`,
              importedCount: result.affectedRows,
              skippedCount: skippedRows
            });
          });

        } catch (err) {
          console.error('❌ CSV Normalization Error:', err);
          res.status(500).json({ message: 'Server error during CSV import.' });
        }
      })
      .on('error', (err) => {
        cleanupFile();
        res.status(500).json({ message: 'CSV parsing failed.' });
      });
  }
);

module.exports = router;