
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
  const handleExportCsv = async () => {
    // ⭐ FIX: searchTerm आणि statusFilter हे undefined असल्यास, 
    // त्यांना डिफॉल्ट व्हॅल्यू द्या.
    const currentSearchTerm = searchTerm || '';
    // const currentStatusFilter = statusFilter || 'All'; 
    const currentStatusFilter = statusFilter && statusFilter !== 'All' ? statusFilter.toLowerCase() : 'all';

    try {
      const exportUrl = `/employees/export-csv?search=${currentSearchTerm}&status=${currentStatusFilter}`
      const response = await axiosInstance.get(exportUrl, { responseType: 'blob' })
      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `employees_${currentStatusFilter}_${currentSearchTerm || 'all'}.csv`
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert('Failed to export CSV. Please check the network or server logs.')
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


