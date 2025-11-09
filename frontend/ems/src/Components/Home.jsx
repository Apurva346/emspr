// import React, { useState, useEffect } from 'react'
// import { Table, Button, Modal } from 'react-bootstrap'
// import '@fortawesome/fontawesome-free/css/all.min.css'
// import { useNavigate } from 'react-router-dom'
// import Navbar from './Navbar'
// import Searchbar from './Searchbar'
// import Pagination from './Pagination'
// import axios from 'axios'
// import StatusFilter from './StatusFilter'
// import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'

// const Home = ({ loading, onDetails, fetchEmployees, onShowAddModal }) => {
//   const [currentPage, setCurrentPage] = useState(1)
//   const [employeesPerPage] = useState(5)
//   const [employees, setEmployees] = useState([]) 
//   const [searchTerm, setSearchTerm] = useState('') 
//   const [statusFilter, setStatusFilter] = useState('Active')
//   const navigate = useNavigate()

//   const [showModal, setShowModal] = useState(false)
//   const [employeeIdToDelete, setEmployeeIdToDelete] = useState(null)

//   // Multiple Delete State
//   const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]) 

//   const [sortColumn, setSortColumn] = useState('id') 
//   const [sortOrder, setSortOrder] = useState('asc') 

//   const fetchEmployeesWithSearch = async (term = '', filter = 'All') => {
//     const url = `http://localhost:3001/api/employees?search=${term}&filter=${filter}`

//     try {
//         const response = await axios.get(url)
//       setEmployees(response.data)
//       // setCurrentPage(1) 
//     } catch (error) {
//       console.error('Error fetching employees:', error)
//       setEmployees([]) 
//     }
//   }

//   useEffect(() => {
//     fetchEmployeesWithSearch(searchTerm, statusFilter)
//   }, [searchTerm, statusFilter]) 

//   const handleSearch = term => {
//     setSearchTerm(term)
//     setCurrentPage(1) 
//   }

//   const handleClearSearch = () => {
//     setSearchTerm('')
//   }

//   const handleStatusChange = status => {
//     setStatusFilter(status)
//     setCurrentPage(1) 
//   }

//   // Sorting Functions
//   const handleSort = column => {
//     if (column === sortColumn) {
//       setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
//     } else {
//       setSortColumn(column)
//       setSortOrder('asc')
//     }
//     setCurrentPage(1) 
//   }

//   const getSortIcon = column => {
//     if (sortColumn === column) {
//       return sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />
//     }
//     return <FaSort style={{ opacity: 0.3, marginLeft: '5px' }} />
//   }

//   // Multiple Delete Selection Logic
//   const handleCheckboxChange = (id) => {
//     setSelectedEmployeeIds(prevSelected => {
//       if (prevSelected.includes(id)) {
//         return prevSelected.filter(employeeId => employeeId !== id)
//       } else {
//         return [...prevSelected, id]
//       }
//     })
//   }

//   const handleSelectAll = (event) => {
//     if (event.target.checked) {
//       // फक्त वर्तमान पेजवरचे Employees सिलेक्ट करा.
//       const allIds = currentEmployees.map(employee => employee.id)
//       setSelectedEmployeeIds(allIds)
//     } else {
//       setSelectedEmployeeIds([])
//     }
//   }

//   const onDeleteMultiple = () => {
//     if (selectedEmployeeIds.length > 0) {
//       setEmployeeIdToDelete(null)
//       setShowModal(true)
//     } else {
//       alert("Please select at least one employee to delete.")
//     }
//   }
//   
//   // Helper functions
//   const formatSalary = salary => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR'
//     }).format(salary)
//   }
//   
//   const formatId = id => {
//     return `EMP${String(id).padStart(3, '0')}`
//   }

//   const handleEdit = employee => {
//     navigate(`/edit-employee/${employee.id}`, { state: { employee } })
//   }

//   // Single Delete Logic (Modal Open)
//   const onDelete = id => {
//     setEmployeeIdToDelete(id)
//     setSelectedEmployeeIds([]) // Single Delete साठी multiple selection clear करा.
//     setShowModal(true)
//   }
//   
//   // Consolidated Delete Logic (Modal Confirm)
//   const confirmDelete = async () => {
//     let idsToDelete = []

//     if (employeeIdToDelete) {
//       idsToDelete = [employeeIdToDelete]
//     } else if (selectedEmployeeIds.length > 0) {
//       idsToDelete = selectedEmployeeIds
//     } else {
//       setShowModal(false)
//       return 
//     }

//     try {
//       // Backend server कडे DELETE request पाठवा.
//       await axios.delete(`http://localhost:3001/api/employees`, {
//         data: { 
//           ids: idsToDelete 
//         }
//       })
//       
//       console.log('Employees deleted successfully.')
//       
//       // Delete झाल्यावर डेटा Fetch करा.
//       fetchEmployeesWithSearch(searchTerm, statusFilter) 
//       
//       // State variables reset करा.
//       setSelectedEmployeeIds([]) 
//       setShowModal(false) 
//       setEmployeeIdToDelete(null) 
//       
//     } catch (error) {
//       console.error('Error deleting employee(s):', error)
//     }
//   }

//   const onDetailsClick = employee => {
//     navigate(`/employee-details/${employee.id}`)
//   }

//   // Sorting Logic (Same as before)
//   const sortedAndFilteredEmployees = [...employees].sort((a, b) => {
//     const aValue = a[sortColumn]
//     const bValue = b[sortColumn]
//     let comparison = 0

//     if (sortColumn === 'salary') {
//       const aSalary = parseFloat(String(aValue).replace(/[^0-9.]+/g, ''))
//       const bSalary = parseFloat(String(bValue).replace(/[^0-9.]+/g, ''))
//       comparison = aSalary - bSalary
//     } else if (sortColumn === 'id') {
//       comparison = aValue - bValue
//     } else {
//       if (String(aValue) > String(bValue)) {
//         comparison = 1
//       } else if (String(aValue) < String(bValue)) {
//         comparison = -1
//       }
//     }

//     return sortOrder === 'asc' ? comparison : comparison * -1
//   })

//   // Pagination Logic (Same as before)
//   const indexOfLastItem = currentPage * employeesPerPage
//   const indexOfFirstItem = indexOfLastItem - employeesPerPage
//   const currentEmployees = sortedAndFilteredEmployees.slice( 
//     indexOfFirstItem,
//     indexOfLastItem
//   )

//   const paginate = pageNumber => setCurrentPage(pageNumber)

//   if (loading) {
//     return <div className='text-center mt-5'>Loading employees...</div>
//   }

//   return (
//     <>
//       <Navbar
//         onShowAddModal={onShowAddModal}
//         fetchEmployees={fetchEmployees}
//         searchTerm={searchTerm}
//         statusFilter={statusFilter}
//         fetchEmployeesWithSearch={fetchEmployeesWithSearch}
//       />
//       <Searchbar
//         value={searchTerm}
//         onSearch={handleSearch}
//         onClear={handleClearSearch}
//       />
//       <StatusFilter
//         currentStatus={statusFilter}
//         onStatusChange={handleStatusChange}
//       />
//       
//       {/* Delete Selected Button UI */}
//       {selectedEmployeeIds.length > 0 && (
//         <div className='d-flex justify-content-start mb-3 mt-3'>
//           <Button 
//             variant='outline-danger' 
//             onClick={onDeleteMultiple} 
//           >
//             <i className='fas fa-trash-alt me-2'></i> 
//             Delete {selectedEmployeeIds.length} Selected
//           </Button>
//         </div>
//       )}

//       <div className='table-responsive'>
//         <Table striped variant='light' bordered hover>
//           <thead className='table-dark'>
//             <tr className='text-center'>
//               
//               {/* ID Column */}
//               <th
//                 className='py-3'
//                 onClick={() => handleSort('id')}
//                 style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
//               >
//                 ID {getSortIcon('id')}
//               </th>

//               {/* Name Column */}
//               <th
//                 className='py-3'
//                 onClick={() => handleSort('name')}
//                 style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
//               >
//                 Name {getSortIcon('name')}
//               </th>
//             
//               {/* Manager Column */}
//               <th className='py-3' onClick={() => handleSort('manager')} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>Manager {getSortIcon('manager')}</th>
//               
//               {/* Department Column */}
//               <th className='py-3' onClick={() => handleSort('department')} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>Department {getSortIcon('department')}</th>
//               
//               {/* Salary Column */}
//               <th
//                 className='py-3 text-center'
//                 onClick={() => handleSort('salary')}
//                 style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
//               >
//                 Salary {getSortIcon('salary')}
//               </th>
//               
//               <th className='py-3'>Status</th>
//               
//               <th className='py-3'>Actions</th>
//               
//               {/* 🚀 बदल १: Master Checkbox Column (Actions च्या नंतर) */}
//               <th className='py-3'>
//                 <input 
//                   type="checkbox"
//                   onChange={handleSelectAll}
//                   checked={currentEmployees.length > 0 && 
//                         currentEmployees.every(employee => selectedEmployeeIds.includes(employee.id))}
//                   indeterminate={
//                     (selectedEmployeeIds.length > 0 && selectedEmployeeIds.length < currentEmployees.length)
//                     ? true 
//                     : undefined
//                   }
//                 />
//               </th>
//             </tr>
//           </thead>
//           <tbody className='text-center'>
//             {currentEmployees && currentEmployees.length > 0 ? (
//               currentEmployees.map(employee => (
//                 <tr key={employee.id}>
//                   
//                   <td className='align-middle'>{formatId(employee.id)}</td>
//                   <td className='align-middle'>{employee.name}</td>
//                   <td className='align-middle'>{employee.manager}</td>
//                   <td className='align-middle'>{employee.department}</td>
//                   <td className='align-middle'>
//                     {formatSalary(employee.salary)}
//                   </td>
//                   <td className='align-middle'>{employee.status}</td>
//                   
//                   <td className='text-center align-middle'>
//                     <div className='d-flex justify-content-center gap-2'>
//                       <Button
//                         className='py-2 my-1'
//                         style={{ borderColor: '#0d47a1', color: '#0d47a1' }}
//                         onClick={() => onDetailsClick(employee)}
//                         variant='outline-light'
//                       >
//                         <i
//                           className='fas fa-circle-info'
//                           style={{ color: '#0d47a1' }}
//                         ></i>
//                       </Button>
//                       <Button
//                         variant='outline-success'
//                         className='py-2 my-1'
//                         onClick={() => handleEdit(employee)}
//                       >
//                         <i className='fas fa-edit'></i>
//                       </Button>
//                       <Button
//                         variant='outline-danger'
//                         className='py-2 my-1'
//                         onClick={() => onDelete(employee.id)}
//                       >
//                         <i className='fas fa-trash-alt'></i>
//                       </Button>
//                     </div>
//                   </td>
//                   
//                   {/* 🚀 बदल २: Individual Checkbox Column (Actions च्या नंतर) */}
//                   <td className='align-middle'>
//                     <input
//                       type="checkbox"
//                       checked={selectedEmployeeIds.includes(employee.id)}
//                       onChange={() => handleCheckboxChange(employee.id)}
//                     />
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 {/* Colspan 9 (चेकबॉक्स कॉलममुळे) */}
//                 <td colSpan='9' className='text-center py-4'> 
//                   No employees found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//       </div>

//       <Pagination
//         itemsPerPage={employeesPerPage}
//         totalItems={sortedAndFilteredEmployees.length}
//         paginate={paginate}
//         currentPage={currentPage}
//       />

//       {/* Delete Confirmation Modal */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Are you sure?</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>
//             This action cannot be undone. This will permanently delete the
//             employee record(s).
//           </p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant='secondary' onClick={() => setShowModal(false)}>
//             Cancel
//           </Button>
//           <Button variant='danger' onClick={confirmDelete}>
//             Delete
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   )
// }

// export default Home


import React, { useState, useEffect } from 'react'
import { Table, Button, Modal } from 'react-bootstrap'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Searchbar from './Searchbar'
import Pagination from './Pagination'
// 💡 FIX 1: Import the configured API instance instead of generic axios
import api from './axiosconfig' 
import StatusFilter from './StatusFilter'
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'

const Home = ({ loading, onDetails, fetchEmployees, onShowAddModal }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [employeesPerPage] = useState(5)
  const [employees, setEmployees] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('Active')
  const navigate = useNavigate()

  const [showModal, setShowModal] = useState(false)
  const [employeeIdToDelete, setEmployeeIdToDelete] = useState(null)

  // Multiple Delete State
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([])

  const [sortColumn, setSortColumn] = useState('id')
  const [sortOrder, setSortOrder] = useState('asc')

  // 💡 FIX 2: Use 'api.get' with cleaner 'params' object and relative path
  const fetchEmployeesWithSearch = async (term = '', filter = 'All') => {
    // The base URL 'http://localhost:3001/api' is already set in axiosconfig
    try {
      const response = await api.get('/employees', {
        params: {
          search: term,
          filter: filter
        }
      })
      setEmployees(response.data)
      // setCurrentPage(1)
    } catch (error) {
      // यह error अब 401 होने पर अपने आप Login Page पर भेज देगा
      console.error('Error fetching employees:', error)
      setEmployees([])
    }
  }

  useEffect(() => {
    fetchEmployeesWithSearch(searchTerm, statusFilter)
  }, [searchTerm, statusFilter])

  const handleSearch = term => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  const handleClearSearch = () => {
    setSearchTerm('')
  }

  const handleStatusChange = status => {
    setStatusFilter(status)
    setCurrentPage(1)
  }

  // Sorting Functions
  const handleSort = column => {
    if (column === sortColumn) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortOrder('asc')
    }
    setCurrentPage(1)
  }

  const getSortIcon = column => {
    if (sortColumn === column) {
      return sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />
    }
    return <FaSort style={{ opacity: 0.3, marginLeft: '5px' }} />
  }

  // Multiple Delete Selection Logic
  const handleCheckboxChange = id => {
    setSelectedEmployeeIds(prevSelected => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(employeeId => employeeId !== id)
      } else {
        return [...prevSelected, id]
      }
    })
  }

  const handleSelectAll = event => {
    if (event.target.checked) {
      // फक्त वर्तमान पेजवरचे Employees सिलेक्ट करा.
      const allIds = currentEmployees.map(employee => employee.id)
      setSelectedEmployeeIds(allIds)
    } else {
      setSelectedEmployeeIds([])
    }
  }

  const onDeleteMultiple = () => {
    if (selectedEmployeeIds.length > 0) {
      setEmployeeIdToDelete(null)
      setShowModal(true)
    } else {
      alert('Please select at least one employee to delete.')
    }
  }

  // Helper functions
  const formatSalary = salary => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(salary)
  }

  const formatId = id => {
    return `EMP${String(id).padStart(3, '0')}`
  }

  const handleEdit = employee => {
    navigate(`/edit-employee/${employee.id}`, { state: { employee } })
  }

  // Single Delete Logic (Modal Open)
  const onDelete = id => {
    setEmployeeIdToDelete(id)
    setSelectedEmployeeIds([]) // Single Delete साठी multiple selection clear करा.
    setShowModal(true)
  }

  // Consolidated Delete Logic (Modal Confirm)
  // 💡 FIX 3: Use 'api.delete' with relative path
  const confirmDelete = async () => {
    let idsToDelete = []

    if (employeeIdToDelete) {
      idsToDelete = [employeeIdToDelete]
    } else if (selectedEmployeeIds.length > 0) {
      idsToDelete = selectedEmployeeIds
    } else {
      setShowModal(false)
      return
    }

    try {
      // Backend server कडे DELETE request पाठवा.
      await api.delete(`/employees`, {
        data: {
          ids: idsToDelete
        }
      })

      console.log('Employees deleted successfully.')

      // Delete झाल्यावर डेटा Fetch करा.
      fetchEmployeesWithSearch(searchTerm, statusFilter)

      // State variables reset करा.
      setSelectedEmployeeIds([])
      setShowModal(false)
      setEmployeeIdToDelete(null)
    } catch (error) {
      console.error('Error deleting employee(s):', error)
    }
  }

  const onDetailsClick = employee => {
    navigate(`/employee-details/${employee.id}`)
  }

  // Sorting Logic (Same as before)
  const sortedAndFilteredEmployees = [...employees].sort((a, b) => {
    const aValue = a[sortColumn]
    const bValue = b[sortColumn]
    let comparison = 0

    if (sortColumn === 'salary') {
      const aSalary = parseFloat(String(aValue).replace(/[^0-9.]+/g, ''))
      const bSalary = parseFloat(String(bValue).replace(/[^0-9.]+/g, ''))
      comparison = aSalary - bSalary
    } else if (sortColumn === 'id') {
      comparison = aValue - bValue
    } else {
      if (String(aValue) > String(bValue)) {
        comparison = 1
      } else if (String(aValue) < String(bValue)) {
        comparison = -1
      }
    }

    return sortOrder === 'asc' ? comparison : comparison * -1
  })

  // Pagination Logic (Same as before)
  const indexOfLastItem = currentPage * employeesPerPage
  const indexOfFirstItem = indexOfLastItem - employeesPerPage
  const currentEmployees = sortedAndFilteredEmployees.slice(
    indexOfFirstItem,
    indexOfLastItem
  )

  const paginate = pageNumber => setCurrentPage(pageNumber)

  if (loading) {
    return <div className='text-center mt-5'>Loading employees...</div>
  }

  return (
    <>
      <Navbar
        onShowAddModal={onShowAddModal}
        fetchEmployees={fetchEmployees}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        fetchEmployeesWithSearch={fetchEmployeesWithSearch}
      />
      <Searchbar
        value={searchTerm}
        onSearch={handleSearch}
        onClear={handleClearSearch}
      />
      <StatusFilter
        currentStatus={statusFilter}
        onStatusChange={handleStatusChange}
      />

      {/* Delete Selected Button UI */}
      {selectedEmployeeIds.length > 0 && (
        <div className='d-flex justify-content-start mb-3 mt-3'>
          <Button
            variant='outline-danger'
            onClick={onDeleteMultiple}
          >
            <i className='fas fa-trash-alt me-2'></i>
            Delete {selectedEmployeeIds.length} Selected
          </Button>
        </div>
      )}

      <div className='table-responsive'>
        <Table striped variant='light' bordered hover>
          <thead className='table-dark'>
            <tr className='text-center'>

              {/* ID Column */}
              <th
                className='py-3'
                onClick={() => handleSort('id')}
                style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                ID {getSortIcon('id')}
              </th>

              {/* Name Column */}
              <th
                className='py-3'
                onClick={() => handleSort('name')}
                style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                Name {getSortIcon('name')}
              </th>

              {/* Manager Column */}
              <th className='py-3' onClick={() => handleSort('manager')} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>Manager {getSortIcon('manager')}</th>

              {/* Department Column */}
              <th className='py-3' onClick={() => handleSort('department')} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>Department {getSortIcon('department')}</th>

              {/* Salary Column */}
              <th
                className='py-3 text-center'
                onClick={() => handleSort('salary')}
                style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                Salary {getSortIcon('salary')}
              </th>

              <th className='py-3'>Status</th>

              <th className='py-3'>Actions</th>

              {/* 🚀 बदल १: Master Checkbox Column (Actions च्या नंतर) */}
              <th className='py-3'>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={currentEmployees.length > 0 &&
                      currentEmployees.every(employee => selectedEmployeeIds.includes(employee.id))}
                  indeterminate={
                    (selectedEmployeeIds.length > 0 && selectedEmployeeIds.length < currentEmployees.length)
                    ? true
                    : undefined
                  }
                />
              </th>
            </tr>
          </thead>
          <tbody className='text-center'>
            {currentEmployees && currentEmployees.length > 0 ? (
              currentEmployees.map(employee => (
                <tr key={employee.id}>

                  <td className='align-middle'>{formatId(employee.id)}</td>
                  <td className='align-middle'>{employee.name}</td>
                  <td className='align-middle'>{employee.manager}</td>
                  <td className='align-middle'>{employee.department}</td>
                  <td className='align-middle'>
                    {formatSalary(employee.salary)}
                  </td>
                  <td className='align-middle'>{employee.status}</td>

                  <td className='text-center align-middle'>
                    <div className='d-flex justify-content-center gap-2'>
                      <Button
                        className='py-2 my-1'
                        style={{ borderColor: '#0d47a1', color: '#0d47a1' }}
                        onClick={() => onDetailsClick(employee)}
                        variant='outline-light'
                      >
                        <i
                          className='fas fa-circle-info'
                          style={{ color: '#0d47a1' }}
                        ></i>
                      </Button>
                      <Button
                        variant='outline-success'
                        className='py-2 my-1'
                        onClick={() => handleEdit(employee)}
                      >
                        <i className='fas fa-edit'></i>
                      </Button>
                      <Button
                        variant='outline-danger'
                        className='py-2 my-1'
                        onClick={() => onDelete(employee.id)}
                      >
                        <i className='fas fa-trash-alt'></i>
                      </Button>
                    </div>
                  </td>

                  {/* 🚀 बदल २: Individual Checkbox Column (Actions च्या नंतर) */}
                  <td className='align-middle'>
                    <input
                      type="checkbox"
                      checked={selectedEmployeeIds.includes(employee.id)}
                      onChange={() => handleCheckboxChange(employee.id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                {/* Colspan 9 (चेकबॉक्स कॉलममुळे) */}
                <td colSpan='9' className='text-center py-4'>
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Pagination
        itemsPerPage={employeesPerPage}
        totalItems={sortedAndFilteredEmployees.length}
        paginate={paginate}
        currentPage={currentPage}
      />

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            This action cannot be undone. This will permanently delete the
            employee record(s).
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant='danger' onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Home