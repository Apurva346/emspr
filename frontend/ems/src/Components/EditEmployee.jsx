import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Alert, Image } from "react-bootstrap";
import api from "./axiosconfig";
import "./AddEmployee.css"; // Ensure this CSS file exists and is correctly named

//Helper function for consistent data normalization
const normalizeString = (str) => {
    if (!str) return "";
    return str.trim().toLowerCase().replace(/\s/g, '-'); // Replaces spaces with hyphens
};

const formatId = (id) => {
    if (!id) return 'N/A';
    return `EMP${String(id).padStart(3, '0')}`;
};


const EditEmployee = ({ employeeData, onClose }) => {
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState({ type: "", text: "" });
    const [loading, setLoading] = useState(false);

    const [profileImage, setProfileImage] = useState(null);
    const [imageError, setImageError] = useState("");
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

    // Load employee data and normalize critical fields
    // useEffect(() => {
    //     if (employeeData) {
    //         setFormData({
    //             ...employeeData,
    //             // Normalizing fields to lowercase and replacing spaces with hyphens for consistency
    //             department: normalizeString(employeeData.department),
    //             status: normalizeString(employeeData.status),
    //             working_mode: normalizeString(employeeData.working_mode),
    //             emp_type: normalizeString(employeeData.emp_type), // <--- FIX APPLIED HERE
    //             gender: normalizeString(employeeData.gender),
    //         });

    //         setImagePreviewUrl(employeeData.profile_pic);
    //     }
    // }, [employeeData]);

    // Load employee data
useEffect(() => {
    if (employeeData) {
        setFormData({
            ...employeeData,
            // बॅकएंडकडून येणारे ID इकडे मॅप करा
            department: employeeData.department_id, 
            status: employeeData.status_id,
            working_mode: employeeData.mode_id, // लक्ष द्या: डेटाबेसमध्ये 'mode_id' असेल तर
            emp_type: employeeData.emp_type_id,
            gender: normalizeString(employeeData.gender),
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

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);

    //     try {
    //         let profilePicUrl = formData.profile_pic;

    //         if (profileImage) {
    //             const fd = new FormData();
    //             fd.append("image", profileImage);

    //             // Note: Ensure the API endpoint '/upload' and logic are correct
    //             const upload = await api.post("/upload", fd);
    //             profilePicUrl = upload.data.imageUrl;
    //         }

    //         // const updated = {
    //         //     ...formData,
    //         //     profile_pic: profilePicUrl,
    //         //     // Ensure data sent to the backend is normalized if necessary
    //         //     department: normalizeString(formData.department),
    //         //     status: normalizeString(formData.status),
    //         //     working_mode: normalizeString(formData.working_mode),
    //         //     emp_type: normalizeString(formData.emp_type),
    //         //     gender: normalizeString(formData.gender),
    //         // };
    //         const updated = {
    //         ...formData,
    //         profile_pic: profilePicUrl,
    //         // ID कॉलम्स बॅकएंडला हवे तसे पाठवा
    //         department_id: formData.department,
    //         status_id: formData.status,
    //         mode_id: formData.working_mode,
    //         emp_type_id: formData.emp_type,
    //         };
    //         const res = await api.put(`/employees/${formData.id}`, updated);

    //         setMessage({ type: "success", text: res.data.message });
    //         setTimeout(() => onClose(), 1200);

    //     } catch (error) {
    //         setMessage({
    //             type: "danger",
    //             text: error.response?.data?.message || "Update failed",
    //         });
    //     } finally {
    //         setLoading(false);
    //     }
    // };

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
            // बॅकएंडला हवे असलेले बरोबर कॉलम नेम्स पाठवा
            department_id: formData.department,
            status_id: formData.status,
            mode_id: formData.working_mode,
            emp_type_id: formData.emp_type,
            gender: (formData.gender || "").toLowerCase()
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
            {/* <h2 className="text-center mb-4 add-emp-title">
                <i className="fas fa-user-edit me-2"></i>Edit Employee
            </h2> */}

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
                                    <Form.Label className="label">Employee ID</Form.Label>
                                    <Form.Control
                                       type="text"
                                       name="id"
                                       value={formatId(formData.id)} 
                                       readOnly // यामुळे युजरला यात बदल करता येणार नाही
                                       className="input bg-light" // bg-light मुळे ते फील्ड थोडं राखाडी (gray) दिसेल, जेणेकरून समजेल की ते लॉक आहे
                                       style={{ cursor: 'not-allowed', fontWeight: 'bold' }} 
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="label">Name<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name || ""}
                                        onChange={handleChange}
                                        required
                                        className="input text-capitalize"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="label">Email<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Form.Label>
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
                                    <Form.Label className="label">Phone<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Form.Label>
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
                                    <Form.Label className="label">Birth Date<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="birth"
                                        value={formData.birth?.split("T")[0] || ""}
                                        onChange={handleChange}
                                        className="input"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="label">Gender<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Form.Label>
                                    <Form.Select
                                        name="gender"
                                        value={formData.gender || ""}
                                        onChange={handleChange}
                                        required
                                        className="input text-capitalize"
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
                                    <Form.Label className="label">Department<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Form.Label>
                                    <Form.Select
                                        name="department"
                                        value={formData.department || ""}
                                        onChange={handleChange}
                                        required
                                        className="input text-capitalize"
                                    >
                                        <option value=''>Select Department</option>
                                        <option value='1'>IT</option>
                                        <option value='2'>Testing</option>
                                        <option value='3'>Development</option>
                                        <option value='4'>Marketing</option>
                                        <option value='5'>Finance</option>
                                        <option value='6'>Operation Management</option>
                                        <option value='7'>HR</option>
                                        <option value='8'>Sales</option>
                                        <option value='9'>Production</option>
                                        <option value='10'>Administration</option>
                                        <option value='11'>SNP Tours</option>
                                        <option value='12'>SNP Finance</option>
                                        <option value='13'>SNP Capital</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="label">Position<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="position"
                                        value={formData.position || ""}
                                        onChange={handleChange}
                                        required
                                        className="input text-capitalize"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="label">Manager<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="manager"
                                        value={formData.manager || ""}
                                        onChange={handleChange}
                                        required
                                        className="input text-capitalize"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="label">Joining<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="joining"
                                        value={formData.joining?.split("T")[0] || ""}
                                        onChange={handleChange}
                                        className="input" required
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
                                    <Form.Label className="label">Status<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Form.Label>
                                    <Form.Select
                                        name="status"
                                        value={formData.status || ""}
                                        onChange={handleChange}
                                        required
                                        className="input text-capitalize"
                                    >
                                        <option value="">Select</option>
                                        <option value="1">Active</option>
                                        <option value="2">Inactive</option>
                                        <option value="3">Blacklist</option>
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
                                    <Form.Label className="label">Salary<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Form.Label>
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
                                    <Form.Label className="label">Education<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="education"
                                        value={formData.education || ""}
                                        onChange={handleChange}
                                        required
                                        className="input text-capitalize"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="label">Mode<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Form.Label>
                                    <Form.Select
                                        name="working_mode"
                                        value={formData.working_mode || ""}
                                        onChange={handleChange}
                                        required
                                        className="input text-capitalize"
                                    >
                                        <option value="">Select</option>
                                        <option value="1">On-site</option>
                                        <option value="2">Remote</option>
                                        <option value="3">Hybrid</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="label">Employee Type<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Form.Label>
                                    <Form.Select
                                        name="emp_type"
                                        value={formData.emp_type || ""} // Now compares to hyphenated value
                                        onChange={handleChange}
                                        required
                                        className="input text-capitalize"
                                    >
                                        <option value="">Type</option>
                                        <option value="1">Full time</option> // UPDATED VALUE
                                        <option value="2">Part time</option> //  UPDATED VALUE
                                        <option value="3">Intern</option>
                                        <option value="4">Night Shift(12Hrs)</option>
                                        <option value="5">Day Shift(12Hrs)</option>
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
                                        className="input text-capitalize"
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
                                        className="input text-capitalize"
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
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="label">Address</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        name="address"
                                        value={formData.address || ""}
                                        onChange={handleChange}
                                        className="input text-capitalize"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="label">Additional Information</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        name="additional_information"
                                        value={formData.additional_information || ""}
                                        onChange={handleChange}
                                        className="input text-capitalize"
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

