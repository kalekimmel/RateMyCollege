import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { useDrag } from 'react-dnd';
import Review from './Review';
import './SchoolCard.css';

const SchoolCard = ({ school, onAddToFavorites }) => {
    const [showAllReviews, setShowAllReviews] = useState(true);
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'school',
        item: { school },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const calculateAverageReview = () => {
        const totalRatings = school.ratings.length;
        const averageRatings = school.ratings.reduce((acc, rating) => {
            acc.rating += rating.rating;
            acc.research += rating.research;
            acc.socialLife += rating.socialLife;
            acc.academicSupport += rating.academicSupport;
            acc.classSize += rating.classSize;
            acc.location += rating.location;
            return acc;
        }, {
            rating: 0,
            research: 0,
            socialLife: 0,
            academicSupport: 0,
            classSize: 0,
            location: 0
        });

        for (const key in averageRatings) {
            averageRatings[key] = (averageRatings[key] / totalRatings).toFixed(1);
        }

        return averageRatings;
    };

    const averageReview = calculateAverageReview();

    const data = {
        labels: ['Rating', 'Research', 'Social Life', 'Academic Support', 'Class Size', 'Location'],
        datasets: [
            {
                label: 'Average Review',
                data: [
                    averageReview.rating,
                    averageReview.research,
                    averageReview.socialLife,
                    averageReview.academicSupport,
                    averageReview.classSize,
                    averageReview.location
                ],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 10,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    const handleAddToFavorites = () => {
        onAddToFavorites(school);
    };

    return (
        <div ref={drag} className="school-card" style={{ opacity: isDragging ? 0.5 : 1 }}>
            <h2>{school.name}</h2>
            <p>{school.description}</p>
            <p><strong>Address:</strong> {school.address}</p>
            <p><strong>Website:</strong> <a href={school.website} target="_blank" rel="noopener noreferrer">{school.website}</a></p>
            <button onClick={() => setShowAllReviews(!showAllReviews)} className="btn btn-secondary">
                {showAllReviews ? 'Show Average Review' : 'Show All Reviews'}
            </button>
            {showAllReviews ? (
                <div>
                    <h3>Ratings</h3>
                    <div className="reviews-container">
                        {school.ratings.map((rating, index) => (
                            <Review key={index} review={rating} />
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    <h3>Average Review</h3>
                    <ul>
                        <li><strong>Rating:</strong> {averageReview.rating}</li>
                        <li><strong>Research:</strong> {averageReview.research}</li>
                        <li><strong>Social Life:</strong> {averageReview.socialLife}</li>
                        <li><strong>Academic Support:</strong> {averageReview.academicSupport}</li>
                        <li><strong>Class Size:</strong> {averageReview.classSize}</li>
                        <li><strong>Location:</strong> {averageReview.location}</li>
                    </ul>
                    <div className="chart-container">
                        <Bar data={data} options={options} />
                    </div>
                </div>
            )}
            <button onClick={handleAddToFavorites} className="btn btn-secondary">Add to Favorites</button>
            <Link to={`/add-rating/${school._id}`} className="btn btn-secondary">Add Rating</Link>
        </div>
    );
};

export default SchoolCard;