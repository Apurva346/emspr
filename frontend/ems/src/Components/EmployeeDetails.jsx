// import React from 'react';
// import { Button } from 'react-bootstrap';
// import { formatDate } from '../utils/formatDate';
// import './EmployeeDetails.css'

// const EmployeeDetails = ({ employee, onClose }) => {

//     if (!employee) {
//         return (
//             <div className="text-center p-4">
//                 <h4>No Employee Data Found</h4>
//             </div>
//         );
//     }

//     const formatSalary = (salary) => {
//         if (!salary) return 'N/A';
//         return new Intl.NumberFormat('en-IN', {
//             style: 'currency',
//             currency: 'INR',
//         }).format(salary);
//     };

//     const formatId = (id) => {
//         if (!id) return 'N/A';
//         return `EMP${String(id).padStart(3, '0')}`;
//     };

//     return (
        
//         <div className="container-fluid employee-details-wrapper">

//             <div className="card shadow-lg p-4 border-0 employee-card">

//                 {/* Profile */}
//                 <div className="text-center mb-4">
//                     <img
//                         src={employee.profile_pic || `https://placehold.co/150x150/E0E0E0/white?text=${employee.name.charAt(0)}`}
//                         className="rounded-circle border border-primary p-1"
//                         alt="Employee"
//                         style={{ width: '120px', height: '120px' }}
//                     />
//                     <h4 className="mt-3 fw-bold">{employee.name}</h4>
//                     {/* <p className="text-muted">{employee.position} • {employee.department}</p> */}
//                 </div>

//                 {/* FULL DETAILS — 3 Columns */}
//                 <div className="row">

//                     {/* LEFT */}
//                     <div className="col-sm-4 mb-3">
//                         <div className="detail-box"><strong>ID:</strong> {formatId(employee.id)}</div>
//                         <div className="detail-box capitalize-text"><strong>Name:</strong> {employee.name}</div>
//                         <div className="detail-box capitalize-text"><strong>Department:</strong> {employee.department}</div>
//                         <div className="detail-box capitalize-text"><strong>Manager:</strong> {employee.manager}</div>
//                         <div className="detail-box capitalize-text"><strong>Position:</strong> {employee.position}</div>
//                         <div className="detail-box capitalize-text"><strong>Gender:</strong> {employee.gender}</div>
//                         <div className="detail-box capitalize-text"><strong>Referred By:</strong> {employee.referred_by}</div>
//                     </div>

//                     {/* MIDDLE */}
//                     <div className="col-sm-4 mb-3">
//                         <div className="detail-box"><strong>Email:</strong> {employee.email}</div>
//                         <div className="detail-box"><strong>Salary:</strong> {formatSalary(employee.salary)}</div>
//                         <div className="detail-box"><strong>Joining Date:</strong> {formatDate(employee.joining)}</div>
//                         <div className="detail-box capitalize-text"><strong>Address:</strong> {employee.address}</div>
//                         <div className="detail-box capitalize-text"><strong>Status:</strong> {employee.status}</div>
//                         <div className="detail-box"><strong>Emergency Contact:</strong> {employee.emer_cont_no}</div>
//                         <div className="detail-box capitalize-text"><strong>Additional Information:</strong> {employee.additional_information}</div>
//                     </div>

//                     {/* RIGHT */}
//                     <div className="col-sm-4 mb-3">
//                         <div className="detail-box capitalize-text"><strong>Education:</strong> {employee.education}</div>
//                         <div className="detail-box capitalize-text"><strong>Working Mode:</strong> {employee.working_mode}</div>
//                         <div className="detail-box"><strong>Date of Birth:</strong> {formatDate(employee.birth)}</div>
//                         <div className="detail-box"><strong>Phone:</strong> {employee.phone}</div>
//                         <div className="detail-box capitalize-text"><strong>Employee Type:</strong> {employee.emp_type}</div>
//                         <div className="detail-box capitalize-text"><strong>Relation:</strong> {employee.relation}</div>
//                         <div className="detail-box">
//                             <strong>Date of Leaving:</strong> {employee.leaving === 'N/A' ? 'Still Working' : formatDate(employee.leaving)}
//                         </div>
//                     </div>
//                 </div>

//             </div>
//         </div>


//     );
// };

// export default EmployeeDetails;


import React from 'react';
import { Button } from 'react-bootstrap';
import { formatDate } from '../utils/formatDate';
import './EmployeeDetails.css';

const EmployeeDetails = ({ employee, onClose }) => {

    if (!employee) {
        return (
            <div className="text-center p-4">
                <h4>No Employee Data Found</h4>
            </div>
        );
    }

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

    return (
        <div className="container-fluid employee-details-wrapper">
            <div className="card shadow-lg p-4 border-0 employee-card">

                {/* Profile Section */}
                <div className="text-center mb-4">
                    <img
                        src={employee.profile_pic || `https://placehold.co/150x150/E0E0E0/white?text=${employee.name ? employee.name.charAt(0) : 'E'}`}
                        className="rounded-circle border border-primary p-1"
                        alt="Employee"
                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                    />
                    <h4 className="mt-3 fw-bold">{employee.name}</h4>
                    <p className="text-muted">{employee.position} • {employee.department_name || employee.department || 'N/A'}</p>
                </div>

                {/* FULL DETAILS — 3 Columns */}
                <div className="row">

                    {/* LEFT COLUMN */}
                    <div className="col-sm-4 mb-3">
                        <div className="detail-box"><strong>ID:</strong> {formatId(employee.id)}</div>
                        <div className="detail-box capitalize-text"><strong>Name:</strong> {employee.name}</div>
                        
                        {/* विभाग: नाव असल्यास नाव दाखवेल, अन्यथा ID */}
                        <div className="detail-box capitalize-text">
                            <strong>Department:</strong> {employee.department_name || employee.department || 'N/A'}
                        </div>
                        
                        <div className="detail-box capitalize-text"><strong>Manager:</strong> {employee.manager || 'N/A'}</div>
                        <div className="detail-box capitalize-text"><strong>Position:</strong> {employee.position}</div>
                        <div className="detail-box capitalize-text"><strong>Gender:</strong> {employee.gender}</div>
                        <div className="detail-box capitalize-text"><strong>Referred By:</strong> {employee.referred_by || 'N/A'}</div>
                    </div>

                    {/* MIDDLE COLUMN */}
                    <div className="col-sm-4 mb-3">
                        <div className="detail-box"><strong>Email:</strong> {employee.email}</div>
                        <div className="detail-box"><strong>Salary:</strong> {formatSalary(employee.salary)}</div>
                        <div className="detail-box"><strong>Joining Date:</strong> {formatDate(employee.joining)}</div>
                        <div className="detail-box capitalize-text"><strong>Address:</strong> {employee.address || 'N/A'}</div>
                        
                        {/* स्टेटस: नाव असल्यास नाव दाखवेल, अन्यथा ID */}
                        <div className="detail-box capitalize-text">
                            <strong>Status:</strong> {employee.status_name || employee.status || 'N/A'}
                        </div>
                        
                        <div className="detail-box"><strong>Emergency Contact:</strong> {employee.emer_cont_no || 'N/A'}</div>
                        <div className="detail-box capitalize-text"><strong>Additional Information:</strong> {employee.additional_information || 'None'}</div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="col-sm-4 mb-3">
                        <div className="detail-box capitalize-text"><strong>Education:</strong> {employee.education || 'N/A'}</div>
                        
                        {/* वर्किंग मोड: नाव असल्यास नाव दाखवेल, अन्यथा ID */}
                        <div className="detail-box capitalize-text">
                            <strong>Working Mode:</strong> {employee.mode_name || employee.working_mode || 'N/A'}
                        </div>
                        
                        <div className="detail-box"><strong>Date of Birth:</strong> {formatDate(employee.birth)}</div>
                        <div className="detail-box"><strong>Phone:</strong> {employee.phone}</div>
                        
                        {/* एम्प्लॉई टाईप: नाव असल्यास नाव दाखवेल, अन्यथा ID */}
                        <div className="detail-box capitalize-text">
                            <strong>Employee Type:</strong> {employee.emp_type_name || employee.emp_type || 'N/A'}
                        </div>
                        
                        <div className="detail-box capitalize-text"><strong>Relation:</strong> {employee.relation || 'N/A'}</div>
                        <div className="detail-box">
                            <strong>Date of Leaving:</strong> {!employee.leaving || employee.leaving === '0000-00-00' || employee.leaving === 'N/A' ? 'Still Working' : formatDate(employee.leaving)}
                        </div>
                    </div>
                </div>

                {/* Close Button */}
                <div className="text-center mt-4">
                    <Button variant="secondary" onClick={onClose} className="px-4">
                        Close Details
                    </Button>
                </div>

            </div>
        </div>
    );
};

export default EmployeeDetails;