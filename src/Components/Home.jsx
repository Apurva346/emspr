import React, { useState, useEffect } from 'react'
import { Table, Button, Modal } from 'react-bootstrap'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Searchbar from './Searchbar'
import Pagination from './Pagination'
import axios from 'axios'
import StatusFilter from './StatusFilter'

const Home = ({ loading, onDetails, fetchEmployees, onShowAddModal }) => {
  // removed `employees` from here
  const [currentPage, setCurrentPage] = useState(1)
  const [employeesPerPage] = useState(5)
  const [employees, setEmployees] = useState([]) // Add state for employees
  const [searchTerm, setSearchTerm] = useState('') // Add state for search term
  const [statusFilter, setStatusFilter] = useState('Active')
  const navigate = useNavigate()

  const [showModal, setShowModal] = useState(false)
  const [employeeIdToDelete, setEmployeeIdToDelete] = useState(null)

  // New function to fetch employees with a search term
  // const fetchEmployeesWithSearch = async (term = '') => {
  //   try {
  //     const response = await axios.get(`http://localhost:3001/api/employees?search=${term}`);
  //     setEmployees(response.data);
  //   } catch (error) {
  //     console.error('Error fetching employees:', error);
  //   }
  // };

  // New function to fetch employees with search and status filter
  const fetchEmployeesWithSearch = async (term = '', filter = 'All') => {
    // Note: 'http://localhost:3001' is your backend server URL
    const url = `http://localhost:3001/api/employees?search=${term}&filter=${filter}`

    try {
      const response = await axios.get(url)
      setEmployees(response.data)
      setCurrentPage(1) // Filtering ya searching par page 1 par reset karna zaroori hai
    } catch (error) {
      console.error('Error fetching employees:', error)
      setEmployees([]) // Error hone par empty array set karein
    }
  }

  useEffect(() => {
    fetchEmployeesWithSearch(searchTerm, statusFilter)
  }, [searchTerm, statusFilter]) // Re-fetch data whenever search term changes

  // Handle search input change
  const handleSearch = term => {
    setSearchTerm(term)
    setCurrentPage(1) // Reset to first page on new search
  }

  // Handle clear button
  const handleClearSearch = () => {
    setSearchTerm('')
  }

  // Handle filter buttons click
  const handleStatusChange = status => {
    setStatusFilter(status)
    setCurrentPage(1); // यह step fetchEmployeesWithSearch mein already handle ho raha hai
  }

  // Get current employees (for pagination, using the state `employees`)
  const indexOfLastItem = currentPage * employeesPerPage
  const indexOfFirstItem = indexOfLastItem - employeesPerPage
  const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = pageNumber => setCurrentPage(pageNumber)

  // Helper functions for formatting (already present in your code)
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
    navigate('/edit-employee', { state: { employee } })
  }
  const onDelete = id => {
    setEmployeeIdToDelete(id)
    setShowModal(true)
  }
  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:3001/api/employees/${employeeIdToDelete}`
      )
      console.log('Employee deleted successfully.')
      fetchEmployees()
      setShowModal(false) // Modal ko band kar de
    } catch (error) {
      console.error('Error deleting employee:', error)
    }
  }
  const onDetailsClick = employee => {
    navigate('/employee-details', { state: { employee } })
  }

  if (loading) {
    return <div className='text-center mt-5'>Loading employees...</div>
  }

  return (
    <>
      {/* <Navbar onShowAddModal={onShowAddModal} fetchEmployees={fetchEmployees} /> */}
      <Navbar 
        onShowAddModal={onShowAddModal} 
        fetchEmployees={fetchEmployees}
        // 👇 Ye teen naye props jodein
        searchTerm={searchTerm} 
        statusFilter={statusFilter}
        // Export ke baad data refresh karne ke liye fetchEmployeesWithSearch ko bhi pass kar sakte hain
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
      <div className='table-responsive'>
        <Table striped variant='light' bordered hover>
          <thead className='table-dark'>
            <tr className='text-center'>
              <th className='py-3'>ID</th>
              <th className='py-3'>Name</th>
              <th className='py-3'>Manager</th>
              <th className='py-3'>Department</th>
              <th className='py-3'>Salary</th>
              <th className='py-3'>Status</th>
              <th className='py-3'>Actions</th>
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='6' className='text-center py-4'>
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Pagination
        itemsPerPage={employeesPerPage}
        totalItems={employees.length}
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
            employee record.
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
