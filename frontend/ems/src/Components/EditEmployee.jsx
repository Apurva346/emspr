// import React, { useState, useEffect } from "react";
// import { Form, Button, Row, Col, Alert, Image } from "react-bootstrap";
// import api from "./axiosconfig";
// import "./AddEmployee.css"; // Same UI

// const EditEmployee = ({ employeeData, onClose }) => {
//     const [formData, setFormData] = useState({});
//     const [message, setMessage] = useState({ type: "", text: "" });
//     const [loading, setLoading] = useState(false);

//     const [profileImage, setProfileImage] = useState(null);
//     const [imageError, setImageError] = useState("");
//     const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

//     // Load employee data into form
//     useEffect(() => {
//         if (employeeData) {
//             setFormData(employeeData);
//             setImagePreviewUrl(employeeData.profile_pic);
//         }
//     }, [employeeData]);

//     // Preview new image
//     useEffect(() => {
//         if (profileImage) {
//             const reader = new FileReader();
//             reader.onloadend = () => setImagePreviewUrl(reader.result);
//             reader.readAsDataURL(profileImage);
//         }
//     }, [profileImage]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             let profilePicUrl = formData.profile_pic;

//             if (profileImage) {
//                 const fd = new FormData();
//                 fd.append("image", profileImage);

//                 const upload = await api.post("/upload", fd);
//                 profilePicUrl = upload.data.imageUrl;
//             }

//             const updated = {
//                 ...formData,
//                 profile_pic: profilePicUrl,
//             };

//             const response = await api.put(`/employees/${formData.id}`, updated);
//             setMessage({ type: "success", text: response.data.message });

//             setTimeout(() => onClose(), 1500);
//         } catch (error) {
//             setMessage({
//                 type: "danger",
//                 text: error.response?.data?.message || "Update failed",
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="add-employee-wrapper">
//             <h2 className="text-center mb-4 add-emp-title">
//                 <i className="fas fa-user-edit me-2"></i>Edit Employee
//             </h2>

//             {message.text && <Alert variant={message.type}>{message.text}</Alert>}

//             <Form onSubmit={handleSubmit}>
//                 <Row>

//                     {/* PERSONAL */}
//                     <Col lg={4} md={12}>
//                         <h5 className="section-title">Personal Information</h5>
//                         <hr className="section-line" />

//                         <Row>
//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Name *</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="name"
//                                         value={formData.name || ""}
//                                         onChange={handleChange}
//                                         required
//                                         className="input"
//                                     />
//                                 </Form.Group>
//                             </Col>

//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Email *</Form.Label>
//                                     <Form.Control
//                                         type="email"
//                                         name="email"
//                                         value={formData.email || ""}
//                                         onChange={handleChange}
//                                         className="input"
//                                     />
//                                 </Form.Group>
//                             </Col>

//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Phone *</Form.Label>
//                                     <Form.Control
//                                         type="tel"
//                                         name="phone"
//                                         value={formData.phone || ""}
//                                         onChange={handleChange}
//                                         required
//                                         className="input"
//                                     />
//                                 </Form.Group>
//                             </Col>

//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Birth Date</Form.Label>
//                                     <Form.Control
//                                         type="date"
//                                         name="birth"
//                                         value={formData.birth?.split("T")[0] || ""}
//                                         onChange={handleChange}
//                                         className="input"
//                                     />
//                                 </Form.Group>
//                             </Col>

//                             <Col md={12}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Gender *</Form.Label>
//                                     <Form.Select
//                                         name="gender"
//                                         value={formData.gender || ""}
//                                         onChange={handleChange}
//                                         required
//                                         className="input"
//                                     >
//                                         <option value="">Select</option>
//                                         <option value="male">Male</option>
//                                         <option value="female">Female</option>
//                                         <option value="other">Other</option>
//                                     </Form.Select>
//                                 </Form.Group>
//                             </Col>
//                         </Row>
//                     </Col>

//                     {/* EMPLOYMENT */}
//                     <Col lg={4} md={12}>
//                         <h5 className="section-title">Employment Details</h5>
//                         <hr className="section-line" />

//                         <Row>
//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Department *</Form.Label>
//                                     <Form.Select
//                                         name="department"
//                                         value={formData.department || ""}
//                                         onChange={handleChange}
//                                         required
//                                         className="input"
//                                     >
//                                         <option value="">Select</option>
//                                         <option>IT</option>
//                                         <option>HR</option>
//                                         <option>Sales</option>
//                                         <option>Marketing</option>
//                                     </Form.Select>
//                                 </Form.Group>
//                             </Col>

//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Position *</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="position"
//                                         value={formData.position || ""}
//                                         onChange={handleChange}
//                                         required
//                                         className="input"
//                                     />
//                                 </Form.Group>
//                             </Col>

//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Manager *</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="manager"
//                                         value={formData.manager || ""}
//                                         onChange={handleChange}
//                                         required
//                                         className="input"
//                                     />
//                                 </Form.Group>
//                             </Col>

//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Joining</Form.Label>
//                                     <Form.Control
//                                         type="date"
//                                         name="joining"
//                                         value={formData.joining?.split("T")[0] || ""}
//                                         onChange={handleChange}
//                                         className="input"
//                                     />
//                                 </Form.Group>
//                             </Col>

//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Leaving</Form.Label>
//                                     <Form.Control
//                                         type="date"
//                                         name="leaving"
//                                         value={formData.leaving?.split("T")[0] || ""}
//                                         onChange={handleChange}
//                                         className="input"
//                                     />
//                                 </Form.Group>
//                             </Col>

//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Status *</Form.Label>
//                                     <Form.Select
//                                         name="status"
//                                         value={formData.status || ""}
//                                         onChange={handleChange}
//                                         required
//                                         className="input"
//                                     >
//                                         <option value="">Select</option>
//                                         <option value="Active">Active</option>
//                                         <option value="Inactive">Inactive</option>
//                                         <option value="Blacklist">Blacklist</option>
//                                     </Form.Select>
//                                 </Form.Group>
//                             </Col>
//                         </Row>
//                     </Col>

//                     {/* OTHER */}
//                     <Col lg={4} md={12}>
//                         <h5 className="section-title">Other Details</h5>
//                         <hr className="section-line" />

//                         <Row>
//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Salary *</Form.Label>
//                                     <Form.Control
//                                         type="number"
//                                         name="salary"
//                                         value={formData.salary || ""}
//                                         onChange={handleChange}
//                                         required
//                                         className="input"
//                                     />
//                                 </Form.Group>
//                             </Col>

//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Education *</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="education"
//                                         value={formData.education || ""}
//                                         onChange={handleChange}
//                                         required
//                                         className="input"
//                                     />
//                                 </Form.Group>
//                             </Col>

//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Mode *</Form.Label>
//                                     <Form.Select
//                                         name="working_mode"
//                                         value={formData.working_mode || ""}
//                                         onChange={handleChange}
//                                         required
//                                         className="input"
//                                     >
//                                         <option value="">Select</option>
//                                         <option value="on-site">On-site</option>
//                                         <option value="remote">Remote</option>
//                                         <option value="hybrid">Hybrid</option>
//                                     </Form.Select>
//                                 </Form.Group>
//                             </Col>

//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Employee Type *</Form.Label>
//                                     <Form.Select
//                                         name="emp_type"
//                                         value={formData.emp_type || ""}
//                                         onChange={handleChange}
//                                         required
//                                         className="input"
//                                     >
//                                         <option value="">Type</option>
//                                         <option value="full time">Full time</option>
//                                         <option value="part time">Part time</option>
//                                         <option value="intern">Intern</option>
//                                     </Form.Select>
//                                 </Form.Group>
//                             </Col>

//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Emergency Number</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="emer_cont_no"
//                                         value={formData.emer_cont_no || ""}
//                                         onChange={handleChange}
//                                         className="input"
//                                     />
//                                 </Form.Group>
//                             </Col>

//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Relation</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="relation"
//                                         value={formData.relation || ""}
//                                         onChange={handleChange}
//                                         className="input"
//                                     />
//                                 </Form.Group>
//                             </Col>

//                             <Col md={12}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Referred By</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="referred_by"
//                                         value={formData.referred_by || ""}
//                                         onChange={handleChange}
//                                         className="input"
//                                     />
//                                 </Form.Group>
//                             </Col>
//                         </Row>
//                     </Col>

//                     {/* ADDRESS + IMAGE */}
//                     <Col lg={12} className="mt-4">
//                         <h5 className="section-title">Address & Profile Image</h5>
//                         <hr className="section-line" />

//                         <Row>
//                             <Col md={8}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Address</Form.Label>
//                                     <Form.Control
//                                         as="textarea"
//                                         rows={4}
//                                         name="address"
//                                         value={formData.address || ""}
//                                         onChange={handleChange}
//                                         className="input"
//                                     />
//                                 </Form.Group>
//                             </Col>

//                             <Col md={4} className="text-center">
//                                 <Form.Group>
//                                     <Form.Label className="label">Profile Picture</Form.Label>
//                                     <Form.Control
//                                         type="file"
//                                         accept=".jpg,.jpeg,.png"
//                                         className="input"
//                                         onChange={(e) => {
//                                             const file = e.target.files[0];
//                                             if (!file) return;

//                                             if (file.size > 100 * 1024) {
//                                                 setImageError("Image must be under 100 KB");
//                                                 return;
//                                             }

//                                             setImageError("");
//                                             setProfileImage(file);
//                                         }}
//                                     />
//                                     {imageError && (
//                                         <small className="text-danger">{imageError}</small>
//                                     )}
//                                 </Form.Group>

//                                 {imagePreviewUrl && (
//                                     <Image
//                                         src={imagePreviewUrl}
//                                         roundedCircle
//                                         style={{ width: 100, height: 100, objectFit: "cover" }}
//                                     />
//                                 )}
//                             </Col>
//                         </Row>
//                     </Col>
//                 </Row>

//                 <div className="mt-4 d-flex gap-3">
//                     <Button className="btn btn-secondary w-25" onClick={onClose}>
//                         Cancel
//                     </Button>
//                     <Button type="submit" disabled={loading} className="btn btn-primary w-25">
//                         {loading ? "Updating..." : "Update Employee"}
//                     </Button>
//                 </div>
//             </Form>
//         </div>
//     );
// };

// export default EditEmployee;



// import React, { useState, useEffect } from "react";
// import { Form, Button, Row, Col, Alert, Image } from "react-bootstrap";
// import api from "./axiosconfig";
// import "./AddEmployee.css";

// const EditEmployee = ({ employeeData, onClose }) => {
//     const [formData, setFormData] = useState({});
//     const [message, setMessage] = useState({ type: "", text: "" });
//     const [loading, setLoading] = useState(false);

//     const [profileImage, setProfileImage] = useState(null);
//     const [imageError, setImageError] = useState("");
//     const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

//     // FIXED — normalize dropdown values (STATUS + DEPARTMENT)
//     useEffect(() => {
//         if (employeeData) {
//             setFormData({
//                 ...employeeData,

//                 status: employeeData.status
//                     ? employeeData.status.charAt(0).toUpperCase() + employeeData.status.slice(1).toLowerCase()
//                     : "",

//                 department: employeeData.department
//                     ? employeeData.department.charAt(0).toUpperCase() + employeeData.department.slice(1).toLowerCase()
//                     : "",
//             });

//             setImagePreviewUrl(employeeData.profile_pic);
//         }
//     }, [employeeData]);

//     // Preview new image
//     useEffect(() => {
//         if (profileImage) {
//             const reader = new FileReader();
//             reader.onloadend = () => setImagePreviewUrl(reader.result);
//             reader.readAsDataURL(profileImage);
//         }
//     }, [profileImage]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             let profilePicUrl = formData.profile_pic;

//             if (profileImage) {
//                 const fd = new FormData();
//                 fd.append("image", profileImage);

//                 const upload = await api.post("/upload", fd);
//                 profilePicUrl = upload.data.imageUrl;
//             }

//             const updated = {
//                 ...formData,
//                 profile_pic: profilePicUrl,
//             };

//             const response = await api.put(`/employees/${formData.id}`, updated);
//             setMessage({ type: "success", text: response.data.message });

//             setTimeout(() => onClose(), 1500);
//         } catch (error) {
//             setMessage({
//                 type: "danger",
//                 text: error.response?.data?.message || "Update failed",
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="add-employee-wrapper">
//             <h2 className="text-center mb-4 add-emp-title">
//                 <i className="fas fa-user-edit me-2"></i>Edit Employee
//             </h2>

//             {message.text && <Alert variant={message.type}>{message.text}</Alert>}

//             <Form onSubmit={handleSubmit}>
//                 <Row>

//                     {/* PERSONAL */}
//                     <Col lg={4} md={12}>
//                         <h5 className="section-title">Personal Information</h5>
//                         <hr className="section-line" />

//                         <Row>
//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Name *</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="name"
//                                         value={formData.name || ""}
//                                         onChange={handleChange}
//                                         required
//                                         className="input"
//                                     />
//                                 </Form.Group>
//                             </Col>

//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Email *</Form.Label>
//                                     <Form.Control
//                                         type="email"
//                                         name="email"
//                                         value={formData.email || ""}
//                                         onChange={handleChange}
//                                         className="input"
//                                     />
//                                 </Form.Group>
//                             </Col>

//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Phone *</Form.Label>
//                                     <Form.Control
//                                         type="tel"
//                                         name="phone"
//                                         value={formData.phone || ""}
//                                         onChange={handleChange}
//                                         required
//                                         className="input"
//                                     />
//                                 </Form.Group>
//                             </Col>

//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Birth Date</Form.Label>
//                                     <Form.Control
//                                         type="date"
//                                         name="birth"
//                                         value={formData.birth?.split("T")[0] || ""}
//                                         onChange={handleChange}
//                                         className="input"
//                                     />
//                                 </Form.Group>
//                             </Col>

//                             <Col md={12}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Gender *</Form.Label>
//                                     <Form.Select
//                                         name="gender"
//                                         value={formData.gender || ""}
//                                         onChange={handleChange}
//                                         required
//                                         className="input"
//                                     >
//                                         <option value="">Select</option>
//                                         <option value="male">Male</option>
//                                         <option value="female">Female</option>
//                                         <option value="other">Other</option>
//                                     </Form.Select>
//                                 </Form.Group>
//                             </Col>
//                         </Row>
//                     </Col>

//                     {/* EMPLOYMENT */}
//                     <Col lg={4} md={12}>
//                         <h5 className="section-title">Employment Details</h5>
//                         <hr className="section-line" />

//                         <Row>
//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Department *</Form.Label>
//                                     <Form.Select
//                                         name="department"
//                                         value={formData.department || ""}
//                                         onChange={handleChange}
//                                         required
//                                         className="input"
//                                     >
//                                         <option value="">Select</option>
//                                         <option value="IT">IT</option>
//                                         <option value="HR">HR</option>
//                                         <option value="Sales">Sales</option>
//                                         <option value="Marketing">Marketing</option>
//                                     </Form.Select>
//                                 </Form.Group>
//                             </Col>

//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Position *</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="position"
//                                         value={formData.position || ""}
//                                         onChange={handleChange}
//                                         required
//                                         className="input"
//                                     />
//                                 </Form.Group>
//                             </Col>

//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Manager *</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="manager"
//                                         value={formData.manager || ""}
//                                         onChange={handleChange}
//                                         required
//                                         className="input"
//                                     />
//                                 </Form.Group>
//                             </Col>

//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Joining</Form.Label>
//                                     <Form.Control
//                                         type="date"
//                                         name="joining"
//                                         value={formData.joining?.split("T")[0] || ""}
//                                         onChange={handleChange}
//                                         className="input"
//                                     />
//                                 </Form.Group>
//                             </Col>

//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Leaving</Form.Label>
//                                     <Form.Control
//                                         type="date"
//                                         name="leaving"
//                                         value={formData.leaving?.split("T")[0] || ""}
//                                         onChange={handleChange}
//                                         className="input"
//                                     />
//                                 </Form.Group>
//                             </Col>

//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Status *</Form.Label>
//                                     <Form.Select
//                                         name="status"
//                                         value={formData.status || ""}
//                                         onChange={handleChange}
//                                         required
//                                         className="input"
//                                     >
//                                         <option value="">Select</option>
//                                         <option value="Active">Active</option>
//                                         <option value="Inactive">Inactive</option>
//                                         <option value="Blacklist">Blacklist</option>
//                                     </Form.Select>
//                                 </Form.Group>
//                             </Col>
//                         </Row>
//                     </Col>

//                     {/* OTHER */}
//                     <Col lg={4} md={12}>
//                         <h5 className="section-title">Other Details</h5>
//                         <hr className="section-line" />

//                         <Row>
//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Salary *</Form.Label>
//                                     <Form.Control
//                                         type="number"
//                                         name="salary"
//                                         value={formData.salary || ""}
//                                         onChange={handleChange}
//                                         required
//                                         className="input"
//                                     />
//                                 </Form.Group>
//                             </Col>

//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Education *</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="education"
//                                         value={formData.education || ""}
//                                         onChange={handleChange}
//                                         required
//                                         className="input"
//                                     />
//                                 </Form.Group>
//                             </Col>

//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Mode *</Form.Label>
//                                     <Form.Select
//                                         name="working_mode"
//                                         value={formData.working_mode || ""}
//                                         onChange={handleChange}
//                                         required
//                                         className="input"
//                                     >
//                                         <option value="">Select</option>
//                                         <option value="on-site">On-site</option>
//                                         <option value="remote">Remote</option>
//                                         <option value="hybrid">Hybrid</option>
//                                     </Form.Select>
//                                 </Form.Group>
//                             </Col>

//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Employee Type *</Form.Label>
//                                     <Form.Select
//                                         name="emp_type"
//                                         value={formData.emp_type || ""}
//                                         onChange={handleChange}
//                                         required
//                                         className="input"
//                                     >
//                                         <option value="">Type</option>
//                                         <option value="full time">Full time</option>
//                                         <option value="part time">Part time</option>
//                                         <option value="intern">Intern</option>
//                                     </Form.Select>
//                                 </Form.Group>
//                             </Col>

//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Emergency Number</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="emer_cont_no"
//                                         value={formData.emer_cont_no || ""}
//                                         onChange={handleChange}
//                                         className="input"
//                                     />
//                                 </Form.Group>
//                             </Col>

//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Relation</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="relation"
//                                         value={formData.relation || ""}
//                                         onChange={handleChange}
//                                         className="input"
//                                     />
//                                 </Form.Group>
//                             </Col>

//                             <Col md={12}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Referred By</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="referred_by"
//                                         value={formData.referred_by || ""}
//                                         onChange={handleChange}
//                                         className="input"
//                                     />
//                                 </Form.Group>
//                             </Col>
//                         </Row>
//                     </Col>

//                     {/* ADDRESS + IMAGE */}
//                     <Col lg={12} className="mt-4">
//                         <h5 className="section-title">Address & Profile Image</h5>
//                         <hr className="section-line" />

//                         <Row>
//                             <Col md={8}>
//                                 <Form.Group>
//                                     <Form.Label className="label">Address</Form.Label>
//                                     <Form.Control
//                                         as="textarea"
//                                         rows={4}
//                                         name="address"
//                                         value={formData.address || ""}
//                                         onChange={handleChange}
//                                         className="input"
//                                     />
//                                 </Form.Group>
//                             </Col>

//                             <Col md={4} className="text-center">
//                                 <Form.Group>
//                                     <Form.Label className="label">Profile Picture</Form.Label>
//                                     <Form.Control
//                                         type="file"
//                                         accept=".jpg,.jpeg,.png"
//                                         className="input"
//                                         onChange={(e) => {
//                                             const file = e.target.files[0];
//                                             if (!file) return;

//                                             if (file.size > 100 * 1024) {
//                                                 setImageError("Image must be under 100 KB");
//                                                 return;
//                                             }

//                                             setImageError("");
//                                             setProfileImage(file);
//                                         }}
//                                     />
//                                     {imageError && (
//                                         <small className="text-danger">{imageError}</small>
//                                     )}
//                                 </Form.Group>

//                                 {imagePreviewUrl && (
//                                     <Image
//                                         src={imagePreviewUrl}
//                                         roundedCircle
//                                         style={{ width: 100, height: 100, objectFit: "cover" }}
//                                     />
//                                 )}
//                             </Col>
//                         </Row>
//                     </Col>
//                 </Row>

//                 <div className="mt-4 d-flex gap-3">
//                     <Button className="btn btn-secondary w-25" onClick={onClose}>
//                         Cancel
//                     </Button>
//                     <Button type="submit" disabled={loading} className="btn btn-primary w-25">
//                         {loading ? "Updating..." : "Update Employee"}
//                     </Button>
//                 </div>
//             </Form>
//         </div>
//     );
// };

// export default EditEmployee;


import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Alert, Image } from "react-bootstrap";
import api from "./axiosconfig";
import "./AddEmployee.css";

const EditEmployee = ({ employeeData, onClose }) => {
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState({ type: "", text: "" });
    const [loading, setLoading] = useState(false);

    const [profileImage, setProfileImage] = useState(null);
    const [imageError, setImageError] = useState("");
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

    // Load employee data
    useEffect(() => {
        if (employeeData) {
            setFormData({
                ...employeeData,
                department: employeeData.department?.toLowerCase(), // ⭐ FIX
                status: employeeData.status?.toLowerCase(),         // ⭐ FIX
            });

            setImagePreviewUrl(employeeData.profile_pic);
        }
    }, [employeeData]);

    // Preview image
    useEffect(() => {
        if (profileImage) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreviewUrl(reader.result);
            reader.readAsDataURL(profileImage);
        }
    }, [profileImage]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let profilePicUrl = formData.profile_pic;

            if (profileImage) {
                const fd = new FormData();
                fd.append("image", profileImage);

                const upload = await api.post("/upload", fd);
                profilePicUrl = upload.data.imageUrl;
            }

            const updated = {
                ...formData,
                profile_pic: profilePicUrl,
            };

            const res = await api.put(`/employees/${formData.id}`, updated);

            setMessage({ type: "success", text: res.data.message });
            setTimeout(() => onClose(), 1200);

        } catch (error) {
            setMessage({
                type: "danger",
                text: error.response?.data?.message || "Update failed",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-employee-wrapper">
            <h2 className="text-center mb-4 add-emp-title">
                <i className="fas fa-user-edit me-2"></i>Edit Employee
            </h2>

            {message.text && <Alert variant={message.type}>{message.text}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Row>

                    {/* PERSONAL */}
                    <Col lg={4} md={12}>
                        <h5 className="section-title">Personal Information</h5>
                        <hr className="section-line" />

                        <Row>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="label">Name *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name || ""}
                                        onChange={handleChange}
                                        required
                                        className="input"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="label">Email *</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email || ""}
                                        onChange={handleChange}
                                        className="input"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="label">Phone *</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="phone"
                                        value={formData.phone || ""}
                                        onChange={handleChange}
                                        required
                                        className="input"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="label">Birth Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="birth"
                                        value={formData.birth?.split("T")[0] || ""}
                                        onChange={handleChange}
                                        className="input"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="label">Gender *</Form.Label>
                                    <Form.Select
                                        name="gender"
                                        value={formData.gender || ""}
                                        onChange={handleChange}
                                        required
                                        className="input"
                                    >
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Col>

                    {/* EMPLOYMENT */}
                    <Col lg={4} md={12}>
                        <h5 className="section-title">Employment Details</h5>
                        <hr className="section-line" />

                        <Row>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="label">Department *</Form.Label>
                                    <Form.Select
                                        name="department"
                                        value={formData.department || ""}
                                        onChange={handleChange}
                                        required
                                        className="input"
                                    >
                                        <option value=''>Select Department</option>
                                        <option value='it'>IT</option>
                                        <option value='testing'>Testing</option>
                                        <option value='development'>Development</option>
                                        <option value='marketing'>Marketing</option>
                                        <option value='finance'>Finance</option>
                                        <option value='operation Management'>Operation Management</option>
                                        <option value='hR'>HR</option>
                                        <option value='sales'>Sales</option>
                                        <option value='production'>Production</option>
                                        <option value='administration'>Administration</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="label">Position *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="position"
                                        value={formData.position || ""}
                                        onChange={handleChange}
                                        required
                                        className="input"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="label">Manager *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="manager"
                                        value={formData.manager || ""}
                                        onChange={handleChange}
                                        required
                                        className="input"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="label">Joining</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="joining"
                                        value={formData.joining?.split("T")[0] || ""}
                                        onChange={handleChange}
                                        className="input"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="label">Leaving</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="leaving"
                                        value={formData.leaving?.split("T")[0] || ""}
                                        onChange={handleChange}
                                        className="input"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="label">Status *</Form.Label>
                                    <Form.Select
                                        name="status"
                                        value={formData.status || ""}
                                        onChange={handleChange}
                                        required
                                        className="input"
                                    >
                                        <option value="">Select</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="blacklist">Blacklist</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Col>

                    {/* OTHER */}
                    <Col lg={4} md={12}>
                        <h5 className="section-title">Other Details</h5>
                        <hr className="section-line" />

                        <Row>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="label">Salary *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="salary"
                                        value={formData.salary || ""}
                                        onChange={handleChange}
                                        required
                                        className="input"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="label">Education *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="education"
                                        value={formData.education || ""}
                                        onChange={handleChange}
                                        required
                                        className="input"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="label">Mode *</Form.Label>
                                    <Form.Select
                                        name="working_mode"
                                        value={formData.working_mode || ""}
                                        onChange={handleChange}
                                        required
                                        className="input"
                                    >
                                        <option value="">Select</option>
                                        <option value="on-site">On-site</option>
                                        <option value="remote">Remote</option>
                                        <option value="hybrid">Hybrid</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="label">Employee Type *</Form.Label>
                                    <Form.Select
                                        name="emp_type"
                                        value={formData.emp_type || ""}
                                        onChange={handleChange}
                                        required
                                        className="input"
                                    >
                                        <option value="">Type</option>
                                        <option value="full time">Full time</option>
                                        <option value="part time">Part time</option>
                                        <option value="intern">Intern</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="label">Emergency Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="emer_cont_no"
                                        value={formData.emer_cont_no || ""}
                                        onChange={handleChange}
                                        className="input"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="label">Relation</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="relation"
                                        value={formData.relation || ""}
                                        onChange={handleChange}
                                        className="input"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="label">Referred By</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="referred_by"
                                        value={formData.referred_by || ""}
                                        onChange={handleChange}
                                        className="input"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Col>

                    {/* ADDRESS & IMAGE */}
                    <Col lg={12} className="mt-4">
                        <h5 className="section-title">Address & Profile Image</h5>
                        <hr className="section-line" />

                        <Row>
                            <Col md={8}>
                                <Form.Group>
                                    <Form.Label className="label">Address</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        name="address"
                                        value={formData.address || ""}
                                        onChange={handleChange}
                                        className="input"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4} className="text-center">
                                <Form.Group>
                                    <Form.Label className="label">Profile Picture</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        className="input"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;

                                            if (file.size > 100 * 1024) {
                                                setImageError("Image must be under 100 KB");
                                                return;
                                            }

                                            setImageError("");
                                            setProfileImage(file);
                                        }}
                                    />
                                    {imageError && (
                                        <small className="text-danger">{imageError}</small>
                                    )}
                                </Form.Group>

                                {imagePreviewUrl && (
                                    <Image
                                        src={imagePreviewUrl}
                                        roundedCircle
                                        style={{ width: 100, height: 100, objectFit: "cover" }}
                                    />
                                )}
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <div className="mt-4 d-flex gap-3">
                    <Button className="btn btn-secondary w-25" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading} className="btn btn-primary w-25">
                        {loading ? "Updating..." : "Update Employee"}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default EditEmployee;

