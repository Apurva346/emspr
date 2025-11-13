// import React, { useState, useRef, useEffect } from 'react'
// import { Navbar as BootstrapNavbar, Container, Button } from 'react-bootstrap'
// import { Link } from 'react-router-dom'
// // ✅ FIX: तुमचा कॉन्फिगर केलेला axios instance इम्पोर्ट करा.
// import axiosInstance from './axiosconfig' 

// const Navbar = ({
//   onShowAddModal,
//   fetchEmployees, 
//   searchTerm,
//   statusFilter,
//   fetchEmployeesWithSearch 
// }) => {
//   const [file, setFile] = useState(null)
//   const fileInputRef = useRef(null)
//   const [loadingImport, setLoadingImport] = useState(false)

//   useEffect(() => {
//     if (file) {
//       handleImport()
//     }
//   }, [file])

//   // 1. Export CSV with Search and Filter
//   const handleExportCsv = async () => {
//     try {
//       // ✅ Base URL काढून फक्त API path वापरला.
//       const exportUrl = `/employees/export-csv?search=${searchTerm}&filter=${statusFilter}`

//       // ✅ axios च्या ऐवजी axiosInstance वापरला.
//       const response = await axiosInstance.get(exportUrl, { responseType: 'blob' }) 

//       const blob = new Blob([response.data], { type: 'text/csv' })
//       const url = window.URL.createObjectURL(blob)
//       const a = document.createElement('a')
//       a.href = url
//       a.download = `employees_${statusFilter}_${searchTerm || 'all'}.csv`
//       document.body.appendChild(a)
//       a.click()
//       a.remove()
//       window.URL.revokeObjectURL(url)

//       if (fetchEmployeesWithSearch) {
//         fetchEmployeesWithSearch(searchTerm, statusFilter)
//       }
//     } catch (error) {
//       console.error('Export failed', error)
//       if (error.response && error.response.status === 404) {
//         alert(
//           'No employees found to export with the current search and filters.'
//         )
//       } else {
//         alert('Failed to export employees.')
//       }
//     }
//   }


//   const handleDownloadSample = async () => {
//     try {
//       // ✅ axios च्या ऐवजी axiosInstance वापरला. (Path `/sample-csv` बेस URL मध्ये /api जोडल्यावर व्यवस्थित काम करेल.)
//       const response = await axiosInstance.get(
//         '/sample-csv', 
//         { responseType: 'blob' }
//       )

//       const blob = new Blob([response.data], { type: 'text/csv' })
//       const url = window.URL.createObjectURL(blob)
//       const a = document.createElement('a')
//       a.href = url
//       a.download = 'sample_employee_import_file.csv'
//       document.body.appendChild(a)
//       a.click()
//       a.remove()
//       window.URL.revokeObjectURL(url)

//       console.log('Sample file download successful.')
//     } catch (error) {
//       console.error('Sample file download failed:', error)
//       console.error(
//         'Failed to download sample file. Check your backend server and proxy settings.'
//       )
//     }
//   }

//   // 3. Import File Handling
//   const handleFileSelect = e => {
//     setFile(e.target.files[0])
//   }

//   const handleImport = async () => {
//     if (!file) {
//       alert('Please select a CSV file to import.')
//       return
//     }

//     setLoadingImport(true)

//     const formData = new FormData()
//     formData.append('employeesFile', file)

//     try {
//       // ✅ Hardcoded URL काढून फक्त API path वापरला आणि axiosInstance वापरला.
//       const response = await axiosInstance.post(
//         '/employees/import', // Base URL (http://localhost:3001/api) आपोआप जोडला जाईल
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         }
//       )
//       alert(response.data.message || 'Employees imported successfully!')
      
//       // 👇 हा कोड employee list refresh करेल:
//       if (fetchEmployeesWithSearch) {
//           fetchEmployeesWithSearch(searchTerm, statusFilter)
//       } else {
//           fetchEmployees()
//       }
      
//     } catch (error) {
//       console.error('Import failed', error)
//       alert(error.response?.data?.message || 'Failed to import employees.')
//     } finally {
//       setLoadingImport(false)
//       setFile(null)
//       if (fileInputRef.current) {
//         fileInputRef.current.value = ''
//       }
//     }
//   }

//   return (
//     // ... JSX code for Navbar remains the same ...
//     <BootstrapNavbar bg='dark' variant='dark' expand='lg' className='px-3'>
//       <Container
//         fluid
//         className='d-flex justify-content-between align-items-center'
//       >
//         <BootstrapNavbar.Brand
//           as={Link}
//           to='/home'
//           className='fw-bold fs-4 text-white'
//         >
//           Employee Management System
//         </BootstrapNavbar.Brand>

//         <div className='d-flex gap-2'>
//           {/* Add Employee Button (Link to a page) */}
//           <Link
//             to='/add-employee'
//             className='btn btn-outline-primary py-2 d-flex align-items-center'
//           >
//             <i className='fas fa-user-plus me-2'></i> Add Employee
//           </Link>

//           {/* Export CSV Button (with Search/Filter) */}
//           <Button
//             variant='outline-success'
//             className='py-2 d-flex align-items-center'
//             onClick={handleExportCsv}
//           >
//             <i className='fas fa-file-csv me-2'></i> Export CSV
//           </Button>

//           {/* Download Sample File Button */}
//           <Button
//             variant='outline-info'
//             className='py-2 d-flex align-items-center'
//             onClick={handleDownloadSample}
//           >
//             <i className='fas fa-download me-2'></i> Sample File
//           </Button>

//           {/* Hidden file input for import */}
//           <input
//             type='file'
//             ref={fileInputRef}
//             onChange={handleFileSelect}
//             // CSV files accept karayche
//             accept='.csv'
//             style={{ display: 'none' }}
//           />

//           {/* Import CSV button that triggers the file input */}
//           <Button
//             variant='outline-warning'
//             className='py-2 d-flex align-items-center'
//             onClick={() => fileInputRef.current.click()}
//             disabled={loadingImport}
//           >
//             {loadingImport ? (
//               <>
//                 <i className='fas fa-spinner fa-spin me-2'></i> Importing...
//               </>
//             ) : (
//               <>
//                 <i className='fas fa-file-import me-2'></i> Import File
//               </>
//             )}
//           </Button>
//         </div>
//       </Container>
//     </BootstrapNavbar>
//   )
// }

// export default Navbar


// import React, { useState, useRef } from 'react'
// import { Navbar as BootstrapNavbar, Container, Button, Table } from 'react-bootstrap'
// import { Link } from 'react-router-dom'
// import axiosInstance from './axiosconfig'
// import Papa from 'papaparse'

// const Navbar = ({
//   onShowAddModal,
//   fetchEmployees, 
//   searchTerm,
//   statusFilter,
//   fetchEmployeesWithSearch 
// }) => {
//   const [file, setFile] = useState(null)
//   const [rows, setRows] = useState([])                  // CSV rows
//   const [errors, setErrors] = useState([])              // Validation errors
//   const [loadingImport, setLoadingImport] = useState(false)
//   const fileInputRef = useRef(null)

//   const mandatoryFields = [
//     "name","department","salary","email","phone","position","status",
//     "education","working_mode","emp_type","gender"
//   ]

//   // ===== File Selection & Parsing =====
//   const handleFileSelect = e => {
//     const selectedFile = e.target.files[0]
//     if (!selectedFile) return
//     setFile(selectedFile)

//     Papa.parse(selectedFile, {
//       header: true,
//       skipEmptyLines: true,
//       complete: (results) => {
//         setRows(results.data)
//         validateRows(results.data)
//       },
//       error: (err) => {
//         alert('Failed to parse CSV file. Please check the format.')
//         console.error(err)
//       }
//     })
//   }

//   // ===== Validation =====
//   const validateRows = (data) => {
//     const errs = []
//     data.forEach((row, index) => {
//       const missing = mandatoryFields.filter(
//         field => !row[field] || row[field].trim() === ""
//       )
//       if (missing.length > 0) {
//         errs.push({ row: index + 1, missing })
//       }
//     })
//     setErrors(errs)
//   }

//   // ===== Inline Edit =====
//   const handleCellChange = (rowIndex, field, value) => {
//     const updatedRows = [...rows]
//     updatedRows[rowIndex][field] = value
//     setRows(updatedRows)
//     validateRows(updatedRows)
//   }

//   // ===== Import to Backend =====
//   const handleImport = async () => {
//     if (errors.length > 0) {
//       alert('Please fix errors before importing!')
//       return
//     }
//     setLoadingImport(true)
//     try {
//       const formData = new FormData()
//       const blob = new Blob([JSON.stringify(rows)], { type: 'application/json' })
//       formData.append('employeesFile', blob, 'employees.json') // backend parse करेल

//       const response = await axiosInstance.post('/employees/import', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       })
//       alert(response.data.message || 'Employees imported successfully!')
//       setRows([])
//       setErrors([])

//       if (fetchEmployeesWithSearch) fetchEmployeesWithSearch(searchTerm, statusFilter)
//       else fetchEmployees()
//     } catch (err) {
//       console.error('Import failed', err)
//       alert(err.response?.data?.message || 'Failed to import employees.')
//     } finally {
//       setLoadingImport(false)
//       setFile(null)
//       if (fileInputRef.current) fileInputRef.current.value = ''
//     }
//   }

//   // ===== Export & Sample Download =====
//   const handleExportCsv = async () => {
//     try {
//       const exportUrl = `/employees/export-csv?search=${searchTerm}&filter=${statusFilter}`
//       const response = await axiosInstance.get(exportUrl, { responseType: 'blob' })
//       const blob = new Blob([response.data], { type: 'text/csv' })
//       const url = window.URL.createObjectURL(blob)
//       const a = document.createElement('a')
//       a.href = url
//       a.download = `employees_${statusFilter}_${searchTerm || 'all'}.csv`
//       a.click()
//       a.remove()
//       window.URL.revokeObjectURL(url)
//     } catch (err) {
//       console.error(err)
//       alert('Failed to export CSV')
//     }
//   }

//   const handleDownloadSample = async () => {
//     try {
//       const response = await axiosInstance.get('/sample-csv', { responseType: 'blob' })
//       const blob = new Blob([response.data], { type: 'text/csv' })
//       const url = window.URL.createObjectURL(blob)
//       const a = document.createElement('a')
//       a.href = url
//       a.download = 'sample_employee_import_file.csv'
//       a.click()
//       a.remove()
//       window.URL.revokeObjectURL(url)
//     } catch (err) {
//       console.error(err)
//       alert('Failed to download sample file')
//     }
//   }

//   return (
//     <>
//       <BootstrapNavbar bg='dark' variant='dark' expand='lg' className='px-3'>
//         <Container fluid className='d-flex justify-content-between align-items-center'>
//           <BootstrapNavbar.Brand as={Link} to='/home' className='fw-bold fs-4 text-white'>
//             Employee Management System
//           </BootstrapNavbar.Brand>

//           <div className='d-flex gap-2'>
//             <Link to='/add-employee' className='btn btn-outline-primary py-2'>
//               <i className='fas fa-user-plus me-2'></i> Add Employee
//             </Link>

//             <Button variant='outline-success' onClick={handleExportCsv}>Export CSV</Button>
//             <Button variant='outline-info' onClick={handleDownloadSample}>Sample File</Button>

//             <input
//               type='file'
//               ref={fileInputRef}
//               accept='.csv'
//               style={{ display: 'none' }}
//               onChange={handleFileSelect}
//             />

//             <Button
//               variant='outline-warning'
//               onClick={() => fileInputRef.current.click()}
//               disabled={loadingImport}
//             >
//               {loadingImport ? 'Importing...' : 'Import File'}
//             </Button>
//           </div>
//         </Container>
//       </BootstrapNavbar>

//       {/* ===== CSV Preview Table ===== */}
//       {rows.length > 0 && (
//         <div className='container mt-3'>
//           <h5>CSV Preview</h5>
//           <Table bordered hover>
//             <thead>
//               <tr>
//                 {Object.keys(rows[0]).map((col, idx) => <th key={idx}>{col}</th>)}
//               </tr>
//             </thead>
//             <tbody>
//               {rows.map((row, rowIndex) => (
//                 <tr key={rowIndex}>
//                   {Object.keys(row).map((field, colIndex) => (
//                     <td
//                       key={colIndex}
//                       contentEditable
//                       style={{
//                         backgroundColor: mandatoryFields.includes(field) && (!row[field] || row[field].trim() === "") ? '#ffcccc' : 'transparent'
//                       }}
//                       suppressContentEditableWarning={true}
//                       onBlur={e => handleCellChange(rowIndex, field, e.target.innerText)}
//                     >
//                       {row[field]}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </Table>

//           {errors.length > 0 && (
//             <div className='alert alert-danger'>
//               <strong>Errors:</strong>
//               <ul>
//                 {errors.map((err, idx) => (
//                   <li key={idx}>Row {err.row}: Missing fields - {err.missing.join(', ')}</li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           <Button variant='success' onClick={handleImport} disabled={errors.length > 0 || loadingImport}>
//             Import Valid Rows
//           </Button>
//         </div>
//       )}
//     </>
//   )
// }

// export default Navbar


// import React, { useState, useRef } from 'react'
// import { Navbar as BootstrapNavbar, Container, Button, Table, Modal } from 'react-bootstrap'
// import { Link } from 'react-router-dom'
// import axiosInstance from './axiosconfig'
// import Papa from 'papaparse'

// const Navbar = ({
//   onShowAddModal,
//   fetchEmployees, 
//   searchTerm,
//   statusFilter,
//   fetchEmployeesWithSearch 
// }) => {
//   const [file, setFile] = useState(null)
//   const [rows, setRows] = useState([])                  // CSV rows
//   const [errors, setErrors] = useState([])              // Validation errors
//   const [loadingImport, setLoadingImport] = useState(false)
//   const [showPreview, setShowPreview] = useState(false) // Modal show/hide
//   const fileInputRef = useRef(null)

//   const mandatoryFields = [
//     "name","department","salary","email","phone","position","status",
//     "education","working_mode","emp_type","gender"
//   ]

//   // ===== File Selection & Parsing =====
//   const handleFileSelect = e => {
//     const selectedFile = e.target.files[0]
//     if (!selectedFile) return
//     setFile(selectedFile)

//     Papa.parse(selectedFile, {
//       header: true,
//       skipEmptyLines: true,
//       complete: (results) => {
//         setRows(results.data)
//         validateRows(results.data)
//         setShowPreview(true) // ✅ Open modal on file select
//       },
//       error: (err) => {
//         alert('Failed to parse CSV file. Please check the format.')
//         console.error(err)
//       }
//     })
//   }

//   // ===== Validation =====
//   const validateRows = (data) => {
//     const errs = []
//     data.forEach((row, index) => {
//       const missing = mandatoryFields.filter(
//         field => !row[field] || row[field].trim() === ""
//       )
//       if (missing.length > 0) {
//         errs.push({ row: index + 1, missing })
//       }
//     })
//     setErrors(errs)
//   }

//   // ===== Inline Edit =====
//   const handleCellChange = (rowIndex, field, value) => {
//     const updatedRows = [...rows]
//     updatedRows[rowIndex][field] = value
//     setRows(updatedRows)
//     validateRows(updatedRows)
//   }

//   // ===== Import to Backend =====
//   const handleImport = async () => {
//     if (errors.length > 0) {
//       alert('Please fix errors before importing!')
//       return
//     }
//     setLoadingImport(true)
//     try {
//       const formData = new FormData()
//       const blob = new Blob([JSON.stringify(rows)], { type: 'application/json' })
//       formData.append('employeesFile', blob, 'employees.json') // backend parse करेल

//       const response = await axiosInstance.post('/employees/import', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       })
//       alert(response.data.message || 'Employees imported successfully!')
//       setRows([])
//       setErrors([])
//       setShowPreview(false)

//       if (fetchEmployeesWithSearch) fetchEmployeesWithSearch(searchTerm, statusFilter)
//       else fetchEmployees()
//     } catch (err) {
//       console.error('Import failed', err)
//       alert(err.response?.data?.message || 'Failed to import employees.')
//     } finally {
//       setLoadingImport(false)
//       setFile(null)
//       if (fileInputRef.current) fileInputRef.current.value = ''
//     }
//   }

//   // ===== Export & Sample Download =====
//   const handleExportCsv = async () => {
//     try {
//       const exportUrl = `/employees/export-csv?search=${searchTerm}&filter=${statusFilter}`
//       const response = await axiosInstance.get(exportUrl, { responseType: 'blob' })
//       const blob = new Blob([response.data], { type: 'text/csv' })
//       const url = window.URL.createObjectURL(blob)
//       const a = document.createElement('a')
//       a.href = url
//       a.download = `employees_${statusFilter}_${searchTerm || 'all'}.csv`
//       a.click()
//       a.remove()
//       window.URL.revokeObjectURL(url)
//     } catch (err) {
//       console.error(err)
//       alert('Failed to export CSV')
//     }
//   }

//   const handleDownloadSample = async () => {
//     try {
//       const response = await axiosInstance.get('/sample-csv', { responseType: 'blob' })
//       const blob = new Blob([response.data], { type: 'text/csv' })
//       const url = window.URL.createObjectURL(blob)
//       const a = document.createElement('a')
//       a.href = url
//       a.download = 'sample_employee_import_file.csv'
//       a.click()
//       a.remove()
//       window.URL.revokeObjectURL(url)
//     } catch (err) {
//       console.error(err)
//       alert('Failed to download sample file')
//     }
//   }

//   return (
//     <>
//       <BootstrapNavbar bg='dark' variant='dark' expand='lg' className='px-3'>
//         <Container fluid className='d-flex justify-content-between align-items-center'>
//           <BootstrapNavbar.Brand as={Link} to='/home' className='fw-bold fs-4 text-white'>
//             Employee Management System
//           </BootstrapNavbar.Brand>

//           <div className='d-flex gap-2'>
//             <Link to='/add-employee' className='btn btn-outline-primary py-2'>
//               <i className='fas fa-user-plus me-2'></i> Add Employee
//             </Link>

//             <Button variant='outline-success' onClick={handleExportCsv}>Export CSV</Button>
//             <Button variant='outline-info' onClick={handleDownloadSample}>Sample File</Button>

//             <input
//               type='file'
//               ref={fileInputRef}
//               accept='.csv'
//               style={{ display: 'none' }}
//               onChange={handleFileSelect}
//             />

//             <Button
//               variant='outline-warning'
//               onClick={() => fileInputRef.current.click()}
//               disabled={loadingImport}
//             >
//               {loadingImport ? 'Importing...' : 'Import File'}
//             </Button>
//           </div>
//         </Container>
//       </BootstrapNavbar>

//       {/* ===== CSV Preview Modal ===== */}
//       <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>CSV Preview</Modal.Title>
//         </Modal.Header>
//         <Modal.Body style={{ overflowX: 'auto' }}>
//           {rows.length > 0 && (
//             <Table bordered hover style={{ minWidth: '800px' }}>
//               <thead>
//                 <tr>
//                   {Object.keys(rows[0]).map((col, idx) => <th key={idx}>{col}</th>)}
//                 </tr>
//               </thead>
//               <tbody>
//                 {rows.map((row, rowIndex) => (
//                   <tr key={rowIndex}>
//                     {Object.keys(row).map((field, colIndex) => (
//                       <td
//                         key={colIndex}
//                         contentEditable
//                         style={{
//                           backgroundColor: mandatoryFields.includes(field) && (!row[field] || row[field].trim() === "") ? '#ffcccc' : 'transparent'
//                         }}
//                         suppressContentEditableWarning={true}
//                         onBlur={e => handleCellChange(rowIndex, field, e.target.innerText)}
//                       >
//                         {row[field]}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           )}

//           {errors.length > 0 && (
//             <div className='alert alert-danger mt-2'>
//               <strong>Errors:</strong>
//               <ul>
//                 {errors.map((err, idx) => (
//                   <li key={idx}>Row {err.row}: Missing fields - {err.missing.join(', ')}</li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowPreview(false)}>Close</Button>
//           <Button variant="success" onClick={handleImport} disabled={errors.length > 0 || loadingImport}>
//             Import Valid Rows
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   )
// }

// export default Navbar


import React, { useState, useRef } from 'react'
import { Navbar as BootstrapNavbar, Container, Button, Table, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axiosInstance from './axiosconfig'
import Papa from 'papaparse'

const Navbar = ({
  fetchEmployees,
  searchTerm,
  statusFilter,
  fetchEmployeesWithSearch
}) => {
  const [file, setFile] = useState(null)
  const [rows, setRows] = useState([])                  // CSV rows
  const [errors, setErrors] = useState([])              // Validation errors
  const [importErrors, setImportErrors] = useState([])  // Backend import errors
  const [loadingImport, setLoadingImport] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const fileInputRef = useRef(null)

  const mandatoryFields = [
    "name","department","salary","email","phone","position","status",
    "education","working_mode","emp_type","gender"
  ]

  // ===== File Selection & Parsing =====
  const handleFileSelect = e => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return
    setFile(selectedFile)

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setRows(results.data)
        validateRows(results.data)
        setShowModal(true)  // show preview modal automatically
      },
      error: (err) => {
        alert('Failed to parse CSV file. Please check the format.')
        console.error(err)
      }
    })
  }

  // ===== Validation =====
  const validateRows = (data) => {
    const errs = []
    data.forEach((row, index) => {
      const missing = mandatoryFields.filter(
        field => !row[field] || row[field].trim() === ""
      )
      if (missing.length > 0) {
        errs.push({ row: index + 1, missing })
      }
    })
    setErrors(errs)
  }

  // ===== Inline Edit =====
  const handleCellChange = (rowIndex, field, value) => {
    const updatedRows = [...rows]
    updatedRows[rowIndex][field] = value
    setRows(updatedRows)
    validateRows(updatedRows)
  }

  // ===== Import to Backend =====
  const handleImport = async () => {
    if (errors.length > 0) {
      alert('Please fix validation errors before importing!')
      return
    }

    setLoadingImport(true)
    setImportErrors([])

    try {
      const formData = new FormData()
      const blob = new Blob([JSON.stringify(rows)], { type: 'application/json' })
      formData.append('employeesFile', blob, 'employees.json')

      const response = await axiosInstance.post('/employees/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (response.data.errors && response.data.errors.length > 0) {
        // Backend sent row-specific errors
        setImportErrors(response.data.errors)
      } else {
        alert(response.data.message || 'Employees imported successfully!')
        setRows([])
        setErrors([])
        setShowModal(false)
      }

      if (fetchEmployeesWithSearch) fetchEmployeesWithSearch(searchTerm, statusFilter)
      else fetchEmployees()
    } catch (err) {
      console.error('Import failed', err)
      alert(err.response?.data?.message || 'Failed to import employees.')
    } finally {
      setLoadingImport(false)
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // ===== Export & Sample Download =====
  const handleExportCsv = async () => {
    try {
      const exportUrl = `/employees/export-csv?search=${searchTerm}&filter=${statusFilter}`
      const response = await axiosInstance.get(exportUrl, { responseType: 'blob' })
      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `employees_${statusFilter}_${searchTerm || 'all'}.csv`
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert('Failed to export CSV')
    }
  }

  const handleDownloadSample = async () => {
    try {
      const response = await axiosInstance.get('/sample-csv', { responseType: 'blob' })
      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'sample_employee_import_file.csv'
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert('Failed to download sample file')
    }
  }

  return (
    <>
      <BootstrapNavbar bg='dark' variant='dark' expand='lg' className='px-3'>
        <Container fluid className='d-flex justify-content-between align-items-center'>
          <BootstrapNavbar.Brand as={Link} to='/home' className='fw-bold fs-4 text-white'>
            Employee Management System
          </BootstrapNavbar.Brand>

          <div className='d-flex gap-2'>
            <Link to='/add-employee' className='btn btn-outline-primary py-2'>
              <i className='fas fa-user-plus me-2'></i> Add Employee
            </Link>

            <Button variant='outline-success' onClick={handleExportCsv}>Export CSV</Button>
            <Button variant='outline-info' onClick={handleDownloadSample}>Sample File</Button>

            <input
              type='file'
              ref={fileInputRef}
              accept='.csv'
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />

            <Button
              variant='outline-warning'
              onClick={() => fileInputRef.current.click()}
              disabled={loadingImport}
            >
              {loadingImport ? 'Importing...' : 'Import File'}
            </Button>
          </div>
        </Container>
      </BootstrapNavbar>

      {/* ===== CSV Preview Modal ===== */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="xl"
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>CSV Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflowX: 'auto' }}>
          {rows.length > 0 && (
            <Table bordered hover style={{ minWidth: '1200px' }}>
              <thead>
                <tr>
                  {Object.keys(rows[0]).map((col, idx) => (
                    <th key={idx}>
                      {mandatoryFields.includes(col) ? (
                        <span>{col} <span style={{color: 'red'}}>*</span></span>
                      ) : col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.keys(row).map((field, colIndex) => (
                      <td
                        key={colIndex}
                        contentEditable
                        style={{
                          backgroundColor: mandatoryFields.includes(field) && (!row[field] || row[field].trim() === "") ? '#ffcccc' : 'transparent'
                        }}
                        suppressContentEditableWarning={true}
                        onBlur={e => handleCellChange(rowIndex, field, e.target.innerText)}
                      >
                        {row[field]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {/* Validation Errors */}
          {errors.length > 0 && (
            <div className='alert alert-danger mt-2'>
              <strong>Validation Errors:</strong>
              <ul>
                {errors.map((err, idx) => (
                  <li key={idx}>Row {err.row}: Missing mandatory fields - {err.missing.join(', ')}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Backend Import Errors */}
          {importErrors.length > 0 && (
            <div className='alert alert-warning mt-2'>
              <strong>Import Errors (from server):</strong>
              <ul>
                {importErrors.map((err, idx) => (
                  <li key={idx}>Row {err.row}: {err.message || 'Failed to import'}</li>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='success'
            onClick={handleImport}
            disabled={errors.length > 0 || loadingImport}
          >
            Import Valid Rows
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Navbar

