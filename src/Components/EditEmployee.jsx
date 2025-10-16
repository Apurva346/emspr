import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Card, Alert, Row, Col, Image } from 'react-bootstrap'
import axios from 'axios'

const EditEmployee = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [imageError, setImageError] = useState('')
  const employee = location.state?.employee

  // State for form data, image file, and preview URL
  const [formData, setFormData] = useState({
    name: '',
    manager: '',
    department: '',
    salary: '',
    email: '',
    phone: '',
    profile_pic: '',
    position: '',
    birth: '',
    status: '',
    education: '',
    joining: '', // Corrected field name
    working_mode: '',
    emp_type: '',
    address: '',
    gender: '',
    // New fields
    emer_cont_no: '',
    relation: '',
    referred_by: ''
  })

  const [message, setMessage] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null)

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

  // Populate form with existing employee data on component mount
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        manager: employee.manager || '',
        department: employee.department || '',
        salary: employee.salary || '',
        email: employee.email || '',
        phone: employee.phone || '',
        profile_pic: employee.profile_pic || '',
        position: employee.position || '',
        birth: employee.birth ? employee.birth.split('T')[0] : '',
        status: employee.status?.toLowerCase() || '',
        education: employee.education || '',
        // Corrected joining field name and formatting
        joining: employee.joining ? employee.joining.split('T')[0] : '',
        working_mode: employee.working_mode?.toLowerCase() || '',
        emp_type: employee.emp_type
          ? employee.emp_type.toLowerCase().replace('-', ' ')
          : '',
        address: employee.address || '',
        gender: employee.gender?.toLowerCase() || '',
        emer_cont_no: employee.emer_cont_no || '',
        relation: employee.relation || '',
        referred_by: employee.referred_by || ''
      })
      // Set initial image preview URL from existing profile pic
      setImagePreviewUrl(employee.profile_pic)
    } else {
      navigate('/home')
    }
  }, [employee, navigate])

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

  // const handleSubmit = async e => {
  //   e.preventDefault()
  //   setLoading(true)
  //   setMessage({ type: '', text: '' })

  //   let profilePicUrl = formData.profile_pic // Default to existing URL

  //   try {
  //     // Step 1: Upload new image if a new file is selected
  //     if (profileImage) {
  //       const imageData = new FormData()
  //       imageData.append('image', profileImage)
  //       const uploadResponse = await axios.post(
  //         'http://localhost:3001/api/upload',
  //         imageData
  //       )
  //       profilePicUrl = uploadResponse.data.imageUrl
  //     }

  //     // Step 2: Submit updated employee data
  //     const employeeData = {
  //       ...formData,
  //       profile_pic: profilePicUrl
  //     }

  //     const response = await axios.put(
  //       `http://localhost:3001/api/employees/${employee.id}`,
  //       employeeData
  //     )

  //     setMessage({ type: 'success', text: response.data.message })
  //     setTimeout(() => navigate('/home'), 2000)
  //   } catch (error) {
  //     console.error('Error updating employee:', error)
  //     setMessage({
  //       type: 'danger',
  //       text:
  //         error.response?.data?.message ||
  //         'An error occurred while updating the employee.'
  //     })
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // ... (rest of the component imports and state definitions)

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    // 🎯 Client-side validation: CHECK ONLY MANDATORY FIELDS
    const requiredFields = [
      'name',
      'department',
      'salary',
      'email',
      'phone',
      'position',
      'status',
      'education',
      'working_mode',
      'emp_type',
      'gender'
    ]

    // Check if ALL mandatory fields have a non-empty/non-whitespace value
    const isValid = requiredFields.every(
      field => formData[field] && formData[field].toString().trim() !== ''
    )

    if (!isValid) {
      setMessage({
        type: 'danger',
        text: 'Please fill out all mandatory fields (*).'
      })
      setLoading(false)
      // If mandatory fields are missing, stop the submission
      return
    }

    // Check for Image Error (if any, although HTML validation usually prevents this)
    if (imageError) {
      setLoading(false)
      return // Stop submission if there's an image error
    }

    let profilePicUrl = formData.profile_pic // Default to existing URL

    try {
      // Step 1: Upload new image if a new file is selected
      if (profileImage) {
        const imageData = new FormData()
        imageData.append('image', profileImage)
        const uploadResponse = await axios.post(
          'http://localhost:3001/api/upload',
          imageData
        )
        profilePicUrl = uploadResponse.data.imageUrl
      }

      // Step 2: Submit updated employee data (includes optional fields with their current or default values)
      const employeeData = {
        ...formData,
        profile_pic: profilePicUrl
      }

      const response = await axios.put(
        // Ensure employee.id exists before calling PUT
        `http://localhost:3001/api/employees/${employee.id}`,
        employeeData
      )

      setMessage({ type: 'success', text: response.data.message })
      setTimeout(() => navigate('/home'), 2000)
    } catch (error) {
      console.error('Error updating employee:', error)
      setMessage({
        type: 'danger',
        text:
          error.response?.data?.message ||
          'An error occurred while updating the employee.'
      })
    } finally {
      setLoading(false)
    }
  }

  if (!employee) {
    return null
  }

  useEffect(() => {
    const fetchFullEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/employees/${employee.id}`
        )
        const emp = response.data

        setFormData({
          name: emp.name || '',
          manager: emp.manager || '',
          department: emp.department || '',
          salary: emp.salary || '',
          email: emp.email || '',
          phone: emp.phone || '',
          profile_pic: emp.profile_pic || '',
          position: emp.position || '',
          birth: emp.birth ? emp.birth.split('T')[0] : '',
          status: emp.status?.toLowerCase() || '',
          education: emp.education || '',
          joining: emp.joining ? emp.joining.split('T')[0] : '',
          working_mode: emp.working_mode?.toLowerCase() || '',
          emp_type: emp.emp_type?.toLowerCase() || '',
          address: emp.address || '',
          gender: emp.gender?.toLowerCase() || '',
          emer_cont_no: emp.emer_cont_no || '',
          relation: emp.relation || '',
          referred_by: emp.referred_by || ''
        })
        setImagePreviewUrl(emp.profile_pic)
      } catch (error) {
        console.error('Error fetching employee details:', error)
      }
    }

    if (employee && employee.id) {
      fetchFullEmployee()
    } else {
      navigate('/home')
    }
  }, [employee, navigate])

  return (
    <div className='container d-flex justify-content-center mt-5'>
      <Card className='p-4 shadow-sm w-100'>
        <h2 className='text-center mb-4'>Edit Employee</h2>
        {message.text && <Alert variant={message.type}>{message.text}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Row>
            {/* All form fields go here... */}
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
                  isInvalid={formData.name === ''}
                  isValid={formData.name !== ''}
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
                />
              </Form.Group>
            </Col>
            {/* ... other fields */}
            <Col md={6}>
              <Form.Group className='mb-3' controlId='formDepartment'>
                <Form.Label>
                  Department
                  <span style={{ color: 'red', marginLeft: '5px' }}>*</span>
                </Form.Label>
                <Form.Control
                  type='text'
                  name='department'
                  value={formData.department}
                  onChange={handleChange}
                  required
                  isInvalid={formData.department === ''}
                  isValid={formData.department !== ''}
                />
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
                  required
                  isInvalid={formData.salary === ''}
                  isValid={formData.salary !== ''}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='formEmail'>
                <Form.Label>
                  Email
                  <span style={{ color: 'red', marginLeft: '5px' }}>*</span>
                </Form.Label>
                <Form.Control
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                  isInvalid={formData.email === ''}
                  isValid={formData.email !== ''}
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
                  type='tel'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  isInvalid={formData.phone === ''}
                  isValid={formData.phone !== ''}
                />
              </Form.Group>
            </Col>
            {/* <Col md={6}>
              <Form.Group className='mb-3' controlId='formProfilePic'>
                <Form.Label>Profile Picture</Form.Label>
                <Form.Control
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                />
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
            </Col> */}
            <Col md={6}>
              <Form.Group className='mb-3' controlId='formProfilePic'>
                <Form.Label>Profile Picture</Form.Label>
                <Form.Control
                  type='file'
                  accept='.jpg,.jpeg,.png'
                  onChange={e => {
                    const file = e.target.files[0]
                    if (file) {
                      const maxSize = 100 * 1024 // 100 KB
                      const allowedTypes = [
                        'image/jpeg',
                        'image/jpg',
                        'image/png'
                      ]
                      let errorMsg = ''

                      if (file.size > maxSize) {
                        errorMsg = 'Image size should not exceed 100 KB'
                      } else if (!allowedTypes.includes(file.type)) {
                        errorMsg = 'Only JPG, JPEG, or PNG images are allowed'
                      }

                      if (errorMsg) {
                        setImageError(errorMsg)
                        e.target.value = ''
                        setProfileImage(null) // Clear file state
                        return
                      } else {
                        setImageError('')
                        handleImageChange(e)
                      }
                    } else {
                      setImageError('')
                      handleImageChange(e) // To handle clear file input
                    }
                  }}
                />
                {imageError && (
                  <small style={{ color: 'red' }}>{imageError}</small>
                )}
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
                  isInvalid={formData.position === ''}
                  isValid={formData.position !== ''}
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
                <Form.Label>
                  Status
                  <span style={{ color: 'red', marginLeft: '5px' }}>*</span>
                </Form.Label>
                <Form.Select
                  as='select'
                  name='status'
                  value={formData.status}
                  onChange={handleChange}
                  required
                  isInvalid={formData.status === ''}
                  isValid={formData.status !== ''}
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
                  isInvalid={formData.education === ''}
                  isValid={formData.education !== ''}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='formJoiningDate'>
                <Form.Label>Joining Date</Form.Label>
                <Form.Control
                  type='date'
                  name='joining' // Name corrected to 'joining'
                  value={formData.joining}
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
                  isInvalid={formData.working_mode === ''}
                  isValid={formData.working_mode !== ''}
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
                  isInvalid={formData.emp_type === ''}
                  isValid={formData.emp_type !== ''}
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
                  isInvalid={formData.gender === ''}
                  isValid={formData.gender !== ''}
                >
                  <option value=''>Select Gender</option>
                  <option value='male'>Male</option>
                  <option value='female'>Female</option>
                  <option value='other'>Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
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

          <div className='d-flex justify-content-end mt-4'>
            <Button
              variant='secondary'
              onClick={() => navigate('/home')}
              className='me-2'
            >
              Cancel
            </Button>
            <Button variant='primary' type='submit' disabled={loading}>
              {loading ? 'Updating...' : 'Update Employee'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default EditEmployee
