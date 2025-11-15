import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
// ✅ फाईलच्या नावाप्रमाणे 'axiosconfig' इम्पोर्ट केले


import { formatDate } from '../utils/formatDate';
import axiosInstance from './axiosconfig';


const EmployeeDetails = () => {
    const { id } = useParams(); // URL मधून कर्मचारी ID घ्या
    const navigate = useNavigate();
    
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    // Helper functions
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

    // 🚀 Component Load झाल्यावर डेटा Fetch करा
    useEffect(() => {
        if (id) {
            // ✅ 'axiosInstance' चा वापर आणि फक्त endpoint (Base URL काढून टाकली)
            axiosInstance.get(`/employees/${id}`) // 👈 Node.js API endpoint
                .then(response => {
                    const data = response.data;
                    
                    // Date fields ला YYYY-MM-DD फॉर्मेटमध्ये ठेवणे (किंवा 'N/A')
                    setEmployee({
                        ...data,
                        joining: data.joining ? data.joining.split('T')[0] : 'N/A',
                        leaving: data.leaving ? data.leaving.split('T')[0] : 'N/A',
                        birth: data.birth ? data.birth.split('T')[0] : 'N/A',
                        // Blank fields ला 'N/A' सेट करा
                        referred_by: data.referred_by || 'N/A',
                        education: data.education || 'N/A',
                        relation: data.relation || 'N/A',
                        manager: data.manager || 'N/A',
                        address: data.address || 'N/A',
                        emer_cont_no: data.emer_cont_no || 'N/A',
                    });
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching employee details:', error);
                    setEmployee(null);
                    setLoading(false);
                });
        }
    }, [id, navigate]); // ID बदलल्यास पुन्हा डेटा Fetch होईल

    if (loading) {
        return <div className="container mt-5 text-center">Loading employee details...</div>;
    }

    if (!employee) {
        return (
            <div className="container mt-5 text-center">
                <h2>Employee details not found or failed to load.</h2>
                <Button variant="primary" onClick={() => navigate('/home')}>
                    Go back to Home
                </Button>
            </div>
        );
    }

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
                    {/* 1st Column */}
                    <div className="col-sm-4">
                        <p><strong>ID:</strong> {formatId(employee.id)}</p>
                        <p><strong>Name:</strong> {employee.name}</p>
                        <p><strong>Department:</strong> {employee.department}</p>
                        <p><strong>Manager:</strong> {employee.manager}</p>
                        <p><strong>Position:</strong> {employee.position}</p>
                        <p><strong>Gender:</strong> {employee.gender}</p>
                        <p><strong>Referred By:</strong> {employee.referred_by}</p>
                    </div>
                    {/* 2nd Column */}
                    <div className="col-sm-4">
                        <p><strong>Email:</strong> {employee.email}</p>
                        <p><strong>Salary:</strong> {formatSalary(employee.salary)}</p>
                        <p><strong>Joining Date:</strong> {formatDate(employee.joining)}</p>
                        <p><strong>Address:</strong> {employee.address}</p>
                        <p><strong>Status:</strong> {employee.status}</p>
                        <p><strong>Emergency Contact No:</strong> {employee.emer_cont_no}</p>
                    </div>
                    {/* 3rd Column */}
                    <div className="col-sm-4">
                        <p><strong>Education:</strong> {employee.education}</p>
                        <p><strong>Working Mode:</strong> {employee.working_mode}</p>
                        <p><strong>Date of Birth:</strong> {formatDate(employee.birth)}</p>
                        <p><strong>Phone:</strong> {employee.phone}</p>
                        <p><strong>Employee Type:</strong> {employee.emp_type}</p>
                        <p><strong>Relation with Contact:</strong> {employee.relation}</p>
                        <p><strong>Date of Leaving:</strong> {employee.leaving === 'N/A' ? 'Still Working' : formatDate(employee.leaving)}</p>
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