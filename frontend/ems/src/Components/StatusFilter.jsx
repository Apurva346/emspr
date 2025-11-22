// // import React from 'react';
// import { Button } from 'react-bootstrap';
// import "@fortawesome/fontawesome-free/css/all.min.css";

// const StatusFilter = ({ currentStatus, onStatusChange }) => {
//   return (
//     <div 
//       className="d-flex flex-row align-items-center flex-wrap gap-2 mb-3"
//     >
//       {/* All Employees Button */}
//       <Button 
//         id="btnLogout" 
//         className="btn-logout"
//         onClick={() => onStatusChange('All')}
//         size="md"
//       >
//         <i className='fas fa-users me-1'></i> All Employees
//       </Button>

//       {/* Active Employees Button */}
//       <Button 
//         className="btn-grad export-btn" 
//         id="btnExport"
//         onClick={() => onStatusChange('Active')}
//         size="md"
//       >
//         <i className='fas fa-check-circle me-1'></i> Active
//       </Button>

//       {/* Inactive Employees Button */}
//       <Button 
//         className="btn-grad sample-btn" 
//         id="btnSample"
//         onClick={() => onStatusChange('Inactive')}
//         size="md"
//       >
//         <i className='fas fa-user-slash me-1'></i> Inactive
//       </Button>

//       {/* Blacklist Employees Button */}
//       <Button 
//         className="btn-grad import-btn"
//         id="btnImport"
//         onClick={() => onStatusChange('Blacklist')}
//         size="md"
//       >
//         <i className='fas fa-ban me-1'></i> Blacklist
//       </Button>
//     </div>
//   );
// };

// export default StatusFilter;


import React from 'react';
import { Button } from 'react-bootstrap';
import "@fortawesome/fontawesome-free/css/all.min.css";

const StatusFilter = ({ currentStatus, onStatusChange }) => {
  return (
    <div 
      className="d-flex flex-row align-items-center flex-wrap gap-2 mb-3"
    >
      {/* All Employees Button */}
      <Button 
        id="btnLogout" 
        className="btn-logout"
        onClick={() => onStatusChange('All')}
        size="md"
      >
        <i className='fas fa-users me-1'></i> All Employees
      </Button>

      {/* Active Employees Button */}
      <Button 
        className="btn-grad export-btn" 
        id="btnExport"
        onClick={() => onStatusChange('Active')}
        size="md"
      >
        <i className='fas fa-check-circle me-1'></i> Active
      </Button>

      {/* Inactive Employees Button */}
      <Button 
        className="btn-grad sample-btn" 
        id="btnSample"
        onClick={() => onStatusChange('Inactive')}
        size="md"
      >
        <i className='fas fa-user-slash me-1'></i> Inactive
      </Button>

      {/* Blacklist Employees Button */}
      <Button 
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
