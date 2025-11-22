import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Alert } from 'react-bootstrap' 
import '@fortawesome/fontawesome-free/css/all.min.css'
import { useNavigate } from 'react-router-dom'
import api from './axiosconfig' 
import Searchbar from './Searchbar'
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'
import CustomPagination from './CustomPagination'
import Combined from './Combined'
import Header from './Header' 

const Home = ({ loading, onDetails, fetchEmployees, onShowAddModal }) => {
    
    // --- State Variables ---
    const [employeesPerPage, setEmployeesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1)
    const [employees, setEmployees] = useState([]) // Filtered/Sorted list
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('Active')
    const [logoutError, setLogoutError] = useState(null); 
    
    // ✅ नवीन स्टेट: एकूण कर्मचाऱ्यांची संख्या स्थिर ठेवण्यासाठी (फिल्टर न केलेली)
    const [totalEmployeeCount, setTotalEmployeeCount] = useState(0) 

    const navigate = useNavigate()

    const [showModal, setShowModal] = useState(false)
    const [employeeIdToDelete, setEmployeeIdToDelete] = useState(null)
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([])
    const [sortColumn, setSortColumn] = useState('id')
    const [sortOrder, setSortOrder] = useState('asc')
    
    // --- Logout Function ---
    const handleLogout = () => {
        try {
            // Token remove करा
            localStorage.removeItem('token');
            
            // Login Page च्या रूट URL '/' वर रीडायरेक्ट करा.
            navigate('/'); 
            
        } catch (error) {
            console.error('❌ Logout failed:', error);
            setLogoutError('Logout failed. Please try clearing browser cache.');
        }
    };
    
    // --- Data Fetching ---
    const fetchEmployeesWithSearch = async (term = '', filter = 'All') => {
        try {
            const response = await api.get('/employees', {
                params: {
                    search: term,
                    filter: filter
                }
            })
            setEmployees(response.data)

            // ✅ Total Count फिक्स ठेवण्यासाठी लॉजिक:
            // जर फिल्टर 'All' आणि सर्च टर्म रिक्त असेल, तरच एकूण संख्या सेट करा. 
            // हे सुनिश्चित करते की totalEmployeeCount नेहमी टेबलमधील एकूण डेटा दर्शवेल.
            if (filter === 'All' && term === '') {
                 setTotalEmployeeCount(response.data.length); 
            }
            
        } catch (error) {
            console.error('❌ Error fetching employees:', error)
            setEmployees([])
        }
    }

    useEffect(() => {
        fetchEmployeesWithSearch(searchTerm, statusFilter)
        
        // जर सुरुवातीला filter 'Active' असेल, तर तुम्हाला `useEffect` 
        // मध्ये `fetchEmployeesWithSearch('', 'All')` एकदा कॉल करून 
        // total count मिळवावा लागेल.
        // if (totalEmployeeCount === 0) {
        //     fetchEmployeesWithSearch('', 'All'); 
        // }

    }, [searchTerm, statusFilter]) // totalEmployeeCount dependency मधून काढला आहे
    
    // ... (बाकीचे सर्व functions जसेच्या तसे) ...

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
    
    // --- Sorting Functions ---
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
    
    // --- Deletion and Selection Logic ---
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

    // --- Helper Functions ---
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

    const onDelete = id => {
      setEmployeeIdToDelete(id)
      setSelectedEmployeeIds([]) 
      setShowModal(true)
    }

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
        await api.delete(`/employees`, {
          data: {
            ids: idsToDelete
          }
        })

        console.log('✅ Employees deleted successfully.')

        // डिलीट झाल्यावर डेटा पुन्हा फेच करा
        fetchEmployeesWithSearch(searchTerm, statusFilter)

        setSelectedEmployeeIds([])
        setShowModal(false)
        setEmployeeIdToDelete(null)
      } catch (error) {
        console.error('❌ Error deleting employee(s):', error)
      }
    }

    const onDetailsClick = employee => {
      navigate(`/employee-details/${employee.id}`)
    }

    // --- Sorting and Pagination ---
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
            {/* ✅ totalEmployeeCount पास केला आहे, जी स्थिर व्हॅल्यू असेल */}
            {/* <Header 
                totalEmployees={totalEmployeeCount} 
                onLogout={handleLogout}           
            /> */}
            
            {logoutError && <Alert variant="danger">{logoutError}</Alert>}
            
            <Searchbar
                value={searchTerm}
                onSearch={handleSearch}
                onClear={handleClearSearch}
            />

            <Combined
                currentStatus={statusFilter}
                onStatusChange={handleStatusChange}
                fetchEmployees={fetchEmployees}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                fetchEmployeesWithSearch={fetchEmployeesWithSearch}
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

                    <th
                      className='py-3'
                      onClick={() => handleSort('id')}
                      style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      ID {getSortIcon('id')}
                    </th>

                    <th
                      className='py-3'
                      onClick={() => handleSort('name')}
                      style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      Name {getSortIcon('name')}
                    </th>

                    <th className='py-3' onClick={() => handleSort('manager')} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>Manager {getSortIcon('manager')}</th>

                    <th className='py-3' onClick={() => handleSort('department')} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>Department {getSortIcon('department')}</th>

                    <th
                      className='py-3 text-center'
                      onClick={() => handleSort('salary')}
                      style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      Salary {getSortIcon('salary')}
                    </th>

                    <th className='py-3'>Status</th>

                    <th className='py-3'>Actions</th>

                    {/* Master Checkbox Column */}
                    <th className='py-3'>
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={currentEmployees.length > 0 &&
                            currentEmployees.every(employee => selectedEmployeeIds.includes(employee.id))}
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

                        {/* Individual Checkbox Column */}
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
                      <td colSpan='9' className='text-center py-4'>
                        No employees found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>

            <CustomPagination
                pageSize={employeesPerPage}
                totalCount={sortedAndFilteredEmployees.length}
                onPageChange={paginate}
                onPageSizeChange={(size) => setEmployeesPerPage(size)}
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



