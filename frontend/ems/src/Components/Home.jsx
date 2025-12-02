// import React, { useState, useEffect } from 'react';
// import { Table, Button, Modal, Alert } from 'react-bootstrap';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import { useNavigate } from 'react-router-dom';
// import api from './axiosconfig';
// import Searchbar from './Searchbar';
// import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
// import CustomPagination from './CustomPagination';
// import Combined from './Combined';
// import EmployeeDetails from './EmployeeDetails';
// import AddEmployee from './AddEmployee';
// import EditEmployee from './EditEmployee';
// import './home.css';

// const Home = ({ loading }) => {

//     const [employeesPerPage, setEmployeesPerPage] = useState(10);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [employees, setEmployees] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [statusFilter, setStatusFilter] = useState('Active');
//     const [logoutError, setLogoutError] = useState(null);

//     const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
//     const [sortColumn, setSortColumn] = useState('id');
//     const [sortOrder, setSortOrder] = useState('asc');

//     const navigate = useNavigate();

//     // ⭐ MODALS
//     const [showDetailsModal, setShowDetailsModal] = useState(false);
//     const [showAddModal, setShowAddModal] = useState(false);
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [selectedEmployee, setSelectedEmployee] = useState(null);

//     // ⭐ DELETE MODAL
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [employeeIdToDelete, setEmployeeIdToDelete] = useState(null);

//     // FETCH EMPLOYEES
//     const fetchEmployees = async (term = '', filter = 'All') => {
//         try {
//             const response = await api.get('/employees', {
//                 params: { search: term, filter }
//             });
//             setEmployees(response.data);
//         } catch {
//             setEmployees([]);
//         }
//     };

//     useEffect(() => {
//         fetchEmployees(searchTerm, statusFilter);
//     }, [searchTerm, statusFilter]);

//     const handleSearch = (term) => {
//         setSearchTerm(term);
//         setCurrentPage(1);
//     };

//     const handleSort = (column) => {
//         if (column === sortColumn) {
//             setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//         } else {
//             setSortColumn(column);
//             setSortOrder('asc');
//         }
//         setCurrentPage(1);
//     };

//     const getSortIcon = (column) => {
//         if (sortColumn === column) {
//             return sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />;
//         }
//         return <FaSort style={{ opacity: 0.3 }} />;
//     };

//     const handleCheckboxChange = (id) => {
//         setSelectedEmployeeIds(prev =>
//             prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
//         );
//     };

//     const handleSelectAll = (e) => {
//         if (e.target.checked) {
//             setSelectedEmployeeIds(currentEmployees.map(emp => emp.id));
//         } else {
//             setSelectedEmployeeIds([]);
//         }
//     };

//     const formatId = (id) => `EMP${String(id).padStart(3, '0')}`;

//     // ⭐ DELETE
//     const onDelete = (id) => {
//         setEmployeeIdToDelete(id);
//         setShowDeleteModal(true);
//     };

//     const confirmDelete = async () => {
//         try {
//             await api.delete('/employees', { data: { ids: [employeeIdToDelete] } });
//             fetchEmployees(searchTerm, statusFilter);
//         } catch { }
//         setShowDeleteModal(false);
//         setEmployeeIdToDelete(null);
//     };

//     // ⭐ DETAILS — NOW FETCH FULL DATA
//     const onDetailsClick = async (employee) => {
//         try {
//             const res = await api.get(`/employees/${employee.id}`);
//             setSelectedEmployee(res.data); // full record
//             setShowDetailsModal(true);
//         } catch (err) {
//             console.log("Details Fetch Error:", err);
//         }
//     };

//     // ⭐ EDIT — FETCH FULL DATA
//     const onEditClick = async (employee) => {
//         try {
//             const res = await api.get(`/employees/${employee.id}`);
//             setSelectedEmployee(res.data); // full record
//             setShowEditModal(true);
//         } catch (err) {
//             console.log("Edit Fetch Error:", err);
//         }
//     };

//     // SORTING
//     const sortedEmployees = [...employees].sort((a, b) => {
//         const aVal = a[sortColumn];
//         const bVal = b[sortColumn];

//         let comparison = 0;
//         if (sortColumn === 'salary') {
//             comparison = aVal - bVal;
//         } else if (sortColumn === 'id') {
//             comparison = aVal - bVal;
//         } else {
//             comparison = String(aVal).localeCompare(String(bVal));
//         }
//         return sortOrder === 'asc' ? comparison : -comparison;
//     });

//     const indexOfLast = currentPage * employeesPerPage;
//     const indexOfFirst = indexOfLast - employeesPerPage;
//     const currentEmployees = sortedEmployees.slice(indexOfFirst, indexOfLast);

//     if (loading) return <div className="text-center mt-4">Loading...</div>;

//     return (
//         <>
//             {logoutError && <Alert variant="danger">{logoutError}</Alert>}

//             <Searchbar
//                 value={searchTerm}
//                 onSearch={handleSearch}
//                 onClear={() => setSearchTerm("")}
//                 onAddEmployee={() => setShowAddModal(true)}
//             />

//             <Combined
//                 currentStatus={statusFilter}
//                 onStatusChange={setStatusFilter}
//             />

//             {/* EMPLOYEE TABLE */}
//             <div className="table-responsive">
//                 <Table bordered hover>
//                     <thead className="table-dark text-center">
//                         <tr>
//                             <th onClick={() => handleSort('id')}>ID {getSortIcon('id')}</th>
//                             <th onClick={() => handleSort('name')}>Name {getSortIcon('name')}</th>
//                             <th onClick={() => handleSort('manager')}>Manager {getSortIcon('manager')}</th>
//                             <th onClick={() => handleSort('department')}>Department {getSortIcon('department')}</th>
//                             <th onClick={() => handleSort('salary')}>Salary {getSortIcon('salary')}</th>
//                             <th>Status</th>
//                             <th>Actions</th>
//                             <th>
//                                 <input
//                                     type="checkbox"
//                                     checked={currentEmployees.every(emp => selectedEmployeeIds.includes(emp.id))}
//                                     onChange={handleSelectAll}
//                                 />
//                             </th>
//                         </tr>
//                     </thead>

//                     <tbody className="text-center">
//                         {currentEmployees.map(employee => (
//                             <tr key={employee.id}>
//                                 <td>{formatId(employee.id)}</td>
//                                 <td>{employee.name}</td>
//                                 <td>{employee.manager}</td>
//                                 <td>{employee.department}</td>
//                                 <td>{employee.salary}</td>
//                                 <td>{employee.status}</td>

//                                 <td>
//                                     <div className="d-flex justify-content-center gap-2">
//                                         <Button variant="outline-primary"
//                                             onClick={() => onDetailsClick(employee)}>
//                                             <i className="fas fa-circle-info"></i>
//                                         </Button>

//                                         <Button variant="outline-success"
//                                             onClick={() => onEditClick(employee)}>
//                                             <i className="fas fa-edit"></i>
//                                         </Button>

//                                         <Button variant="outline-danger"
//                                             onClick={() => onDelete(employee.id)}>
//                                             <i className="fas fa-trash"></i>
//                                         </Button>
//                                     </div>
//                                 </td>

//                                 <td>
//                                     <input
//                                         type="checkbox"
//                                         checked={selectedEmployeeIds.includes(employee.id)}
//                                         onChange={() => handleCheckboxChange(employee.id)}
//                                     />
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </Table>
//             </div>

//             {/* PAGINATION */}
//             <CustomPagination
//                 pageSize={employeesPerPage}
//                 totalCount={sortedEmployees.length}
//                 onPageChange={setCurrentPage}
//             />

//             {/* DETAILS MODAL */}
//             <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg" centered dialogClassName='large-modal'>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Employee Details</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
//                     <EmployeeDetails employee={selectedEmployee} />
//                 </Modal.Body>
//             </Modal>

//             {/* ADD EMPLOYEE MODAL */}
//             <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="xl" centered dialogClassName='large-modal'>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Add Employee</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
//                     <AddEmployee onClose={() => setShowAddModal(false)} />
//                 </Modal.Body>
//             </Modal>

//             {/* EDIT EMPLOYEE MODAL */}
//             <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="xl" centered dialogClassName='large-modal'>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Edit Employee</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
//                     <EditEmployee employeeData={selectedEmployee} onClose={() => setShowEditModal(false)} />
//                 </Modal.Body>
//             </Modal>

//             {/* DELETE MODAL */}
//             <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Confirm Delete</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>Are you sure want to delete?</Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
//                     <Button variant="danger" onClick={confirmDelete}>Delete</Button>
//                 </Modal.Footer>
//             </Modal>
//         </>
//     );
// };

// export default Home;



import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Alert } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';
import api from './axiosconfig';
import Searchbar from './Searchbar';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import CustomPagination from './CustomPagination';
import Combined from './Combined';
import EmployeeDetails from './EmployeeDetails';
import AddEmployee from './AddEmployee';
import EditEmployee from './EditEmployee';
import './home.css';

const Home = ({ loading }) => {

    const [employeesPerPage, setEmployeesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Active');
    const [logoutError, setLogoutError] = useState(null);

    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
    const [sortColumn, setSortColumn] = useState('id');
    const [sortOrder, setSortOrder] = useState('asc');

    const navigate = useNavigate();

    // ⭐ MODALS
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // ⭐ DELETE MODAL
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [employeeIdToDelete, setEmployeeIdToDelete] = useState(null);

    // FETCH EMPLOYEES
    const fetchEmployees = async (term = '', filter = 'All') => {
        try {
            const response = await api.get('/employees', {
                params: { search: term, filter }
            });
            setEmployees(response.data);
        } catch {
            setEmployees([]);
        }
    };

    useEffect(() => {
        fetchEmployees(searchTerm, statusFilter);
    }, [searchTerm, statusFilter]);

    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    const handleSort = (column) => {
        if (column === sortColumn) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }
        setCurrentPage(1);
    };

    const getSortIcon = (column) => {
        if (sortColumn === column) {
            return sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />;
        }
        return <FaSort style={{ opacity: 0.3 }} />;
    };

    const handleCheckboxChange = (id) => {
        setSelectedEmployeeIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedEmployeeIds(currentEmployees.map(emp => emp.id));
        } else {
            setSelectedEmployeeIds([]);
        }
    };

    const formatId = (id) => `EMP${String(id).padStart(3, '0')}`;

    // ⭐ DELETE SINGLE
    const onDelete = (id) => {
        setEmployeeIdToDelete(id);
        setShowDeleteModal(true);
    };

    // ⭐ DELETE MULTIPLE (ADDED)
    const onDeleteMultiple = () => {
        if (selectedEmployeeIds.length > 0) {
            setEmployeeIdToDelete(null);
            setShowDeleteModal(true);
        } else {
            alert("Please select at least one employee to delete.");
        }
    };

    // ⭐ CONFIRM DELETE (WITH MULTIPLE SUPPORT)
    const confirmDelete = async () => {
        let idsToDelete = [];

        if (employeeIdToDelete) {
            idsToDelete = [employeeIdToDelete];
        } else if (selectedEmployeeIds.length > 0) {
            idsToDelete = selectedEmployeeIds;
        } else {
            setShowDeleteModal(false);
            return;
        }

        try {
            await api.delete('/employees', { data: { ids: idsToDelete } });
            fetchEmployees(searchTerm, statusFilter);
        } catch { }

        setShowDeleteModal(false);
        setSelectedEmployeeIds([]);
        setEmployeeIdToDelete(null);
    };

    // ⭐ DETAILS — FETCH FULL DATA
    const onDetailsClick = async (employee) => {
        try {
            const res = await api.get(`/employees/${employee.id}`);
            setSelectedEmployee(res.data);
            setShowDetailsModal(true);
        } catch (err) {
            console.log("Details Fetch Error:", err);
        }
    };

    // ⭐ EDIT — FETCH FULL DATA
    const onEditClick = async (employee) => {
        try {
            const res = await api.get(`/employees/${employee.id}`);
            setSelectedEmployee(res.data);
            setShowEditModal(true);
        } catch (err) {
            console.log("Edit Fetch Error:", err);
        }
    };

    const sortedEmployees = [...employees].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];

        let comparison = 0;

        if (sortColumn === 'salary') {
            comparison = aVal - bVal;
        } else if (sortColumn === 'id') {
            comparison = aVal - bVal;
        } else {
            comparison = String(aVal).localeCompare(String(bVal));
        }

        return sortOrder === 'asc' ? comparison : -comparison;
    });

    const indexOfLast = currentPage * employeesPerPage;
    const indexOfFirst = indexOfLast - employeesPerPage;
    const currentEmployees = sortedEmployees.slice(indexOfFirst, indexOfLast);

    if (loading) return <div className="text-center mt-4">Loading...</div>;

    return (
        <>
            {logoutError && <Alert variant="danger">{logoutError}</Alert>}

            <Searchbar
                value={searchTerm}
                onSearch={handleSearch}
                onClear={() => setSearchTerm("")}
                onAddEmployee={() => setShowAddModal(true)}
            />

            <Combined
                currentStatus={statusFilter}
                onStatusChange={setStatusFilter}
            />

            {/* ⭐ MULTIPLE DELETE BUTTON (ADDED) */}
            {selectedEmployeeIds.length > 0 && (
                <div className="d-flex justify-content-start mb-3 mt-3">
                    <Button variant="outline-danger" onClick={onDeleteMultiple}>
                        <i className="fas fa-trash-alt me-2"></i>
                        Delete {selectedEmployeeIds.length} Selected
                    </Button>
                </div>
            )}

            {/* EMPLOYEE TABLE */}
            <div className="table-responsive">
                <Table bordered hover>
                    <thead className="table-dark text-center">
                        <tr>
                            <th onClick={() => handleSort('id')}>ID {getSortIcon('id')}</th>
                            <th onClick={() => handleSort('name')}>Name {getSortIcon('name')}</th>
                            <th onClick={() => handleSort('manager')}>Manager {getSortIcon('manager')}</th>
                            <th onClick={() => handleSort('department')}>Department {getSortIcon('department')}</th>
                            <th onClick={() => handleSort('salary')}>Salary {getSortIcon('salary')}</th>
                            <th>Status</th>
                            <th>Actions</th>
                            <th>
                                <input
                                    type="checkbox"
                                    checked={currentEmployees.every(emp => selectedEmployeeIds.includes(emp.id))}
                                    onChange={handleSelectAll}
                                />
                            </th>
                        </tr>
                    </thead>

                    <tbody className="text-center">
                        {currentEmployees.map(employee => (
                            <tr key={employee.id}>
                                <td>{formatId(employee.id)}</td>
                                <td>{employee.name}</td>
                                <td>{employee.manager}</td>
                                <td>{employee.department}</td>
                                <td>{employee.salary}</td>
                                <td>{employee.status}</td>

                                <td>
                                    <div className="d-flex justify-content-center gap-2">
                                        <Button variant="outline-primary"
                                            onClick={() => onDetailsClick(employee)}>
                                            <i className="fas fa-circle-info"></i>
                                        </Button>

                                        <Button variant="outline-success"
                                            onClick={() => onEditClick(employee)}>
                                            <i className="fas fa-edit"></i>
                                        </Button>

                                        <Button variant="outline-danger"
                                            onClick={() => onDelete(employee.id)}>
                                            <i className="fas fa-trash"></i>
                                        </Button>
                                    </div>
                                </td>

                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedEmployeeIds.includes(employee.id)}
                                        onChange={() => handleCheckboxChange(employee.id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* PAGINATION */}
            <CustomPagination
                pageSize={employeesPerPage}
                totalCount={sortedEmployees.length}
                onPageChange={setCurrentPage}
            />

            {/* DETAILS MODAL */}
            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg" centered dialogClassName='large-modal'>
                <Modal.Header closeButton>
                    <Modal.Title>Employee Details</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <EmployeeDetails employee={selectedEmployee} />
                </Modal.Body>
            </Modal>

            {/* ADD EMPLOYEE MODAL */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="xl" centered dialogClassName='large-modal'>
                <Modal.Header closeButton>
                    <Modal.Title>Add Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <AddEmployee onClose={() => setShowAddModal(false)} />
                </Modal.Body>
            </Modal>

            {/* EDIT EMPLOYEE MODAL */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="xl" centered dialogClassName='large-modal'>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <EditEmployee employeeData={selectedEmployee} onClose={() => setShowEditModal(false)} />
                </Modal.Body>
            </Modal>

            {/* DELETE MODAL */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure want to delete?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Home;
