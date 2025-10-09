import React from 'react';
import { Button } from 'react-bootstrap';
import "@fortawesome/fontawesome-free/css/all.min.css";

// Home.jsx se currentStatus aur onStatusChange props receive karein
const StatusFilter = ({ currentStatus, onStatusChange }) => {
  return (
    <div className='d-flex gap-2 mb-3'>
      <span className='fw-bold align-self-center me-2'>Filter by Status:</span>
      
      {/* All Employees Button */}
      <Button 
        variant={currentStatus === 'All' ? 'info' : 'outline-info'} 
        onClick={() => onStatusChange('All')}
        size="sm"
      >
        <i className='fas fa-users me-1'></i> All Employees
      </Button>
      
      {/* Active Employees Button */}
      <Button 
        variant={currentStatus === 'Active' ? 'success' : 'outline-success'} 
        onClick={() => onStatusChange('Active')}
        size="sm"
      >
        <i className='fas fa-check-circle me-1'></i> Active
      </Button>
      
      {/* Inactive Employees Button */}
      <Button 
        variant={currentStatus === 'Inactive' ? 'secondary' : 'outline-secondary'} 
        onClick={() => onStatusChange('Inactive')}
        size="sm"
      >
        <i className='fas fa-user-slash me-1'></i> Inactive
      </Button>
      
      {/* Blacklist Employees Button */}
      <Button 
        variant={currentStatus === 'Blacklist' ? 'danger' : 'outline-danger'} 
        onClick={() => onStatusChange('Blacklist')}
        size="sm"
      >
        <i className='fas fa-ban me-1'></i> Blacklist
      </Button>
    </div>
  );
};

export default StatusFilter;