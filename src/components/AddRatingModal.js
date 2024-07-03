import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const AddRatingModal = ({ show, handleClose, schoolId, addReview }) => {
    const [formData, setFormData] = useState({
        rating: '',
        comment: '',
        research: '',
        socialLife: '',
        academicSupport: '',
        classSize: '',
        location: ''
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
            const response = await axios.post(`http://localhost:5000/schools/${schoolId}/ratings`, formData);
            console.log('Added rating response:', response.data);
            addReview(schoolId, response.data);
            setFormData({
                rating: '',
                comment: '',
                research: '',
                socialLife: '',
                academicSupport: '',
                classSize: '',
                location: ''
            });
            handleClose(); // Close the modal after successful submission
        } catch (error) {
            console.error('There was an error adding the rating!', error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Rating</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formRating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                            type="number"
                            name="rating"
                            value={formData.rating}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formComment">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                            type="text"
                            name="comment"
                            value={formData.comment}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formResearch">
                        <Form.Label>Research</Form.Label>
                        <Form.Control
                            type="number"
                            name="research"
                            value={formData.research}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formSocialLife">
                        <Form.Label>Social Life</Form.Label>
                        <Form.Control
                            type="number"
                            name="socialLife"
                            value={formData.socialLife}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formAcademicSupport">
                        <Form.Label>Academic Support</Form.Label>
                        <Form.Control
                            type="number"
                            name="academicSupport"
                            value={formData.academicSupport}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formClassSize">
                        <Form.Label>Class Size</Form.Label>
                        <Form.Control
                            type="number"
                            name="classSize"
                            value={formData.classSize}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formLocation">
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                            type="number"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Add Rating
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddRatingModal;