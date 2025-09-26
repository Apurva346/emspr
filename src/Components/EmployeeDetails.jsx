import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const EmployeeDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const formatSalary = (salary) => {
    if (!salary) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(salary);
  };

  const formatId = (id) => {
    if (!id) return 'N/A';
    return `EMP${String(id).padStart(3, '0')}`;
  };

  if (!state || !state.employee) {
    return (
      <div className="container mt-5 text-center">
        <h2>Employee details not found.</h2>
        <Button variant="primary" onClick={() => navigate('/home')}>
          Go back to Home
        </Button>
      </div>
    );
  }

  const { employee } = state;

  return (
    <div className="container my-5">
      <div className="card shadow-lg p-4">
        <h2 className="card-title text-center mb-4">Employee Details</h2>
        <div className="row text-center mb-4">
          <div className="col-12">
            <img
              src={employee.profile_pic || `https://placehold.co/150x150/E0E0E0/white?text=${employee.name.charAt(0)}`}
              className="rounded-circle border border-primary p-1"
              alt="Employee"
              style={{ width: '150px', height: '150px' }}
            />
            
            
          </div>
        </div>
        <div className="row text-left">
          <div className="col-sm-4">
            <p><strong>ID:</strong> {formatId(employee.id)}</p>
            <p><strong>Name:</strong> {employee.name}</p>
            <p><strong>Department:</strong> {employee.department}</p>
            <p><strong>Manager:</strong> {employee.manager}</p>
            <p><strong>Position:</strong> {employee.position}</p>
            <p><strong>Gender:</strong> {employee.gender}</p>
            <p><strong>Referred By:</strong> {employee.referred_by}</p>
          </div>
          <div className="col-sm-4">
            <p><strong>Email:</strong> {employee.email}</p>
            <p><strong>Salary:</strong> {formatSalary(employee.salary)}</p>
            <p><strong>Joining Date:</strong> {employee.joining}</p>
            <p><strong>Address:</strong> {employee.address}</p>
            <p><strong>Status:</strong> {employee.status}</p>
            <p><strong>Emergency Contact Number:</strong> {employee.emer_cont_no}</p>
          </div>
          <div className="col-sm-4">
            <p><strong>Education:</strong> {employee.education}</p>
            <p><strong>Working Mode:</strong> {formatSalary(employee.working_mode)}</p>
            <p><strong>Date of Birth:</strong> {employee.birth}</p>
            <p><strong>Phone:</strong> {employee.phone}</p>
            <p><strong>Employee Type:</strong> {employee.emp_type}</p>
            <p><strong>Relation with Emergency Contact:</strong> {employee.relation}</p>
            
          </div>
        </div>
        <div className="d-flex justify-content-center mt-4">
          <Button variant="secondary" onClick={() => navigate('/home')}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;


{/* <img
    src={employee.profile_pic || `https://placehold.co/150x150/E0E0E0/white?text=${employee.name.charAt(0)}`}
    className="rounded-circle border border-primary p-1"
    alt="Employee"
/> */}