import React from "react";
import { Container, Button } from "react-bootstrap";

/**
 * Header Component for the Employee Management System, reflecting the user's original UI preference.
 * Displays the system title, total employee count, and a logout button.
 *
 * @param {object} props - Component props
 * @param {number} props.totalEmployees - The total count of employees.
 * @param {function} props.onLogout - Function to call when the Logout button is clicked.
 * @param {string} props.userId - Current user ID (displayed for context).
 */
const Header = ({ totalEmployees, onLogout, userId }) => {
    return (
        // Added fluid container and style for separation/aesthetics
        <Container 
            fluid 
            className="py-4 mb-4 shadow-sm"
            style={{ borderBottom: '4px solid #0d6efd', backgroundColor: '#f8f9fa' }}
        > 
            
            <div className="title-block text-center mb-3">
                <h1 className="fw-bold mb-1 text-primary">Employee Management System</h1>
                <div className="text-muted small mb-1">
                    Manage employees — add, edit, view and export
                </div>
                {/* Added User ID display as it is crucial for multi-user apps
                <div className="text-muted small mb-0">
                    User ID: {userId || 'Loading...'}
                </div> */}
            </div>

            {/* Header Bottom: Aligns total count and logout button using flexbox */}
            <div className="header-bottom d-flex justify-content-between align-items-center mx-auto" style={{ maxWidth: '600px' }}>
                
                {/* Total Employee Count Pill (Disabled button style) */}
                <div 
                    className="total-pill px-3 py-2 rounded-pill shadow-sm"
                    style={{
                        backgroundColor: '#17a2b8', // Info Blue
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                    }}
                > 
                    Total Employees: {totalEmployees}
                </div>
                
                {/* Logout Button */}
                <Button 
                    id="btnLogout" 
                    className="btn-danger rounded-lg shadow-sm" 
                    onClick={onLogout} 
                >
                    <i className="fas fa-sign-out-alt me-2"></i> Logout
                </Button>
            </div>
        </Container>
    );
};

export default Header;