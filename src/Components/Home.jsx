// import React, { useState } from 'react';
// import { Table, Button, Modal, Card } from 'react-bootstrap';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import { useNavigate } from 'react-router-dom';
// import Navbar from './Navbar';
// import Searchbar from './Searchbar';
// import Pagination from './Pagination';
// import axios from 'axios';

// const Home = ({employees, loading, onDetails, fetchEmployees, onShowAddModal}) => {
//   const [currentPage, setCurrentPage] = useState(1); 
//   const [employeesPerPage] = useState(5);
//   const navigate = useNavigate();
  
//   // State for modal
//   const [showModal, setShowModal] = useState(false);
//   const [employeeIdToDelete, setEmployeeIdToDelete] = useState(null);

//   // Get current employees
//   const indexOfLastItem = currentPage * employeesPerPage;
//   const indexOfFirstItem = indexOfLastItem - employeesPerPage;
//   const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   // Helper function to format salary
//   const formatSalary = salary => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR'
//     }).format(salary);
//   };

//   // Helper function to format ID
//   const formatId = id => {
//     return `EMP${String(id).padStart(3, '0')}`;
//   };

//   // Handle click on the edit button
//   const handleEdit = employee => {
//     navigate('/edit-employee', { state: { employee } });
//   };
  
//   // Function to open the confirmation modal
//   const onDelete = (id) => {
//     setEmployeeIdToDelete(id);
//     setShowModal(true);
//   };

//   // Function to perform the actual delete operation
//   const confirmDelete = async () => {
//     try {
//       await axios.delete(`http://localhost:3001/api/employees/${employeeIdToDelete}`);
//       console.log('Employee deleted successfully.');
//       fetchEmployees();
//       setShowModal(false); // Modal ko band kar de
//     } catch (error) {
//       console.error('Error deleting employee:', error);
//     }
//   };

//   if (loading) {
//     return <div className='text-center mt-5'>Loading employees...</div>;
//   }

//   const onDetailsClick = (employee) => {
//     navigate('/employee-details', { state: { employee } });
//   };

//   return (
//     <>
//       {/* Navbar, Searchbar, and Pagination components were commented out to resolve import errors. */}
//       <Navbar onShowAddModal={onShowAddModal} />
//       <Searchbar />
//       <div className='table-responsive'>
//         <Table striped variant='light' bordered hover>
//           <thead className='table-dark'>
//             <tr className='text-center'>
//               <th className='py-3'>ID</th>
//               <th className='py-3'>Name</th>
//               <th className='py-3'>Manager</th>
//               <th className='py-3'>Department</th>
//               <th className='py-3'>Salary</th>
//               <th className='py-3'>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {employees && employees.length > 0 ? (
//               employees.map(employee => (
//                 <tr key={employee.id}>
//                   <td className='align-middle'>{formatId(employee.id)}</td>
//                   <td className='align-middle'>{employee.name}</td>
//                   <td className='align-middle'>{employee.manager}</td>
//                   <td className='align-middle'>{employee.department}</td>
//                   <td className='align-middle'>
//                     {formatSalary(employee.salary)}
//                   </td>
//                   <td className='text-center align-middle'>
//                     <div className='d-flex justify-content-center gap-2'>
//                       <Button
//                         variant='outline-success'
//                         className='py-2 my-1'
//                         onClick={() => handleEdit(employee)}
//                       >
//                         <i className='fas fa-edit'></i>
//                       </Button>
//                       <Button
//                         variant='outline-danger'
//                         className='py-2 my-1'
//                         onClick={() => onDelete(employee.id)}
//                         // onClick={() => onDetailsClick(employee)}
//                       >
//                         <i className='fas fa-trash-alt'></i>
//                       </Button>
//                       <Button
//                         className='py-2 my-1'
//                         style={{ borderColor: '#0d47a1', color: '#0d47a1' }}
//                         // onClick={() => onDetails(employee)}
//                         onClick={() => onDetailsClick(employee)}
//                         variant='outline-light'
//                       >
//                         <i
//                           className='fas fa-circle-info'
//                           style={{ color: '#0d47a1' }}
//                         ></i>
//                       </Button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan='6' className='text-center py-4'>
//                   No employees found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//         {/* <Card.Footer className="text-muted text-center py-3">
//           Total Employees: <span className="fw-bold">{totalEmployees}</span>
//         </Card.Footer> */}
//       </div>
      
//       <Pagination
//         itemsPerPage={employeesPerPage}
//         totalItems={employees.length}
//         paginate={paginate}
//         currentPage={currentPage}
//       />
      
//       {/* Delete Confirmation Modal */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Are you sure?</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>This action cannot be undone. This will permanently delete the employee record.</p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="danger" onClick={confirmDelete}>
//             Delete
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default Home;




// Home.jsx mein
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Card } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Searchbar from './Searchbar';
import Pagination from './Pagination';
import axios from 'axios';

const Home = ({ loading, onDetails, fetchEmployees, onShowAddModal }) => { // removed `employees` from here
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(5);
  const [employees, setEmployees] = useState([]); // Add state for employees
  const [searchTerm, setSearchTerm] = useState(''); // Add state for search term
  const navigate = useNavigate();
  
  const [showModal, setShowModal] = useState(false);
  const [employeeIdToDelete, setEmployeeIdToDelete] = useState(null);

  // New function to fetch employees with a search term
  const fetchEmployeesWithSearch = async (term = '') => {
    try {
      const response = await axios.get(`http://localhost:3001/api/employees?search=${term}`);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    fetchEmployeesWithSearch(searchTerm);
  }, [searchTerm]); // Re-fetch data whenever search term changes

  // Handle search input change
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle clear button
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Get current employees (for pagination, using the state `employees`)
  const indexOfLastItem = currentPage * employeesPerPage;
  const indexOfFirstItem = indexOfLastItem - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Helper functions for formatting (already present in your code)
  const formatSalary = salary => { 
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
   }).format(salary); };
  const formatId = id => { return `EMP${String(id).padStart(3, '0')}`; };
  const handleEdit = employee => { navigate('/edit-employee', { state: { employee } }); };
  const onDelete = (id) => { setEmployeeIdToDelete(id);
      setShowModal(true); };
  const confirmDelete = async () => { try {
      await axios.delete(`http://localhost:3001/api/employees/${employeeIdToDelete}`);
      console.log('Employee deleted successfully.');
      fetchEmployees();
      setShowModal(false); // Modal ko band kar de
    } catch (error) {
      console.error('Error deleting employee:', error);
    } };
  const onDetailsClick = (employee) => { navigate('/employee-details', { state: { employee } }); };

  if (loading) {
    return <div className='text-center mt-5'>Loading employees...</div>;
  }
  
  return (
    <>
      <Navbar onShowAddModal={onShowAddModal} fetchEmployees={fetchEmployees} />
      <Searchbar 
        value={searchTerm} 
        onSearch={handleSearch} 
        onClear={handleClearSearch} 
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
          <p>This action cannot be undone. This will permanently delete the employee record.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Home