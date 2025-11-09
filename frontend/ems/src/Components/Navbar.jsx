// import React, { useState, useRef, useEffect } from 'react'
// import { Navbar as BootstrapNavbar, Container, Button } from 'react-bootstrap'
// import { Link } from 'react-router-dom'
// import axios from 'axios'

// const Navbar = ({
//   onShowAddModal, // Jar use karat asel tar theva, mi Link use keli ahe
//   fetchEmployees, // Basic fetch function
//   searchTerm,
//   statusFilter,
//   fetchEmployeesWithSearch // Search/Filter sathi fetch function
// }) => {
//   const [file, setFile] = useState(null)
//   const fileInputRef = useRef(null)
//   const [loadingImport, setLoadingImport] = useState(false)

//   // File select zalyavar immediately import chalu hoil
//   useEffect(() => {
//     if (file) {
//       handleImport()
//     }
//   }, [file])

//   // 1. Export CSV with Search and Filter
//   const handleExportCsv = async () => {
//     try {
//       // Backend route la current search term aani filter status pathva
//       const exportUrl = `http://localhost:3001/api/employees/export-csv?search=${searchTerm}&filter=${statusFilter}`

//       const response = await axios.get(exportUrl, { responseType: 'blob' })

//       const blob = new Blob([response.data], { type: 'text/csv' })
//       const url = window.URL.createObjectURL(blob)
//       const a = document.createElement('a')
//       a.href = url
//       // Download filename madhye filter status add kela ahe
//       a.download = `employees_${statusFilter}_${searchTerm || 'all'}.csv`
//       document.body.appendChild(a)
//       a.click()
//       a.remove()
//       window.URL.revokeObjectURL(url)

//       // Export successful zalyavar data refresh kara
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
//       // **इथे फक्त छोटा path ('/sample-csv') वापरला आहे.**
//       // Vite proxy मुळे ही request आपोआप http://localhost:3001 ला जाईल.
//       const response = await axios.get(
//         '/sample-csv', // Relative path
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
//       // प्रॉडक्टशनसाठी alert() ऐवजी custom modal वापरा
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
//     // Backend madhye 'employeesFile' field name use kela ahe
//     formData.append('employeesFile', file)

//     try {
//       const response = await axios.post(
//         'http://localhost:3001/api/employees/import',
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         }
//       )
//       alert(response.data.message || 'Employees imported successfully!')
//       fetchEmployees() // Data dobara fetch kara
//     } catch (error) {
//       console.error('Import failed', error)
//       alert(error.response?.data?.message || 'Failed to import employees.')
//     } finally {
//       setLoadingImport(false)
//       setFile(null)
//       // File input reset kara
//       if (fileInputRef.current) {
//         fileInputRef.current.value = ''
//       }
//     }
//   }

//   return (
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


import React, { useState, useRef, useEffect } from 'react'
import { Navbar as BootstrapNavbar, Container, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
// ❌ जुना import: import axios from 'axios'

// ✅ FIX: तुमचा कॉन्फिगर केलेला axios instance इम्पोर्ट करा.
import axiosInstance from './axiosconfig' 

const Navbar = ({
  onShowAddModal,
  fetchEmployees, 
  searchTerm,
  statusFilter,
  fetchEmployeesWithSearch 
}) => {
  const [file, setFile] = useState(null)
  const fileInputRef = useRef(null)
  const [loadingImport, setLoadingImport] = useState(false)

  useEffect(() => {
    if (file) {
      handleImport()
    }
  }, [file])

  // 1. Export CSV with Search and Filter
  const handleExportCsv = async () => {
    try {
      // ✅ Base URL काढून फक्त API path वापरला.
      const exportUrl = `/employees/export-csv?search=${searchTerm}&filter=${statusFilter}`

      // ✅ axios च्या ऐवजी axiosInstance वापरला.
      const response = await axiosInstance.get(exportUrl, { responseType: 'blob' }) 

      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `employees_${statusFilter}_${searchTerm || 'all'}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)

      if (fetchEmployeesWithSearch) {
        fetchEmployeesWithSearch(searchTerm, statusFilter)
      }
    } catch (error) {
      console.error('Export failed', error)
      if (error.response && error.response.status === 404) {
        alert(
          'No employees found to export with the current search and filters.'
        )
      } else {
        alert('Failed to export employees.')
      }
    }
  }

  

  const handleDownloadSample = async () => {
    try {
      // ✅ axios च्या ऐवजी axiosInstance वापरला. (Path `/sample-csv` बेस URL मध्ये /api जोडल्यावर व्यवस्थित काम करेल.)
      const response = await axiosInstance.get(
        '/sample-csv', 
        { responseType: 'blob' }
      )

      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'sample_employee_import_file.csv'
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)

      console.log('Sample file download successful.')
    } catch (error) {
      console.error('Sample file download failed:', error)
      console.error(
        'Failed to download sample file. Check your backend server and proxy settings.'
      )
    }
  }

  // 3. Import File Handling
  const handleFileSelect = e => {
    setFile(e.target.files[0])
  }

  const handleImport = async () => {
    if (!file) {
      alert('Please select a CSV file to import.')
      return
    }

    setLoadingImport(true)

    const formData = new FormData()
    formData.append('employeesFile', file)

    try {
      // ✅ Hardcoded URL काढून फक्त API path वापरला आणि axiosInstance वापरला.
      const response = await axiosInstance.post(
        '/employees/import', // Base URL (http://localhost:3001/api) आपोआप जोडला जाईल
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      alert(response.data.message || 'Employees imported successfully!')
      fetchEmployees() 
    } catch (error) {
      console.error('Import failed', error)
      alert(error.response?.data?.message || 'Failed to import employees.')
    } finally {
      setLoadingImport(false)
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    // ... JSX code for Navbar remains the same ...
    <BootstrapNavbar bg='dark' variant='dark' expand='lg' className='px-3'>
      <Container
        fluid
        className='d-flex justify-content-between align-items-center'
      >
        <BootstrapNavbar.Brand
          as={Link}
          to='/home'
          className='fw-bold fs-4 text-white'
        >
          Employee Management System
        </BootstrapNavbar.Brand>

        <div className='d-flex gap-2'>
          {/* Add Employee Button (Link to a page) */}
          <Link
            to='/add-employee'
            className='btn btn-outline-primary py-2 d-flex align-items-center'
          >
            <i className='fas fa-user-plus me-2'></i> Add Employee
          </Link>

          {/* Export CSV Button (with Search/Filter) */}
          <Button
            variant='outline-success'
            className='py-2 d-flex align-items-center'
            onClick={handleExportCsv}
          >
            <i className='fas fa-file-csv me-2'></i> Export CSV
          </Button>

          {/* Download Sample File Button */}
          <Button
            variant='outline-info'
            className='py-2 d-flex align-items-center'
            onClick={handleDownloadSample}
          >
            <i className='fas fa-download me-2'></i> Sample File
          </Button>

          {/* Hidden file input for import */}
          <input
            type='file'
            ref={fileInputRef}
            onChange={handleFileSelect}
            // CSV files accept karayche
            accept='.csv'
            style={{ display: 'none' }}
          />

          {/* Import CSV button that triggers the file input */}
          <Button
            variant='outline-warning'
            className='py-2 d-flex align-items-center'
            onClick={() => fileInputRef.current.click()}
            disabled={loadingImport}
          >
            {loadingImport ? (
              <>
                <i className='fas fa-spinner fa-spin me-2'></i> Importing...
              </>
            ) : (
              <>
                <i className='fas fa-file-import me-2'></i> Import File
              </>
            )}
          </Button>
        </div>
      </Container>
    </BootstrapNavbar>
  )
}

export default Navbar
