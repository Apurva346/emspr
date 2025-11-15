import React from 'react';
import { Button } from 'react-bootstrap';
import "@fortawesome/fontawesome-free/css/all.min.css";

// Home.jsx se currentStatus aur onStatusChange props receive karein
const StatusFilter = ({ currentStatus, onStatusChange }) => {
  return (
    <div className='d-flex gap-2 mb-3'>
      {/* <span className='fw-bold align-self-center me-2'>Filter by Status:</span> */}
      
      {/* All Employees Button */}
      <Button 
        // variant={currentStatus === 'All' ? 'info' : 'outline-info'} 
        id="btnLogout" className="btn-logout"
        onClick={() => onStatusChange('All')}
        size="md"
      >
        <i className='fas fa-users me-1'></i> All Employees
      </Button>
      
      {/* Active Employees Button */}
      <Button 
        // variant={currentStatus === 'Active' ? 'success' : 'outline-success'} 
        className="btn-grad export-btn" id="btnExport"
        onClick={() => onStatusChange('Active')}
        size="md"
      >
        <i className='fas fa-check-circle me-1'></i> Active
      </Button>
      
      {/* Inactive Employees Button */}
      <Button 
        // variant={currentStatus === 'Inactive' ? 'secondary' : 'outline-secondary'} 
        className="btn-grad sample-btn" id="btnSample"
        onClick={() => onStatusChange('Inactive')}
        size="md"
      >
        <i className='fas fa-user-slash me-1'></i> Inactive
      </Button>
      
      {/* Blacklist Employees Button */}
      <Button 
        // variant={currentStatus === 'Blacklist' ? 'danger' : 'outline-danger'} 
        className="btn-grad import-btn"
              id="btnImport"
        onClick={() => onStatusChange('Blacklist')}
        size="md"
      >
        <i className='fas fa-ban me-1'></i> Blacklist
      </Button>
    </div>
  );
};

export default StatusFilter;



