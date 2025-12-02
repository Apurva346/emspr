// import React, { useState, useEffect } from 'react';
// import { BrowserRouter, Route, Routes, Outlet, useNavigate } from 'react-router-dom';
// import { Container } from 'react-bootstrap'; // Layout साठी कंटेनर
// import Login from './Components/Login';
// import Home from './Components/Home';
// import EditEmployee from './Components/EditEmployee';
// import AddEmployee from './Components/AddEmployee';
// import api from './Components/axiosconfig';
// // import EmployeeDetails from './Components/EmployeeDetails';
// import Header from './Components/Header'; // Header Component import केला

// // --- MainLayout Component (Protected Routes साठी Wrapper) ---
// const MainLayout = ({ totalEmployees, setTotalEmployees }) => {
//     const navigate = useNavigate();
    
//     // एकूण कर्मचाऱ्यांची संख्या फेच करणारा फंक्शन
//     const fetchTotalEmployees = async () => {
//         try {
//             // फिल्टर/सर्चशिवाय unfiltered total count मिळवण्यासाठी API कॉल
//             const response = await api.get('/employees', {
//                 params: {
//                     filter: 'All', 
//                     search: ''    
//                 }
//             });
//             setTotalEmployees(response.data.length); 
//         } catch (error) {
//             console.error('❌ Error fetching total employee count:', error);
//             setTotalEmployees(0);
//         }
//     };
    
//     // Component Mount झाल्यावर totalEmployees फेच करा
//     useEffect(() => {
//         fetchTotalEmployees();
//     }, []);

//     // Logout Function (जी Header ला पास केली जाईल)
//     const handleLogout = () => {
//         try {
//             localStorage.removeItem('token');
//             navigate('/'); 
//         } catch (error) {
//             console.error('❌ Logout failed:', error);
//         }
//     };

//     return (
//         <Container fluid className='p-0'>
//             {/* Header इथे रेंडर करा, तो आता प्रत्येक Nested Route वर दिसेल */}
//             <Header 
//                 totalEmployees={totalEmployees} 
//                 onLogout={handleLogout}           
//             />
            
//             {/* Outlet हे सध्याचा Nested Route Component रेंडर करेल. 
//                 refreshTotalCount फंक्शन Context म्हणून पास केला आहे. */}
//             <div className="main-content p-3">
//                  <Outlet context={{ refreshTotalCount: fetchTotalEmployees }}/> 
//             </div>
//         </Container>
//     );
// };
// // ---------------------------------------------------------------


// const App = () => {
//     // totalEmployees स्टेट App component मध्ये ठेवला आहे
//     const [totalEmployees, setTotalEmployees] = useState(0); 
//     const [loading, setLoading] = useState(false);

//     const onDetails = () => {
//         console.log('Details button clicked');
//     };
    
//     const onShowAddModal = () => {
//         console.log('Add employee modal shown');
//     };
    
//     return (
//         <div className='bg-light min-vh-100'>
//             <BrowserRouter>
//                 <Routes>
//                     {/* १. Login Route (Layout च्या बाहेर - Header दिसणार नाही) */}
//                     <Route path='/' element={<Login />} />
                    
//                     {/* २. MainLayout (Protected Routes साठी Parent Route) */}
//                     <Route 
//                         element={<MainLayout 
//                                     totalEmployees={totalEmployees} 
//                                     setTotalEmployees={setTotalEmployees} 
//                                 />}
//                     >
                        
//                         {/* Home Route */}
//                         <Route 
//                             path='/home' 
//                             element={
//                                 <Home 
//                                     loading={loading} 
//                                     onDetails={onDetails}
//                                     onShowAddModal={onShowAddModal}
//                                 />
//                             } 
//                         />
                        
//                         {/* Add Employee Route */}
//                         <Route path='/add-employee' element={<AddEmployee />} />
                        
//                         {/* Edit Employee Route */}
//                         <Route path='/edit-employee/:id' element={<EditEmployee />} />
                        
//                         {/* Employee Details Route */}
//                         {/* <Route path='/employee-details/:id' element={<EmployeeDetails />} /> */}
                        
//                     </Route>
                    
//                 </Routes>
//             </BrowserRouter>
//         </div>
//     );
// };

// export default App;

import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';

import Login from './Components/Login';
import Home from './Components/Home';
import Header from './Components/Header';

const App = () => {
    const [totalEmployees, setTotalEmployees] = useState(0);

    return (
        <div className='bg-light min-vh-100'>
            <BrowserRouter>
                <Routes>

                    {/* LOGIN — Header hidden */}
                    <Route path="/" element={<Login />} />

                    {/* HOME — Header visible */}
                    <Route
                        path="/home"
                        element={
                            <>
                                <Header
                                    totalEmployees={totalEmployees}
                                    onLogout={() => {
                                        localStorage.removeItem('token');
                                        window.location.href = "/";
                                    }}
                                />

                                <Home
                                    totalEmployees={totalEmployees}
                                    setTotalEmployees={setTotalEmployees}
                                />
                            </>
                        }
                    />

                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
