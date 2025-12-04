import React, { useState, useEffect } from 'react'
import { Form, Button, Card, Alert, Row, Col, Image } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from './axiosconfig'
import './AddEmployee.css';

const AddEmployee = ({ onClose }) => {
    const [imageError, setImageError] = useState("");
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: '', manager: '', department: '', salary: '', profile_pic: '',
        email: '', phone: '', position: '', birth: '', status: '',
        education: '', joining: '', leaving: '', working_mode: '',
        emp_type: '', address: '', gender: '', emer_cont_no: '',
        relation: '', referred_by: ''
    })

    const [message, setMessage] = useState({ type: '', text: '' })
    const [loading, setLoading] = useState(false)
    const [profileImage, setProfileImage] = useState(null)
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null)

    
    const today = new Date();

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1); // 👈 येथे बदल केला आहे.

    const year = yesterday.getFullYear();

    const month = String(yesterday.getMonth() + 1).padStart(2, '0'); 
    const day = String(yesterday.getDate()).padStart(2, '0');


    const maxDate = `${year}-${month}-${day}`; 

    // ----------------- IMAGE PREVIEW (NO CHANGE) -----------------
    useEffect(() => {
        if (profileImage) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result)
            }
            reader.readAsDataURL(profileImage)
        } else {
            setImagePreviewUrl(null)
        }
    }, [profileImage])

    const handleChange = e => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleImageChange = e => {
        const file = e.target.files[0]
        if (file) setProfileImage(file)
    }

    // ----------------- SUBMIT (NO CHANGE) -----------------
    const handleSubmit = async e => {
        e.preventDefault()
        setLoading(true)
        setMessage({ type: '', text: '' })

        let profilePicUrl = ''

        try {
            if (profileImage) {
                const imageData = new FormData()
                imageData.append('image', profileImage)
                const uploadResponse = await axios.post('/upload', imageData)
                profilePicUrl = uploadResponse.data.imageUrl
            }

            const employeeData = {
                ...formData,
                profile_pic: profilePicUrl,
                leaving: formData.leaving === '' ? null : formData.leaving
            }

            const response = await axios.post('/employees', employeeData)

            setMessage({ type: 'success', text: response.data.message })

            setFormData({
                name: '', manager: '', department: '', salary: '', profile_pic: '',
                email: '', phone: '', position: '', birth: '', status: 'Active',
                education: '', joining: '', working_mode: 'on-site', emp_type: 'full time',
                address: '', gender: '', emer_cont_no: '', relation: '', referred_by: '', leaving: ''
            })

            setProfileImage(null)

            setTimeout(() => {
                if (onClose) onClose();
                navigate('/home');
            }, 1000)

        } catch (error) {
            setMessage({
                type: 'danger',
                text: error.response?.data?.message || 'An error occurred while adding the employee.'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        

      <div className='add-employee-wrapper p-4'>

    {/* <h2 className='text-center mb-4 add-emp-title'>
        <i className="fas fa-user-plus me-2"></i>
        Add Employee
    </h2> */}

    {message.text && <Alert variant={message.type}>{message.text}</Alert>}

    <Form onSubmit={handleSubmit}>

        <Row>
            {/* 🔵 PERSONAL SECTION */}
            <Col lg={4} md={12}>
                <h5 className='section-title'>Personal Information</h5>
                <hr className='section-line' />

                <Row>
                    <Col md={6}>
                        <Form.Group className='mb-3'>
                            <Form.Label className='label'>
                              Name<span style={{ color: 'red', marginLeft: '5px' }}>*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                // className={formData.name.trim() === '' ? 'input-red-border' : 'input-green-border'}
                            />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group className='mb-3'>
                            <Form.Label className='label'>Email<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required

                            />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group className='mb-3'>
                            <Form.Label className='label'>Phone<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Form.Label>
                            <Form.Control
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className='input'
                                minLength={10}
                            />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group className='mb-3'>
                            <Form.Label className='label'>Birth Date<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Form.Label>
                            <Form.Control
                                type="date"
                                name="birth"
                                value={formData.birth}
                                onChange={handleChange}
                                className='input'
                                required
                                max={maxDate}
                            />
                        </Form.Group>
                    </Col>

                    <Col md={12}>
                        <Form.Group className='mb-3'>
                            <Form.Label className='label'>Gender<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Form.Label>
                            <Form.Select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                                className='input'
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

            {/* 🟣 EMPLOYMENT SECTION */}
            <Col lg={4} md={12}>
                <h5 className='section-title'>Employment Details</h5>
                <hr className='section-line' />

                <Row>
                    <Col md={6}>
                        <Form.Group className='mb-3'>
                            <Form.Label className='label'>Department<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Form.Label>
                            
                            <Form.Select
                              as='select'
                              name='department'
                              value={formData.department}
                              onChange={handleChange}
                              required
                              
                            >
                            <option value=''>Select Department</option>
                            <option value='It'>IT</option>
                            <option value='Testing'>Testing</option>
                            <option value='Development'>Development</option>
                            <option value='Marketing'>Marketing</option>
                            <option value='Finance'>Finance</option>
                            <option value='Operation Management'>Operation Management</option>
                            <option value='HR'>HR</option>
                            <option value='Sales'>Sales</option>
                            <option value='Production'>Production</option>
                            <option value='Administration'>Administration</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group className='mb-3'>
                            <Form.Label className='label'>Position<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                required
                                className='input'
                                
                            />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group className='mb-3'>
                            <Form.Label className='label'>Manager<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                name="manager"
                                value={formData.manager}
                                onChange={handleChange}
                                required
                                className='input'
                                
                            />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group className='mb-3'>
                            <Form.Label className='label'>Joining Date<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Form.Label>
                            <Form.Control
                                type="date"
                                name="joining"
                                value={formData.joining}
                                onChange={handleChange}
                                className='input'
                                required
                                
                            />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group className='mb-3'>
                            <Form.Label className='label'>Leaving Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="leaving"
                                value={formData.leaving}
                                onChange={handleChange}
                                className='input'
                            />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group className='mb-3'>
                            <Form.Label className='label'>Status<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Form.Label>
                            <Form.Select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                                className='input'
                                
                            >
                                <option value="">Select</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Blacklist">Blacklist</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
            </Col>

            {/* 🟢 OTHER DETAILS */}
            <Col lg={4} md={12}>
                <h5 className='section-title'>Other Details</h5>
                <hr className='section-line' />

                <Row>
                    <Col md={6}>
                        <Form.Group className='mb-3'>
                            <Form.Label className='label'>Salary<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Form.Label>
                            <Form.Control
                                type="number"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                required
                                className='input'
                                
                            />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group className='mb-3'>
                            <Form.Label className='label'>Education<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                name="education"
                                value={formData.education}
                                onChange={handleChange}
                                required
                                className='input'
                                
                            />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group className='mb-3'>
                            <Form.Label className='label'>Mode<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Form.Label>
                            <Form.Select
                                name="working_mode"
                                value={formData.working_mode}
                                onChange={handleChange}
                                required
                                className='input'
                                
                            >
                                <option value="">Select</option>
                                <option value="on-site">On-site</option>
                                <option value="remote">Remote</option>
                                <option value="hybrid">Hybrid</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group className='mb-3'>
                            <Form.Label className='label'>Employee Type<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Form.Label>
                            <Form.Select
                                name="emp_type"
                                value={formData.emp_type}
                                onChange={handleChange}
                                required
                                className='input'
                                
                            >
                                <option value="">Select</option>
                                <option value="full time">Full Time</option>
                                <option value="part time">Part Time</option>
                                <option value="intern">Intern</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group className='mb-3'>
                            <Form.Label className='label'>Emergency Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="emer_cont_no"
                                value={formData.emer_cont_no}
                                onChange={handleChange}
                                className='input'
                                maxLength={10}
                            />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group className='mb-3'>
                            <Form.Label className='label'>Relation</Form.Label>
                            <Form.Control
                                type="text"
                                name="relation"
                                value={formData.relation}
                                onChange={handleChange}
                                className='input'
                            />
                        </Form.Group>
                    </Col>

                    <Col md={12}>
                        <Form.Group className='mb-3'>
                            <Form.Label className='label'>Referred By</Form.Label>
                            <Form.Control
                                type="text"
                                name="referred_by"
                                value={formData.referred_by}
                                onChange={handleChange}
                                className='input'
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Col>

            {/* 🟡 ADDRESS + IMAGE */}
            <Col lg={12} className="mt-3">
                <h5 className='section-title'>Address & Profile Image</h5>
                <hr className='section-line' />

                <Row>
                    <Col md={8}>
                        <Form.Group className='mb-3'>
                            <Form.Label className='label'>Address</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className='input'
                            />
                        </Form.Group>
                    </Col>

                    <Col md={4} className='text-center'>
                        <Form.Group className='mb-3'>
                            <Form.Label className='label'>Profile Picture</Form.Label>
                            <Form.Control
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;

                                    const maxSize = 100 * 1024;
                                    const types = ["image/jpeg", "image/png"];

                                    if (file.size > maxSize) {
                                        setImageError("Image must be under 100 KB");
                                        return;
                                    }
                                    if (!types.includes(file.type)) {
                                        setImageError("Only JPG/PNG allowed");
                                        return;
                                    }

                                    setImageError("");
                                    handleImageChange(e);
                                }}
                                className='input'
                            />
                            {imageError && <small className='text-danger'>{imageError}</small>}
                        </Form.Group>

                        {imagePreviewUrl && (
                            <Image
                                src={imagePreviewUrl}
                                roundedCircle
                                style={{ width: 100, height: 100, objectFit: "cover" }}
                                className='shadow-sm'
                            />
                        )}
                    </Col>
                </Row>
            </Col>
        </Row>

        {/* BUTTONS */}
        <div className="mt-4 d-flex gap-3">
            <Button type='submit' disabled={loading} className='btn btn-primary w-25'>
                {loading ? "Adding..." : "Add Employee"}
            </Button>

            <Button
                className='btn btn-secondary w-25'
                onClick={() => onClose ? onClose() : navigate('/home')}
            >
                Cancel
            </Button>
        </div>

    </Form>
</div>


    )
}

export default AddEmployee
