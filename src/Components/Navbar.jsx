import React, { useState, useRef, useEffect } from 'react';
import { Navbar as BootstrapNavbar, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [loadingImport, setLoadingImport] = useState(false);

  useEffect(() => {
    if (file) {
      handleImport();
    }
  }, [file]);

  const handleExportCsv = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/employees/export-csv', { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'employees.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed', error);
      alert('Failed to export employees.');
    }
  };

  const handleExportXlsx = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/employees/export-excel', { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'employees.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed', error);
      alert('Failed to export employees.');
    }
  };

  const handleFileSelect = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    if (!file) {
      alert('Please select a CSV file to import.');
      return;
    }

    setLoadingImport(true);

    const formData = new FormData();
    formData.append('employeesFile', file); // Use the correct field name

    try {
      await axios.post('http://localhost:3001/api/employees/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Employees imported successfully!');
    } catch (error) {
      console.error('Import failed', error);
      alert(error.response?.data?.message || 'Failed to import employees.');
    } finally {
      setLoadingImport(false);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <BootstrapNavbar bg='dark' variant='dark' expand='lg' className='px-3'>
      <Container fluid className='d-flex justify-content-between align-items-center'>
        <BootstrapNavbar.Brand as={Link} to='/home' className='fw-bold fs-4 text-white'>
          Employee Management System
        </BootstrapNavbar.Brand>

        <div className='d-flex gap-2'>
          <Link to='/add-employee' className='btn btn-outline-primary py-2 d-flex align-items-center'>
            <i className='fas fa-user-plus me-2'></i> Add Employee
          </Link>

          <Button variant='outline-success' className='py-2 d-flex align-items-center' onClick={handleExportCsv}>
            <i className='fas fa-file-csv me-2'></i> Export CSV
          </Button>

          <Button variant='outline-info' className='py-2 d-flex align-items-center' onClick={handleExportXlsx}>
            <i className='fas fa-file-excel me-2'></i> Export Excel
          </Button>

          {/* Hidden file input for import */}
          <input
            type='file'
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept='.csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            style={{ display: 'none' }}
          />

          {/* Import CSV button that triggers the file input */}
          <Button
            variant='outline-warning'
            className='py-2 d-flex align-items-center'
            onClick={() => fileInputRef.current.click()}
            disabled={loadingImport}
          >
            {loadingImport ? (
              <>
                <i className='fas fa-spinner fa-spin me-2'></i> Importing...
              </>
            ) : (
              <>
                <i className='fas fa-file-import me-2'></i> Import File
              </>
            )}
          </Button>
        </div>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
