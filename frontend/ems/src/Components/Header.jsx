// import React from "react";
// import { Container, Button } from "react-bootstrap";

// const Header = ({ totalEmployees, onLogout }) => {
//   return (
//     <Container className="top-card mb-4"> {/* Added mb-4 for spacing */}
//       <div className="title-block text-center">
//         <h1>Employee Management System</h1>
//         <div className="text-muted small">
//           Manage employees — add, edit, view and export
//         </div>
//       </div>

//       <div className="header-bottom d-flex justify-content-between align-items-center w-100 mt-3">
//         <div className="total-pill">
//           Total Employees: {totalEmployees}
//         </div>
//         <Button id="btnLogout" className="btn-logout" onClick={onLogout}>
//           <i className="fas fa-sign-out-alt me-1"></i> Logout
//         </Button>
//       </div>
//     </Container>
//   );
// };

// export default Header;


import React from "react";
import { Container, Button } from "react-bootstrap";

const Header = ({ totalEmployees, onLogout }) => {
  return (
    // Replaced 'top-card mb-4' with a custom class 'header-container' for styling control
    <Container className="header-container"> 
      <div className="title-block text-center">
        <h1>Employee Management System</h1>
        <div className="text-muted small">
          Manage employees — add, edit, view and export
        </div>
      </div>

      {/* This section likely belongs to another component below the main title card, 
          but if it's required in the header, we style it to fit the card structure. */}
      <div className="header-bottom d-flex justify-content-between align-items-center w-100 mt-3">
        {/* Adjusted the total employees display to match the image better */}
        <div className="total-pill btn btn-info disabled"> 
          Total Employees
        </div>
        <Button id="btnLogout" className="btn-logout btn-danger" onClick={onLogout}>
          <i className="fas fa-sign-out-alt me-1"></i> Logout
        </Button>
      </div>
    </Container>
  );
};

export default Header;