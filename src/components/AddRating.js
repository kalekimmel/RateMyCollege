import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AddRating = () => {
    const { id } = useParams();
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');
    const [research, setResearch] = useState('');
    const [socialLife, setSocialLife] = useState('');
    const [academicSupport, setAcademicSupport] = useState('');
    const [classSize, setClassSize] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post(`http://localhost:5000/schools/${id}/ratings`, 
            { rating, comment, research, socialLife, academicSupport, classSize, location })
            .then(response => {
                alert('Rating added successfully!');
            })
            .catch(error => {
                console.error('There was an error adding the rating!', error);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add a Rating</h2>
            <div>
                <label>Overall Rating:</label>
                <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} required />
            </div>
            <div>
                <label>Comment:</label>
                <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} required />
            </div>
            <div>
                <label>Research:</label>
                <input type="number" value={research} onChange={(e) => setResearch(e.target.value)} required />
            </div>
            <div>
                <label>Social Life:</label>
                <input type="number" value={socialLife} onChange={(e) => setSocialLife(e.target.value)} required />
            </div>
            <div>
                <label>Academic Support:</label>
                <input type="number" value={academicSupport} onChange={(e) => setAcademicSupport(e.target.value)} required />
            </div>
            <div>
                <label>Class Size:</label>
                <input type="number" value={classSize} onChange={(e) => setClassSize(e.target.value)} required />
            </div>
            <div>
                <label>Location:</label>
                <input type="number" value={location} onChange={(e) => setLocation(e.target.value)} required />
            </div>
            <button type="submit">Add Rating</button>
        </form>
    );
};

export default AddRating;