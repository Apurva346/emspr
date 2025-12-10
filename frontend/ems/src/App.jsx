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
