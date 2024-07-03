import React, { useState } from 'react';
import axios from 'axios';
import './AddSchool.css';

const AddSchool = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [website, setWebsite] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:5000/schools', { name, description, address, website })
            .then(response => {
                alert('School added successfully!');
                setName('');
                setDescription('');
                setAddress('');
                setWebsite('');
            })
            .catch(error => {
                console.error('There was an error adding the school!', error);
            });
    };

    return (
        <div className="add-school-container">
            <h2>Add a School</h2>
            <form onSubmit={handleSubmit} className="add-school-form">
                <div className="form-group">
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Address:</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Website:</label>
                    <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Add School</button>
            </form>
        </div>
    );
};

export default AddSchool;