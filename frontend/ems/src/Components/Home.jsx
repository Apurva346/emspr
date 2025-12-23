import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import './Home.css';

// Sorting Helper Function
// const sortData = (data, column, order) => {
//     return [...data].sort((a, b) => {
//         // Manager column sathi data check kara
//         let aVal = a[column];
//         let bVal = b[column];

//         // Jar values null astil tar empty string dya
//         aVal = aVal === null || aVal === undefined ? "" : String(aVal).trim();
//         bVal = bVal === null || bVal === undefined ? "" : String(bVal).trim();

//         let comparison = 0;

//         if (column === 'salary' || column === 'id') {
//             comparison = (Number(aVal) || 0) - (Number(bVal) || 0);
//         } else {
//             // Alphabetical sorting (Raj vs Robert)
//             // localeCompare 'Ra' la 'Ro' chya aadhi treat karel
//             comparison = aVal.localeCompare(bVal, undefined, { 
//                 sensitivity: 'base',
//                 numeric: true 
//             });
//         }

//         return order === 'asc' ? comparison : -comparison;
//     });
// };

// const sortData = (data, column, order) => {
//     return [...data].sort((a, b) => {
//         // Values ghetaana trim kara aani lowercase kara
//         let aVal = a[column] ? String(a[column]).trim().toLowerCase() : "";
//         let bVal = b[column] ? String(b[column]).trim().toLowerCase() : "";

//         if (column === 'salary' || column === 'id') {
//             return order === 'asc' 
//                 ? (Number(a[column]) || 0) - (Number(b[column]) || 0)
//                 : (Number(b[column]) || 0) - (Number(a[column]) || 0);
//         }

//         // String Comparison (A to Z)
//         if (aVal < bVal) {
//             return order === 'asc' ? -1 : 1;
//         }
//         if (aVal > bVal) {
//             return order === 'asc' ? 1 : -1;
//         }
//         return 0;
//     });
// };

const sortData = (data, column, order) => {
    return [...data].sort((a, b) => {
        // ۱. डेटा 'Clean' करा (Spaces aani Hidden characters kadha)
        let valA = a[column] ? String(a[column]).replace(/^\s+|\s+$/g, '').toLowerCase() : "";
        let valB = b[column] ? String(b[column]).replace(/^\s+|\s+$/g, '').toLowerCase() : "";

        // २. Number sorting (Salary/ID)
        if (column === 'salary' || column === 'id') {
            const numA = parseFloat(valA) || 0;
            const numB = parseFloat(valB) || 0;
            return order === 'asc' ? numA - numB : numB - numA;
        }

        // ۳. Manager (Raj vs Robert) Strict Comparison
        // Jar valA lahan asel (e.g., 'ra' < 'ro'), tar comparison -1 asava
        let comparison = 0;
        if (valA < valB) comparison = -1;
        if (valA > valB) comparison = 1;

        return order === 'asc' ? comparison : -comparison;
    });
};

const Home = ({ loading, setTotalEmployees }) => { 
    
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

    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [employeeIdToDelete, setEmployeeIdToDelete] = useState(null);

    const updateTotalCount = useCallback(async () => {
        try {
            const response = await api.get('/employees', {
                params: { search: '', filter: 'All' }
            });
            if (setTotalEmployees) {
                setTotalEmployees(response.data.length);
            }
        } catch {
            if (setTotalEmployees) {
                setTotalEmployees(0);
            }
        }
    }, [setTotalEmployees]);

    const fetchEmployees = useCallback(async (term = '', filter = 'All') => {
        try {
            const response = await api.get('/employees', {
                params: { search: term, filter }
            });
            setEmployees(response.data);
        } catch {
            setEmployees([]);
        }
    }, []); 

    useEffect(() => {
        fetchEmployees(searchTerm, statusFilter);
        setCurrentPage(1);
    }, [searchTerm, statusFilter, fetchEmployees]);

    useEffect(() => {
        updateTotalCount();
    }, [updateTotalCount]);

    const handlePageSizeChange = (newSize) => {
        setEmployeesPerPage(newSize);
        setCurrentPage(1);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    // const handleSort = (column) => {
    //     if (column === sortColumn) {
    //         setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    //     } else {
    //         setSortColumn(column);
    //         setSortOrder('asc');
    //     }
    //     setCurrentPage(1);
    // };

    const handleSort = (column) => {
    console.log("Sorting Column:", column); // चेक करा इथे 'manager' येतंय का
    console.log("Current Order:", sortOrder); // चेक करा 'asc' आहे की 'desc'

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

    // Note: details modal madhe vaparnyasathi formatId function tech thevle aahe.
    const formatId = (id) => `EMP${String(id).padStart(3, '0')}`;

    const onDelete = (id) => {
        setEmployeeIdToDelete(id);
        setShowDeleteModal(true);
    };

    const onDeleteMultiple = () => {
        if (selectedEmployeeIds.length > 0) {
            setEmployeeIdToDelete(null); 
            setShowDeleteModal(true);
        } else {
            alert("Please select at least one employee to delete.");
        }
    };

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
            await fetchEmployees(searchTerm, statusFilter); 
            await updateTotalCount(); 
        } catch (error) { 
            console.error("Delete Error:", error);
        }
        setShowDeleteModal(false);
        setSelectedEmployeeIds([]);
        setEmployeeIdToDelete(null);
    };

    const onDetailsClick = async (employee) => {
        try {
            const res = await api.get(`/employees/${employee.id}`);
            setSelectedEmployee(res.data);
            setShowDetailsModal(true);
        } catch (err) {
            console.log("Details Fetch Error:", err);
        }
    };

    const onEditClick = async (employee) => {
        try {
            const res = await api.get(`/employees/${employee.id}`);
            setSelectedEmployee(res.data);
            setShowEditModal(true);
        } catch (err) {
            console.log("Edit Fetch Error:", err);
        }
    };

    // const sortedEmployees = useMemo(() => {
    //     return sortData(employees, sortColumn, sortOrder);
    // }, [employees, sortColumn, sortOrder]);

    const sortedEmployees = useMemo(() => {
    const result = sortData(employees, sortColumn, sortOrder);
    console.log("Current Sorted Data:", result.map(e => e.manager));
    return result;
    }, [employees, sortColumn, sortOrder]);

    const currentEmployees = useMemo(() => {
        const indexOfLast = currentPage * employeesPerPage;
        const indexOfFirst = indexOfLast - employeesPerPage;
        return sortedEmployees.slice(indexOfFirst, indexOfLast);
    }, [sortedEmployees, currentPage, employeesPerPage]);

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
              searchTerm={searchTerm} 
              statusFilter={statusFilter}
              fetchEmployees={fetchEmployees}
              fetchEmployeesWithSearch={fetchEmployees}
            />

            {selectedEmployeeIds.length > 0 && (
                <div className="d-flex justify-content-start mb-3 mt-3">
                    <Button variant="outline-danger" onClick={onDeleteMultiple}>
                        <i className="fas fa-trash-alt me-2"></i>
                        Delete {selectedEmployeeIds.length} Selected
                    </Button>
                </div>
            )}

            <div className="table-responsive">
                <Table bordered hover>
                    <thead className="table-dark text-center">
                        <tr>
                            {/* Label badlun Sr. No. kela aahe */}
                            <th onClick={() => handleSort('id')}>Sr. No. {getSortIcon('id')}</th>
                            <th onClick={() => handleSort('name')}>Name {getSortIcon('name')}</th>
                            <th onClick={() => handleSort('manager')}>Manager {getSortIcon('manager')}</th>
                            <th onClick={() => handleSort('department')}>Department {getSortIcon('department')}</th>
                            <th onClick={() => handleSort('salary')}>Salary {getSortIcon('salary')}</th>
                            <th>Status</th>
                            <th>Actions</th>
                            <th>
                                <input
                                    type="checkbox"
                                    checked={currentEmployees.every(emp => selectedEmployeeIds.includes(emp.id)) && currentEmployees.length > 0}
                                    onChange={handleSelectAll}
                                />
                            </th>
                        </tr>
                    </thead>

                    <tbody className="text-center">
                        {currentEmployees.map((employee, index) => {
                            // ⭐ Brackets correction aani Serial Number logic
                            // const serialNumber = (currentPage - 1) * employeesPerPage + (index + 1);
                            // --- Display Logic sathi Serial Number ---
                           let serialNumber;
        
                           // Jar sorting 'id' (Sr. No.) var aahe aani order 'desc' aahe
                           if (sortColumn === 'id' && sortOrder === 'desc') {
                                serialNumber = sortedEmployees.length - ((currentPage - 1) * employeesPerPage + index);
                            } else {
                                // Normal 1, 2, 3 logic
                                  serialNumber = (currentPage - 1) * employeesPerPage + (index + 1);
                            }

                            return (
                                <tr key={employee.id}>
                                    {/* Sr. No. display logic */}
                                    <td>{serialNumber}</td>
                                    <td className="capitalize-text">{employee.name}</td>
                                    <td className="capitalize-text">{employee.manager}</td>
                                    <td className="capitalize-text">{employee.department}</td>
                                    <td>{employee.salary}</td>
                                    <td className="capitalize-text">{employee.status}</td>

                                    <td>
                                        <div className="d-flex justify-content-center gap-2">
                                            <Button variant="outline-primary" onClick={() => onDetailsClick(employee)}>
                                                <i className="fas fa-circle-info"></i>
                                            </Button>

                                            <Button variant="outline-success" onClick={() => onEditClick(employee)}>
                                                <i className="fas fa-edit"></i>
                                            </Button>

                                            <Button variant="outline-danger" onClick={() => onDelete(employee.id)}>
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
                            );
                        })}
                    </tbody>
                </Table>
            </div>

            <CustomPagination
                pageSize={employeesPerPage}
                totalCount={sortedEmployees.length}
                onPageChange={setCurrentPage}
                currentPage={currentPage}
                onPageSizeChange={handlePageSizeChange}
            />

            {/* MODALS (Ya madhe kuthlehi badal kele nahit, EMP ID dakhvne suru rahil) */}
            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg" centered dialogClassName='large-modal'>
                <Modal.Header closeButton>
                    <Modal.Title>Employee Details</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <EmployeeDetails employee={selectedEmployee} />
                </Modal.Body>
            </Modal>

            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="xl" centered dialogClassName='large-modal'>
                <Modal.Header closeButton>
                    <Modal.Title>Add Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <AddEmployee 
                        onClose={() => {
                            setShowAddModal(false);
                            fetchEmployees(searchTerm, statusFilter);
                            updateTotalCount(); 
                        }} 
                    />
                </Modal.Body>
            </Modal>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="xl" centered dialogClassName='large-modal'>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <EditEmployee 
                        employeeData={selectedEmployee} 
                        onClose={() => {
                            setShowEditModal(false);
                            fetchEmployees(searchTerm, statusFilter);
                            updateTotalCount(); 
                        }} 
                    />
                </Modal.Body>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure want to delete {employeeIdToDelete ? 'this employee' : `${selectedEmployeeIds.length} selected employees`}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Home;