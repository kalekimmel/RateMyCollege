import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const AddSchoolModal = ({ show, handleClose, addSchool, token }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        website: '',
        price: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/schools', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Added school response:', response.data);
            addSchool(response.data);
            setFormData({
                name: '',
                description: '',
                address: '',
                website: '',
                price: ''
            });
            handleClose(); // Close the modal after successful submission
        } catch (error) {
            console.error('There was an error adding the school!', error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add School</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formAddress">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formWebsite">
                        <Form.Label>Website</Form.Label>
                        <Form.Control
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formPrice">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Add School
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddSchoolModal;