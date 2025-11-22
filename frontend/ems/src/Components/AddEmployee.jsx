import React, { useState, useEffect } from 'react'
import { Form, Button, Card, Alert, Row, Col, Image } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from './axiosconfig'
import './AddEmployee.css';


const AddEmployee = () => {
    const [imageError, setImageError] = useState("");
  const navigate = useNavigate()
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
    status: '',
    education: '',
    joining: '',
    leaving:'',
    working_mode: '',
    emp_type: '',
    address: '',
    gender: '',
    emer_cont_no: '', // New field
    relation: '', // New field
    referred_by: '' // New field
  })

  const [message, setMessage] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null)

  // const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  // Effect for creating a local image preview URL
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
    if (file) {
      setProfileImage(file)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    let profilePicUrl = ''

    try {
      // Step 1: Upload the image if a file is selected
      if (profileImage) {
        const imageData = new FormData()
        imageData.append('image', profileImage)

        const uploadResponse = await axios.post(
          '/upload',
          imageData
        )
        profilePicUrl = uploadResponse.data.imageUrl
      }

      // Step 2: Submit employee data with the image URL
      const employeeData = {
        ...formData,
        profile_pic: profilePicUrl,
        leaving: formData.leaving === '' ? null : formData.leaving
      }

      const response = await axios.post(
        '/employees',
        employeeData
      )

      setMessage({ type: 'success', text: response.data.message })
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
        leaving:''
      })
      setProfileImage(null) // Clear the image file
      setTimeout(() => navigate('/home'), 2000)
    } catch (error) {
      console.error('Error adding employee:', error)
      setMessage({
        type: 'danger',
        text:
          error.response?.data?.message ||
          'An error occurred while adding the employee.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container d-flex justify-content-center mt-3'>
      <Card className='p-4 shadow-sm w-100'>
        <h2 className='text-center mb-4'>Add New Employee</h2>
        {message.text && <Alert variant={message.type}>{message.text}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='formName'>
                <Form.Label>
                  Name<span style={{ color: 'red', marginLeft: '5px' }}>*</span>
                </Form.Label>
                <Form.Control
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                  minLength={3}
                  maxLength={30}
                  isInvalid={formData.name.trim() === ""}       // 🔴 red when empty
                    isValid={formData.name.trim() !== ""}         // ✅ green when filled
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='formManager'>
                <Form.Label>Manager<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Form.Label>
                <Form.Control
                  type='text'
                  name='manager'
                  value={formData.manager}
                  onChange={handleChange}
                  required isInvalid={formData.manager.trim() === ""}       // 🔴 red when empty
                  isValid={formData.manager.trim() !== ""}         // ✅ green when filled
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='formDepartment'>
                <Form.Label>
                  Department
                  <span style={{ color: 'red', marginLeft: '5px' }}>*</span>
                </Form.Label>
                <Form.Select
                  as='select'
                  name='department'
                  value={formData.department}
                  onChange={handleChange}
                  required
                  isInvalid={formData.department === ""}   // 🔴 Red when not selected
                isValid={formData.department !== ""}     // ✅ Green when selected
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
              <Form.Group className='mb-3' controlId='formSalary'>
                <Form.Label>
                  Salary
                  <span style={{ color: 'red', marginLeft: '5px' }}>*</span>
                </Form.Label>
                <Form.Control
                  type='number'
                  name='salary'
                  value={formData.salary}
                  onChange={handleChange}
                  required min={1000} max={200000}
                  isInvalid={formData.salary === ""}     // 🔴 red when empty
                    isValid={formData.salary !== ""}       // ✅ green when filled                
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='formEmail'>
                <Form.Label>Email<span style={{ color: 'red', marginLeft: '5px' }}>*</span>
                </Form.Label>
                <Form.Control
                  type='email' name='email' value={formData.email} onChange={handleChange}
                  required
                  isInvalid={formData.email.trim() === ""}       // 🔴 red when empty
                    isValid={formData.email.trim() !== ""}         // ✅ green when filled
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='formPhone'>
                <Form.Label>
                  Phone
                  <span style={{ color: 'red', marginLeft: '5px' }}>*</span>
                </Form.Label>
                <Form.Control
                  type='tel' name='phone' value={formData.phone} onChange={handleChange}
                  required pattern='[0-9]{10}' title='Enter 10 digit number'
                  isInvalid={formData.phone.trim() === ""}       // 🔴 red when empty
                    isValid={formData.phone.trim() !== ""}         // ✅ green when filled
                />
              </Form.Group>
            </Col>

            {/* Profile Picture Upload Field */}
            
            <Col md={6}>
              <Form.Group className='mb-3' controlId='formProfilePic'>
                <Form.Label>Profile Picture</Form.Label>
                <Form.Control
                  type='file'
                  accept='.jpg,.jpeg,.png'
                  onChange={e => {
                    const file = e.target.files[0]

                    if (file) {
                      const maxSize = 100 * 1024 // 50 KB
                      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png' ]

                      // error message variable
                      let errorMsg = ''

                      if (file.size > maxSize) {
                        errorMsg = 'Image size should not exceed 100 KB'
                      } else if (!allowedTypes.includes(file.type)) {
                        errorMsg = 'Only JPG or PNG images are allowed'
                      }

                      // show error message
                      if (errorMsg) {
                        setImageError(errorMsg) // React state to hold error
                        e.target.value = '' // clear invalid file
                        return
                      } else {
                        setImageError('') // clear error if valid
                        handleImageChange(e) // your existing function
                      }
                    }
                  }}
                />

                {/* 🔹 Error message below input */}
                {imageError && (
                  <small style={{ color: 'red' }}>{imageError}</small>
                )}

                {/* 🔹 Image preview */}
                {imagePreviewUrl && (
                  <div className='mt-2 text-center'>
                    <Image
                      src={imagePreviewUrl}
                      alt='Preview'
                      roundedCircle
                      fluid
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className='mb-3' controlId='formPosition'>
                <Form.Label>
                  Position
                  <span style={{ color: 'red', marginLeft: '5px' }}>*</span>
                </Form.Label>
                <Form.Control
                  type='text'
                  name='position'
                  value={formData.position}
                  onChange={handleChange}
                  required
                  isInvalid={formData.position.trim() === ""}       // 🔴 red when empty
                    isValid={formData.position.trim() !== ""}         // ✅ green when filled
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
                  max={new Date().toISOString().split('T')[0]} // future date not allowed
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='formStatus'>
                <Form.Label>
                  Status
                  <span style={{ color: 'red', marginLeft: '5px' }}>*</span>
                </Form.Label>
                <Form.Select
                  as='select'
                  name='status'
                  value={formData.status}
                  onChange={handleChange} required
                   isInvalid={formData.status === ""}   // 🔴 Red when not selected
                    isValid={formData.status !== ""}     // ✅ Green when selected
                >
                  <option value=''>Select Status</option>
                  <option value='Active'>Active</option>
                  <option value='Inactive'>Inactive</option>
                  <option value='Blacklist'>Blacklist</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='formEducation'>
                <Form.Label>
                  Education
                  <span style={{ color: 'red', marginLeft: '5px' }}>*</span>
                </Form.Label>
                <Form.Control
                  type='text'
                  name='education'
                  value={formData.education}
                  onChange={handleChange}
                  required
                  isInvalid={formData.education.trim() === ""}       // 🔴 red when empty
                    isValid={formData.education.trim() !== ""}         // ✅ green when filled
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
              <Form.Group className='mb-3' controlId='formleavingdate'>
                <Form.Label>Leaving Date</Form.Label>
                <Form.Control
                  type='date'
                  name='leaving'
                  value={formData.leaving}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='formWorkingMode'>
                <Form.Label>
                  Working Mode
                  <span style={{ color: 'red', marginLeft: '5px' }}>*</span>
                </Form.Label>
                <Form.Select
                  as='select'
                  name='working_mode'
                  value={formData.working_mode}
                  onChange={handleChange}
                  required
                   isInvalid={formData.working_mode === ""}   // 🔴 Red when not selected
                    isValid={formData.working_mode !== ""}     // ✅ Green when selected
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
                <Form.Label>
                  Employee Type
                  <span style={{ color: 'red', marginLeft: '5px' }}>*</span>
                </Form.Label>
                <Form.Select
                  as='select'
                  name='emp_type'
                  value={formData.emp_type}
                  onChange={handleChange}
                  required
                   isInvalid={formData.emp_type === ""}   // 🔴 Red when not selected
                    isValid={formData.emp_type !== ""}     // ✅ Green when selected
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
                <Form.Label>
                  Gender
                  <span style={{ color: 'red', marginLeft: '5px' }}>*</span>
                </Form.Label>
                <Form.Select
                  as='select'
                  name='gender'
                  value={formData.gender}
                  onChange={handleChange}
                  required
                   isInvalid={formData.gender === ""}   // 🔴 Red when not selected
                    isValid={formData.gender !== ""}     // ✅ Green when selected
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
  )
}

export default AddEmployee
