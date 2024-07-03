import React, { useState } from 'react';
import axios from 'axios';

const AddSchool = ({ addSchool }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        website: '',
        price: '' // Add price to form data
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
            const response = await axios.post('http://localhost:5000/schools', formData);
            addSchool(response.data);
            setFormData({
                name: '',
                description: '',
                address: '',
                website: '',
                price: '' // Reset price field
            });
        } catch (error) {
            console.error('There was an error adding the school!', error);
        }
    };

    return (
        <div className="container">
            <h2>Add School</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <input
                        type="text"
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Address</label>
                    <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Website</label>
                    <input
                        type="url"
                        className="form-control"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Add School</button>
            </form>
        </div>
    );
};

export default AddSchool;