// import React, { useState } from 'react';
// import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const AddEmployee = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     manager: '',
//     department: '',
//     salary: '',
//     email: '',
//     phone: '',
//     profile_pic: '',
//     position: '',
//     birth: '',
//     status: 'active',
//     education: '',
//     joining_date: '',
//     working_mode: 'on-site',
//     emp_type: 'full time',
//     address: '',
//     gender: ''
//   });
//   const [message, setMessage] = useState({ type: '', text: '' });
//   const [loading, setLoading] = useState(false);

//   const handleChange = e => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage({ type: '', text: '' });

//     try {
//       const response = await axios.post(
//         'http://localhost:3001/api/employees',
//         formData
//       );
//       setMessage({ type: 'success', text: response.data.message });
//       setFormData({
//         name: '',
//         manager: '',
//         department: '',
//         salary: '',
//         email: '',
//         phone: '',
//         profile_pic: '',
//         position: '',
//         birth: '',
//         status: 'active',
//         education: '',
//         joining_date: '',
//         working_mode: 'on-site',
//         emp_type: 'full time',
//         address: '',
//         gender: ''
//       });
//       setTimeout(() => navigate('/home'), 2000);
//     } catch (error) {
//       console.error('Error adding employee:', error);
//       setMessage({
//         type: 'danger',
//         text:
//           error.response?.data?.message ||
//           'An error occurred while adding the employee.'
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className='container d-flex justify-content-center mt-3 '>
//       <Card className='p-4 shadow-sm w-100' >
//         <h2 className='text-center mb-4'>Add New Employee</h2>
//         {message.text && <Alert variant={message.type}>{message.text}</Alert>}
//         <Form onSubmit={handleSubmit}>
//           <Row>
//             <Col md={6}>
//               <Form.Group className='mb-3' controlId='formName'>
//                 <Form.Label>Name</Form.Label>
//                 <Form.Control
//                   type='text'
//                   name='name'
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className='mb-3' controlId='formManager'>
//                 <Form.Label>Manager</Form.Label>
//                 <Form.Control
//                   type='text'
//                   name='manager'
//                   value={formData.manager}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className='mb-3' controlId='formDepartment'>
//                 <Form.Label>Department</Form.Label>
//                 <Form.Control
//                   type='text'
//                   name='department'
//                   value={formData.department}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className='mb-3' controlId='formSalary'>
//                 <Form.Label>Salary</Form.Label>
//                 <Form.Control
//                   type='number'
//                   name='salary'
//                   value={formData.salary}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className='mb-3' controlId='formEmail'>
//                 <Form.Label>Email</Form.Label>
//                 <Form.Control
//                   type='email'
//                   name='email'
//                   value={formData.email}
//                   onChange={handleChange}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className='mb-3' controlId='formPhone'>
//                 <Form.Label>Phone</Form.Label>
//                 <Form.Control
//                   type='tel'
//                   name='phone'
//                   value={formData.phone}
//                   onChange={handleChange}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className='mb-3' controlId='formProfilePic'>
//                 <Form.Label>Profile Picture URL</Form.Label>
//                 <Form.Control
//                   type='text'
//                   name='profile_pic'
//                   value={formData.profile_pic}
//                   onChange={handleChange}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className='mb-3' controlId='formPosition'>
//                 <Form.Label>Position</Form.Label>
//                 <Form.Control
//                   type='text'
//                   name='position'
//                   value={formData.position}
//                   onChange={handleChange}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className='mb-3' controlId='formBirth'>
//                 <Form.Label>Date of Birth</Form.Label>
//                 <Form.Control
//                   type='date'
//                   name='birth'
//                   value={formData.birth}
//                   onChange={handleChange}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className='mb-3' controlId='formStatus'>
//                 <Form.Label>Status</Form.Label>
//                 <Form.Select
//                   as='select'
//                   name='status'
//                   value={formData.status}
//                   onChange={handleChange}
//                 >
//                   <option value='active'>Active</option>
//                   <option value='inactive'>Inactive</option>
//                   <option value='blacklist'>Blacklist</option>
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className='mb-3' controlId='formEducation'>
//                 <Form.Label>Education</Form.Label>
//                 <Form.Control
//                   type='text'
//                   name='education'
//                   value={formData.education}
//                   onChange={handleChange}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className='mb-3' controlId='formJoiningDate'>
//                 <Form.Label>Joining Date</Form.Label>
//                 <Form.Control
//                   type='date'
//                   name='joining_date'
//                   value={formData.joining_date}
//                   onChange={handleChange}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className='mb-3' controlId='formWorkingMode'>
//                 <Form.Label>Working Mode</Form.Label>
//                 <Form.Select
//                   as='select'
//                   name='working_mode'
//                   value={formData.working_mode}
//                   onChange={handleChange}
//                 >
//                   <option value='on-site'>On-site</option>
//                   <option value='remote'>Remote</option>
//                   <option value='hybrid'>Hybrid</option>
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className='mb-3' controlId='formEmpType'>
//                 <Form.Label>Employee Type</Form.Label>
//                 <Form.Select
//                   as='select'
//                   name='emp_type'
//                   value={formData.emp_type}
//                   onChange={handleChange}
//                 >
//                   <option value='full time'>Full Time</option>
//                   <option value='part time'>Part Time</option>
//                   <option value='intern'>Intern</option>
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className='mb-3' controlId='formAddress'>
//                 <Form.Label>Address</Form.Label>
//                 <Form.Control
//                   type='text'
//                   name='address'
//                   value={formData.address}
//                   onChange={handleChange}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className='mb-3' controlId='formGender'>
//                 <Form.Label>Gender</Form.Label>
//                 <Form.Select
//                   as='select'
//                   name='gender'
//                   value={formData.gender}
//                   onChange={handleChange}
//                 >
//                   <option value=''>Select Gender</option>
//                   <option value='male'>Male</option>
//                   <option value='female'>Female</option>
//                   <option value='other'>Other</option>
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//           </Row>

//           <Button
//             variant='primary'
//             type='submit'
//             className='w-100 mt-3'
//             disabled={loading}
//           >
//             {loading ? 'Adding...' : 'Add Employee'}
//           </Button>
//           <Button
//             variant='secondary'
//             onClick={() => navigate('/home')}
//             className='w-100 mt-2'
//           >
//             Cancel
//           </Button>
//         </Form>
//       </Card>
//     </div>
//   );
// };

// export default AddEmployee;



import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Row, Col, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddEmployee = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        manager: '',
        department: '',
        salary: '',
        profile_pic: '',
        email: '',
        phone: '',
        position: '',
        birth: '',
        status: 'active',
        education: '',
        joining: '',
        working_mode: 'on-site',
        emp_type: 'full time',
        address: '',
        gender: '',
        emer_cont_no: '', // New field
        relation: '', // New field
        referred_by: '', // New field
    });

    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

    // Effect for creating a local image preview URL
    useEffect(() => {
        if (profileImage) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result);
            };
            reader.readAsDataURL(profileImage);
        } else {
            setImagePreviewUrl(null);
        }
    }, [profileImage]);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = e => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        let profilePicUrl = '';

        try {
            // Step 1: Upload the image if a file is selected
            if (profileImage) {
                const imageData = new FormData();
                imageData.append('image', profileImage);

                const uploadResponse = await axios.post(
                    'http://localhost:3001/api/upload',
                    imageData
                );
                profilePicUrl = uploadResponse.data.imageUrl;
            }

            // Step 2: Submit employee data with the image URL
            const employeeData = {
                ...formData,
                profile_pic: profilePicUrl,
            };
            
            const response = await axios.post(
                'http://localhost:3001/api/employees',
                employeeData
            );

            setMessage({ type: 'success', text: response.data.message });
            setFormData({
                name: '',
                manager: '',
                department: '',
                salary: '',
                profile_pic: '',
                email: '',
                phone: '',
                position: '',
                birth: '',
                status: 'active',
                education: '',
                joining: '',
                working_mode: 'on-site',
                emp_type: 'full time',
                address: '',
                gender: '',
                emer_cont_no: '',
                relation: '',
                referred_by: '',
            });
            setProfileImage(null); // Clear the image file
            setTimeout(() => navigate('/home'), 2000);
        } catch (error) {
            console.error('Error adding employee:', error);
            setMessage({
                type: 'danger',
                text:
                    error.response?.data?.message ||
                    'An error occurred while adding the employee.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container d-flex justify-content-center mt-3'>
            <Card className='p-4 shadow-sm w-100'>
                <h2 className='text-center mb-4'>Add New Employee</h2>
                {message.text && <Alert variant={message.type}>{message.text}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className='mb-3' controlId='formName'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type='text'
                                    name='name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className='mb-3' controlId='formManager'>
                                <Form.Label>Manager</Form.Label>
                                <Form.Control
                                    type='text'
                                    name='manager'
                                    value={formData.manager}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className='mb-3' controlId='formDepartment'>
                                <Form.Label>Department</Form.Label>
                                <Form.Select
                                    as='select'
                                    name='department'
                                    value={formData.department}
                                    onChange={handleChange}
                                    required
                                >
                                <option value=''>Select Department</option>
                                <option value='it'>IT</option>
                                <option value='testing'>Testing</option>
                                <option value='development'>Development</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className='mb-3' controlId='formSalary'>
                                <Form.Label>Salary</Form.Label>
                                <Form.Control
                                    type='number'
                                    name='salary'
                                    value={formData.salary}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className='mb-3' controlId='formEmail'>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type='email'
                                    name='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className='mb-3' controlId='formPhone'>
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                    type='tel'
                                    name='phone'
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>

                        {/* Profile Picture Upload Field */}
                        <Col md={6}>
                            <Form.Group className='mb-3' controlId='formProfilePic'>
                                <Form.Label>Profile Picture</Form.Label>
                                <Form.Control
                                    type='file'
                                    accept='image/*'
                                    onChange={handleImageChange}
                                />
                                {imagePreviewUrl && (
                                    <div className='mt-2 text-center'>
                                        <Image src={imagePreviewUrl} alt='Preview' roundedCircle fluid style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                    </div>
                                )}
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className='mb-3' controlId='formPosition'>
                                <Form.Label>Position</Form.Label>
                                <Form.Control
                                    type='text'
                                    name='position'
                                    value={formData.position}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className='mb-3' controlId='formBirth'>
                                <Form.Label>Date of Birth</Form.Label>
                                <Form.Control
                                    type='date'
                                    name='birth'
                                    value={formData.birth}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className='mb-3' controlId='formStatus'>
                                <Form.Label>Status</Form.Label>
                                <Form.Select
                                    as='select'
                                    name='status'
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value=''>Select Status</option>
                                    <option value='active'>Active</option>
                                    <option value='inactive'>Inactive</option>
                                    <option value='blacklist'>Blacklist</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className='mb-3' controlId='formEducation'>
                                <Form.Label>Education</Form.Label>
                                <Form.Control
                                    type='text'
                                    name='education'
                                    value={formData.education}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className='mb-3' controlId='formJoiningDate'>
                                <Form.Label>Joining Date</Form.Label>
                                <Form.Control
                                    type='date'
                                    name='joining'
                                    value={formData.joining}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className='mb-3' controlId='formWorkingMode'>
                                <Form.Label>Working Mode</Form.Label>
                                <Form.Select
                                    as='select'
                                    name='working_mode'
                                    value={formData.working_mode}
                                    onChange={handleChange}
                                >
                                    <option value=''>Select Mode</option>
                                    <option value='on-site'>On-site</option>
                                    <option value='remote'>Remote</option>
                                    <option value='hybrid'>Hybrid</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className='mb-3' controlId='formEmpType'>
                                <Form.Label>Employee Type</Form.Label>
                                <Form.Select
                                    as='select'
                                    name='emp_type'
                                    value={formData.emp_type}
                                    onChange={handleChange}
                                >
                                    <option value=''>Select Type</option>
                                    <option value='full time'>Full Time</option>
                                    <option value='part time'>Part Time</option>
                                    <option value='intern'>Intern</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className='mb-3' controlId='formAddress'>
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    type='text'
                                    name='address'
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className='mb-3' controlId='formGender'>
                                <Form.Label>Gender</Form.Label>
                                <Form.Select
                                    as='select'
                                    name='gender'
                                    value={formData.gender}
                                    onChange={handleChange}
                                >
                                    <option value=''>Select Gender</option>
                                    <option value='male'>Male</option>
                                    <option value='female'>Female</option>
                                    <option value='other'>Other</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        {/* New Fields */}
                        <Col md={6}>
                            <Form.Group className='mb-3' controlId='formEmerContNo'>
                                <Form.Label>Emergency Contact Number</Form.Label>
                                <Form.Control
                                    type='tel'
                                    name='emer_cont_no'
                                    value={formData.emer_cont_no}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className='mb-3' controlId='formRelation'>
                                <Form.Label>Relation with Emergency Contact</Form.Label>
                                <Form.Control
                                    type='text'
                                    name='relation'
                                    value={formData.relation}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className='mb-3' controlId='formReferredBy'>
                                <Form.Label>Referred By</Form.Label>
                                <Form.Control
                                    type='text'
                                    name='referred_by'
                                    value={formData.referred_by}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Button
                        variant='primary'
                        type='submit'
                        className='w-100 mt-3'
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Add Employee'}
                    </Button>
                    <Button
                        variant='secondary'
                        onClick={() => navigate('/home')}
                        className='w-100 mt-2'
                    >
                        Cancel
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default AddEmployee;