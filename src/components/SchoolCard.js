import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Review from './Review';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import './SchoolCard.css';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const SchoolCard = ({ school, moveToFavorites, isFavorite }) => {
    const [showAllReviews, setShowAllReviews] = useState(false);

    const averageReview = {
        research: school.ratings.length > 0 ? school.ratings.reduce((sum, r) => sum + r.research, 0) / school.ratings.length : 0,
        socialLife: school.ratings.length > 0 ? school.ratings.reduce((sum, r) => sum + r.socialLife, 0) / school.ratings.length : 0,
        academicSupport: school.ratings.length > 0 ? school.ratings.reduce((sum, r) => sum + r.academicSupport, 0) / school.ratings.length : 0,
        classSize: school.ratings.length > 0 ? school.ratings.reduce((sum, r) => sum + r.classSize, 0) / school.ratings.length : 0,
        location: school.ratings.length > 0 ? school.ratings.reduce((sum, r) => sum + r.location, 0) / school.ratings.length : 0,
    };

    const data = {
        labels: ['Research', 'Social Life', 'Academic Support', 'Class Size', 'Location'],
        datasets: [
            {
                label: 'Average Review',
                data: [
                    averageReview.research,
                    averageReview.socialLife,
                    averageReview.academicSupport,
                    averageReview.classSize,
                    averageReview.location,
                ],
                backgroundColor: 'rgba(75,192,192,0.4)',
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                max: 5,
            },
        },
    };

    return (
        <div className="card h-100">
            <div className="card-body">
                <h2 className="card-title">{school.name}</h2>
                <p className="card-text">{school.description}</p>
                <p><strong>Address:</strong> {school.address}</p>
                <p><strong>Website:</strong> <a href={school.website} target="_blank" rel="noopener noreferrer">{school.website}</a></p>
                <div className="stars mb-2">
                    {'★'.repeat(Math.round(school.averageStars))}{'☆'.repeat(5 - Math.round(school.averageStars))}
                    <span> ({school.averageStars} stars)</span>
                </div>
                <button onClick={() => setShowAllReviews(!showAllReviews)} className="btn btn-secondary mb-2">
                    {showAllReviews ? 'Show Average Review' : 'Show All Reviews'}
                </button>
                {showAllReviews ? (
                    <div>
                        <h3>Ratings</h3>
                        <div className="reviews-container">
                            {school.ratings.map((rating, index) => (
                                <Review
                                    key={index}
                                    review={rating}
                                    schoolId={school._id}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div>
                        <h3>Average Review</h3>
                        <ul>
                            <li><strong>Research:</strong> {averageReview.research.toFixed(1)}</li>
                            <li><strong>Social Life:</strong> {averageReview.socialLife.toFixed(1)}</li>
                            <li><strong>Academic Support:</strong> {averageReview.academicSupport.toFixed(1)}</li>
                            <li><strong>Class Size:</strong> {averageReview.classSize.toFixed(1)}</li>
                            <li><strong>Location:</strong> {averageReview.location.toFixed(1)}</li>
                        </ul>
                        <div className="chart-container">
                            <Bar data={data} options={options} />
                        </div>
                    </div>
                )}
                <Link to={`/add-rating/${school._id}`} className="btn btn-primary mt-2">Add Rating</Link>
                <button onClick={() => moveToFavorites(school._id)} className={`btn mt-2 ${isFavorite ? 'btn-danger' : 'btn-warning'}`}>
                    {isFavorite ? 'Remove from Favorites' : 'Favorite'}
                </button>
            </div>
        </div>
    );
};

export default SchoolCard;