import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Form, Button, Card, Alert, Row, Col, Image } from 'react-bootstrap'
// 💡 FIX 1: Import the configured API instance instead of generic axios
import api from './axiosconfig' 
import { formatDate } from '../utils/formatDate'

// 🗑️ FIX 2: Remove API_BASE_URL as it is already set in axiosconfig
// const API_BASE_URL = 'http://localhost:3001/api' 

const EditEmployee = () => {
  const navigate = useNavigate()
  const { id } = useParams() 
  
  const [employee, setEmployee] = useState(null) 
  const [imageError, setImageError] = useState('')
  
  // State for form data
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
    joining: '',
    leaving: '',
    working_mode: '',
    emp_type: '',
    address: '',
    gender: '',
    emer_cont_no: '',
    relation: '',
    referred_by: ''
  })

  const [message, setMessage] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null)

  // 1. Image Preview useEffect (Unchanged)
  useEffect(() => {
    if (profileImage) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result)
      }
      reader.readAsDataURL(profileImage)
    } else if (employee && !formData.profile_pic) {
        setImagePreviewUrl(null)
    }
  }, [profileImage, employee, formData.profile_pic])

  // 2. Fetch Employee Data useEffect (मुख्य दुरुस्ती - GET)
  useEffect(() => {
    if (!id) {
      navigate('/home')
      return
    }

    const fetchEmployee = async () => {
      setLoading(true)
      try {
        // 🚀 FIX 3: Use 'api.get' with relative path
        const response = await api.get(
          `/employees/${id}` // Relative URL
        )
        const emp = response.data
        
        setEmployee(emp)

        // Form Data Populate करा... (Unchanged)
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
          leaving: emp.leaving ? emp.leaving.split('T')[0] : '',
          working_mode: emp.working_mode?.toLowerCase() || '',
          emp_type: emp.emp_type?.toLowerCase().replace('-', ' ') || '',
          address: emp.address || '',
          gender: emp.gender?.toLowerCase() || '',
          emer_cont_no: emp.emer_cont_no || '',
          relation: emp.relation || '',
          referred_by: emp.referred_by || ''
        })
        
        if(emp.profile_pic) {
            setImagePreviewUrl(emp.profile_pic)
        }

      } catch (error) {
        console.error('Error fetching employee details:', error)
        // 403/401 error will be handled by the interceptor
        setMessage({
          type: 'danger',
          text: 'कर्मचारी डेटा लोड करण्यात त्रुटी आली. मुख्य पृष्ठावर Redirect करत आहे.'
        })
        setTimeout(() => navigate('/home'), 3000)
      } finally {
        setLoading(false)
      }
    }

    fetchEmployee()
  }, [id, navigate]) 

  const handleChange = e => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleImageChange = e => {
    const file = e.target.files[0]
    if (file) {
      setProfileImage(file)
    } else {
        setProfileImage(null) 
    }
  }

  // 3. Update Submission Logic (handleSubmit)
  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    if (!employee || !id) {
        setMessage({ type: 'danger', text: 'कर्मचारी डेटा लोड होत नाहीये. कृपया प्रतीक्षा करा.' })
        setLoading(false)
        return
    }

    // Client-side validation: (Unchanged)
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

    const isValid = requiredFields.every(
      field => formData[field] && formData[field].toString().trim() !== ''
    )

    if (!isValid) {
      setMessage({
        type: 'danger',
        text: 'कृपया सर्व अनिवार्य फील्ड्स (*) भरा.'
      })
      setLoading(false)
      return
    }

    if (imageError) {
      setLoading(false)
      return
    }

    let profilePicUrl = formData.profile_pic 

    try {
      // Step 1: Upload new image if a new file is selected
      if (profileImage) {
        const imageData = new FormData()
        imageData.append('image', profileImage)
        
        // 🚀 FIX 4: Use 'api.post' for image upload
        const uploadResponse = await api.post(
          `/upload`, // Relative URL
          imageData
        )
        profilePicUrl = uploadResponse.data.imageUrl
      }

      // Step 2: Submit updated employee data
      const employeeData = {
        ...formData,
        profile_pic: profilePicUrl
      }

      // 🚀 FIX 5: Use 'api.put' for updating employee details
      const response = await api.put(
        `/employees/${id}`, // Relative URL
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
          'कर्मचारी अपडेट करताना त्रुटी आली.'
      })
    } finally {
      setLoading(false)
    }
  }

  // ... (Rest of the component remains the same)

  if (loading && !employee) {
    return (
      <div className='container d-flex justify-content-center mt-5'>
        <Alert variant='info'>Loading Employee Data...</Alert>
      </div>
    )
  }

  if (!employee) {
    return null 
  }

  return (
    <div className='container d-flex justify-content-center mt-5'>
      <Card className='p-4 shadow-sm w-100'>
        <h2 className='text-center mb-4'>Edit Employee: {employee.name}</h2>
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
                        setProfileImage(null)
                        return
                      } else {
                        setImageError('')
                        handleImageChange(e)
                      }
                    } else {
                      setImageError('')
                      handleImageChange(e)
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
                  value={formatDate(formData.birth)}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='formLeaving'>
                <Form.Label>Leaving Date</Form.Label>
                <Form.Control
                  type='date'
                  name='leaving'
                  value={formatDate(formData.leaving)}
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
                  name='joining'
                  value={formatDate(formData.joining)}
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