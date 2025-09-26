import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const ImportModal = ({ show, handleClose }) => {
const [file, setFile] = useState(null);
const [message, setMessage] = useState({ type: '', text: '' });
const [loading, setLoading] = useState(false);

const handleFileChange = (e) => {
    setFile(e.target.files[0]);
};

const handleImport = async () => {
    if (!file) {
        setMessage({ type: 'warning', text: 'Please select an Excel file.' });
        return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });
    
    const formData = new FormData();
    formData.append('employeesFile', file);

    try {
        const response = await axios.post('http://localhost:3001/api/employees/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        setMessage({ type: 'success', text: response.data.message });
    } catch (error) {
        console.error('Import failed:', error);
        setMessage({ type: 'danger', text: error.response?.data?.message || 'An error occurred during import.' });
    } finally {
        setLoading(false);
        setFile(null);
    }
};

return (
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Import Employees from Excel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {message.text && <Alert variant={message.type}>{message.text}</Alert>}
            <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Select an Excel file (.xlsx)</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} accept=".xlsx" />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={handleImport} disabled={loading || !file}>
                {loading ? 'Importing...' : 'Import'}
            </Button>
        </Modal.Footer>
    </Modal>
);

};

export default ImportModal;