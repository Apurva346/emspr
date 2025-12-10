import React from "react";
import { Container, Button } from "react-bootstrap";

const Header = ({ totalEmployees, onLogout }) => {
    return (
        <Container
            fluid
            className="py-4 mb-4 shadow-lg"
            style={{
                borderBottom: "3px solid #0d6efd",
                background: "linear-gradient(135deg, #e9f2ff, #f8fbff)",
                backdropFilter: "blur(8px)",
            }}
        >
            {/* Title Block */}
            <div className="text-center mb-4">
                <h1
                    className="fw-bold mb-1"
                    style={{
                        color: "#0d6efd",
                        letterSpacing: "1px",
                        fontSize: "2rem",
                    }}
                >
                    Employee Management System
                </h1>

                <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                    Manage employees — add, edit, view and export
                </div>
            </div>

            {/* Header Bottom Row */}
            <div
                className="d-flex justify-content-between align-items-center mx-auto"
                style={{
                    maxWidth: "100%",
                    padding: "0 25px",
                }}
            >
                {/* Pill Card */}
                <div
                    className="px-4 py-2 rounded-pill shadow-sm"
                    style={{
                        background: "linear-gradient(135deg, #17a2b8, #138496)",
                        color: "white",
                        fontWeight: "600",
                        fontSize: "1rem",
                        boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
                    }}
                >
                    👥 Total Employees: {totalEmployees}
                </div>

                {/* Logout Button */}
                <Button
                    id="btnLogout"
                    className="rounded-pill px-4 py-2 shadow-sm"
                    style={{
                        background: "linear-gradient(135deg, #dc3545, #b32f3a)",
                        border: "none",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                    onClick={onLogout}
                >
                    <i className="fas fa-sign-out-alt"></i> Logout
                </Button>
            </div>
        </Container>
    );
};

export default Header;
