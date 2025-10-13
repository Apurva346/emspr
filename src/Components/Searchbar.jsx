import React from 'react'
import { Form, InputGroup, Button } from 'react-bootstrap';
import "@fortawesome/fontawesome-free/css/all.min.css";

const Searchbar = ({ onSearch, onClear, value }) => {
  return (
    <InputGroup className="mb-2">
            <InputGroup.Text>
                <i className="fas fa-search"></i>
            </InputGroup.Text>
            <Form.Control
                type="text"
                placeholder="Search by ID, name, manager, department or salary"
                value={value}
                onChange={(e) => onSearch(e.target.value)}
            />
            <Button className="py-2" variant="dark" onClick={onClear}>
                <i className="fa-solid fa-eraser me-2"></i>Clear
            </Button>
        </InputGroup>
  )
}

export default Searchbar
