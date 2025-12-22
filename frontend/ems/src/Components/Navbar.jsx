
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
  const [rows, setRows] = useState([])
  const [errors, setErrors] = useState([])
  const [importErrors, setImportErrors] = useState([])
  const [loadingImport, setLoadingImport] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const fileInputRef = useRef(null)

  const mandatoryFields = [
    "name", "department", "salary", "email", "phone", "position", "status",
    "education", "working_mode", "emp_type", "gender"
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
        setShowModal(true)
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

  // ===== FIXED: Import to Backend =====
  const handleImport = async () => {
    if (errors.length > 0) {
      alert('Please fix validation errors before importing!')
      return
    }

    setLoadingImport(true)
    setImportErrors([])

    try {
      // Convert updated rows back into a proper CSV file
      const csvData = Papa.unparse(rows)
      const blob = new Blob([csvData], { type: 'text/csv' })
      const formData = new FormData()
      formData.append('employeesFile', blob, 'employees.csv')

      const response = await axiosInstance.post('/employees/import', formData)
      
      if (response.data.errors && response.data.errors.length > 0) {
        setImportErrors(response.data.errors)
      } else {
        alert(response.data.message || 'Employees imported successfully!')
        setRows([])
        setErrors([])
        setShowModal(false)
      }

      if (fetchEmployeesWithSearch)
        fetchEmployeesWithSearch(searchTerm, statusFilter)
      else
        fetchEmployees()

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
//   const handleExportCsv = async () => {
//     // ⭐ FIX: searchTerm आणि statusFilter हे undefined असल्यास, 
//     // त्यांना डिफॉल्ट व्हॅल्यू द्या.
//     const currentSearchTerm = searchTerm || '';
//     const currentStatusFilter = statusFilter || 'All'; 

//     try {
//       const exportUrl = `/employees/export-csv?search=${currentSearchTerm}&filter=${currentStatusFilter}`
//       const response = await axiosInstance.get(exportUrl, { responseType: 'blob' })
//       const blob = new Blob([response.data], { type: 'text/csv' })
//       const url = window.URL.createObjectURL(blob)
//       const a = document.createElement('a')
//       a.href = url
//       a.download = `employees_${currentStatusFilter}_${currentSearchTerm || 'all'}.csv`
//       a.click()
//       a.remove()
//       window.URL.revokeObjectURL(url)
//     } catch (err) {
//       console.error(err)
//       alert('Failed to export CSV. Please check the network or server logs.')
//     }
//   }

// ===== Export & Sample Download =====
  const handleExportCsv = async () => {
    // 1. Props madhun yenari values check kara
    const currentSearch = searchTerm || '';
    const currentFilter = statusFilter || 'All'; 

    try {
      // Backend URL (Ha badlu naka)
      const exportUrl = `/employees/export-csv?search=${currentSearch}&filter=${currentFilter}`
      const response = await axiosInstance.get(exportUrl, { responseType: 'blob' })
      
      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      
      // 2. DYNAMIC FILENAME LOGIC (Ithe badal aahe)
      let finalFileName = "";

      if (currentSearch.trim() !== "") {
        // Jar search madhe kahi lihile asel tar te naav dya
        finalFileName = `employees_${currentSearch}`;
      } else {
        // Jar search rikama asel tar filter che naav dya (Active/Inactive/Blacklist)
        finalFileName = `employees_${currentFilter}`;
      }

      // Filename madhle spaces kadhun underscore (_) taknya sathi (Optional pan garjeche)
      finalFileName = finalFileName.replace(/\s+/g, '_');

      const a = document.createElement('a')
      a.href = url
      a.download = `${finalFileName}.csv` // Navin naav ithe lagu hoil
      document.body.appendChild(a) // Safe side sathi body madhe add kara
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      
    } catch (err) {
      console.error(err)
      alert('Failed to export CSV.')
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
      <BootstrapNavbar variant='dark' expand='lg'>
        <Container fluid className='d-flex justify-content-between align-items-center'>
          

          <div className='d-flex gap-2'>
          

            <Button className="btn-grad export-btn" id="btnExport" onClick={handleExportCsv}>Export CSV</Button>
            <Button className="btn-grad sample-btn" id="btnSample" onClick={handleDownloadSample}>Sample File</Button>

            <input
              type='file'
              ref={fileInputRef}
              accept='.csv'
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />

            <Button
              className="btn-grad import-btn"
              id="btnImport"
              onClick={() => fileInputRef.current.click()}
              disabled={loadingImport}
            >
              {loadingImport ? 'Importing...' : 'Import File'}
            </Button>
          </div>
        </Container>
      </BootstrapNavbar>

      {/* ===== CSV Preview Modal ===== */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" scrollable>
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
                      {mandatoryFields.includes(col)
                        ? <span>{col} <span style={{ color: 'red' }}>*</span></span>
                        : col}
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
                          backgroundColor:
                            mandatoryFields.includes(field) &&
                            (!row[field] || row[field].trim() === "")
                              ? '#ffcccc'
                              : 'transparent'
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

          {errors.length > 0 && (
            <div className='alert alert-danger mt-2'>
              <strong>Validation Errors:</strong>
              <ul>
                {errors.map((err, idx) => (
                  <li key={idx}>Row {err.row}: Missing fields - {err.missing.join(', ')}</li>
                ))}
              </ul>
            </div>
          )}

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


// import { Navbar as BootstrapNavbar, Container, Button, Table, Modal } from 'react-bootstrap'
// import axiosInstance from './axiosconfig'
// import Papa from 'papaparse'

// const Navbar = ({ fetchEmployees, searchTerm, statusFilter, fetchEmployeesWithSearch }) => {
//   const [rows, setRows] = useState([])
//   const [errors, setErrors] = useState([])
//   const [importErrors, setImportErrors] = useState([])
//   const [loadingImport, setLoadingImport] = useState(false)
//   const [showModal, setShowModal] = useState(false)
//   const fileInputRef = useRef(null)

//   const mandatoryFields = [
//     "name", "department", "salary", "email", "phone", "position", "status",
//     "education", "working_mode", "emp_type", "gender"
//   ]

//   // ===== File Selection =====
//   const handleFileSelect = e => {
//     const selectedFile = e.target.files[0]
//     if (!selectedFile) return

//     Papa.parse(selectedFile, {
//       header: true,
//       skipEmptyLines: true,
//       complete: (results) => {
//         setRows(results.data)
//         validateRows(results.data)
//         setShowModal(true)
//       }
//     })
//   }

//   const validateRows = (data) => {
//     const errs = []
//     data.forEach((row, index) => {
//       const missing = mandatoryFields.filter(f => !row[f] || row[f].trim() === "")
//       if (missing.length > 0) errs.push({ row: index + 1, missing })
//     })
//     setErrors(errs)
//   }

//   const handleCellChange = (rowIndex, field, value) => {
//     const updatedRows = [...rows]
//     updatedRows[rowIndex][field] = value
//     setRows(updatedRows)
//     validateRows(updatedRows)
//   }

//   // ===== FIXED: Import Logic (No Refresh Needed) =====
//   const handleImport = async () => {
//     if (errors.length > 0) return alert('Please fix errors first!')

//     setLoadingImport(true)
//     try {
//       const csvData = Papa.unparse(rows)
//       const blob = new Blob([csvData], { type: 'text/csv' })
//       const formData = new FormData()
//       formData.append('employeesFile', blob, 'employees.csv')

//       const response = await axiosInstance.post('/employees/import', formData)
      
//       // १. आधी मोडाल बंद करा
//       setShowModal(false)

//       // २. डेटा फेच करा (टेबल आपोआप अपडेट होईल)
//       if (fetchEmployeesWithSearch) {
//         await fetchEmployeesWithSearch(searchTerm || '', statusFilter || 'All')
//       } else {
//         await fetchEmployees()
//       }

//       // ३. शेवटी सक्सेस मेसेज
//       setTimeout(() => {
//         alert(response.data.message || 'Import successful!')
//       }, 300)

//     } catch (err) {
//       console.error(err)
//       alert(err.response?.data?.message || 'Import failed.')
//     } finally {
//       setLoadingImport(false)
//       if (fileInputRef.current) fileInputRef.current.value = ''
//     }
//   }

//   // ===== FIXED: Export & Sample (Direct Download) =====
//   const downloadFile = (data, fileName) => {
//     const blob = new Blob([data], { type: 'text/csv' })
//     const url = window.URL.createObjectURL(blob)
//     const a = document.createElement('a')
//     a.style.display = 'none'
//     a.href = url
//     a.download = fileName
//     document.body.appendChild(a)
//     a.click()
//     window.URL.revokeObjectURL(url)
//     document.body.removeChild(a)
//   }

//   const handleExportCsv = async () => {
//     try {
//       const res = await axiosInstance.get(`/employees/export-csv?search=${searchTerm || ''}&filter=${statusFilter || 'All'}`, { responseType: 'blob' })
//       downloadFile(res.data, `employees_export.csv`)
//     } catch (err) {
//       alert('Export failed')
//     }
//   }

//   const handleDownloadSample = async () => {
//     try {
//       const res = await axiosInstance.get('/sample-csv', { responseType: 'blob' })
//       downloadFile(res.data, 'sample_employees.csv')
//     } catch (err) {
//       alert('Sample download failed')
//     }
//   }

//   return (
//     <>
//       <BootstrapNavbar variant='dark' expand='lg' className="bg-dark p-3">
//         <Container fluid>
//           <div className='d-flex gap-2 ms-auto'>
//             <Button className="btn-grad" onClick={handleExportCsv}>Export CSV</Button>
//             <Button className="btn-grad" onClick={handleDownloadSample}>Sample File</Button>
//             <input type='file' ref={fileInputRef} accept='.csv' style={{ display: 'none' }} onChange={handleFileSelect} />
//             <Button className="btn-grad" onClick={() => fileInputRef.current.click()} disabled={loadingImport}>
//               {loadingImport ? 'Importing...' : 'Import File'}
//             </Button>
//           </div>
//         </Container>
//       </BootstrapNavbar>

//       <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" scrollable>
//         <Modal.Header closeButton><Modal.Title>CSV Preview</Modal.Title></Modal.Header>
//         <Modal.Body>
//           <Table bordered hover responsive>
//             <thead>
//               <tr>
//                 {rows[0] && Object.keys(rows[0]).map((col, i) => (
//                   <th key={i}>{col} {mandatoryFields.includes(col) && <span className="text-danger">*</span>}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {rows.map((row, rIdx) => (
//                 <tr key={rIdx}>
//                   {Object.keys(row).map((field, cIdx) => (
//                     <td key={cIdx} contentEditable onBlur={e => handleCellChange(rIdx, field, e.target.innerText)}
//                         style={{ backgroundColor: mandatoryFields.includes(field) && !row[field] ? '#ffcccc' : 'transparent' }}>
//                       {row[field]}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant='success' onClick={handleImport} disabled={errors.length > 0 || loadingImport}>
//             Import Valid Rows
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   )
// }

// export default Navbar