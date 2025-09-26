import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import Home from './Components/Home';
import EditEmployee from './Components/EditEmployee';
import AddEmployee from './Components/AddEmployee';
import axios from 'axios';
import EmployeeDetails from './Components/EmployeeDetails';

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const onDetails = () => {
    console.log('Details button clicked');
  };
  
  const onShowAddModal = () => {
    console.log('Add employee modal shown');
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/api/home');
      setEmployees(response.data);
      console.log('Fetched data:', response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);



  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route
            path='/home'
            element={
              <Home
                employees={employees}
                loading={loading}
                fetchEmployees={fetchEmployees}
                onDetails={onDetails}
                onShowAddModal={onShowAddModal}
              />
            }
          />
          <Route path='/add-employee' element={<AddEmployee />} />
          <Route path='/edit-employee' element={<EditEmployee />} />
          <Route path='/employee-details' element={<EmployeeDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
