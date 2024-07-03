import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const AddRating = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        rating: 0,
        comment: '',
        research: 0,
        socialLife: 0,
        academicSupport: 0,
        classSize: 0,
        location: 0,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5000/schools/${id}/ratings`, formData);
            navigate('/');
        } catch (error) {
            console.error('There was an error adding the rating!', error);
        }
    };

    return (
        <div className="container">
            <h2>Add Rating</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="rating" className="form-label">Rating (1-5 stars)</label>
                    <input
                        type="number"
                        className="form-control"
                        id="rating"
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        min="1"
                        max="5"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="comment" className="form-label">Comment</label>
                    <textarea
                        className="form-control"
                        id="comment"
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="research" className="form-label">Research</label>
                    <input
                        type="number"
                        className="form-control"
                        id="research"
                        name="research"
                        value={formData.research}
                        onChange={handleChange}
                        min="0"
                        max="5"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="socialLife" className="form-label">Social Life</label>
                    <input
                        type="number"
                        className="form-control"
                        id="socialLife"
                        name="socialLife"
                        value={formData.socialLife}
                        onChange={handleChange}
                        min="0"
                        max="5"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="academicSupport" className="form-label">Academic Support</label>
                    <input
                        type="number"
                        className="form-control"
                        id="academicSupport"
                        name="academicSupport"
                        value={formData.academicSupport}
                        onChange={handleChange}
                        min="0"
                        max="5"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="classSize" className="form-label">Class Size</label>
                    <input
                        type="number"
                        className="form-control"
                        id="classSize"
                        name="classSize"
                        value={formData.classSize}
                        onChange={handleChange}
                        min="0"
                        max="5"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="location" className="form-label">Location</label>
                    <input
                        type="number"
                        className="form-control"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        min="0"
                        max="5"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Add Rating</button>
            </form>
        </div>
    );
};

export default AddRating;