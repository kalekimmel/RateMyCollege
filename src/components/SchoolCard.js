import React, { useState, useEffect, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import AddRatingModal from './AddRatingModal'; // Import AddRatingModal
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
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

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Helper function to calculate average stars
const calculateAverageStars = (ratings) => {
    if (!Array.isArray(ratings) || ratings.length === 0) return 0;
    const validRatings = ratings.filter(r => r && typeof r.rating === 'number');
    const totalStars = validRatings.reduce((sum, r) => sum + r.rating, 0);
    return validRatings.length > 0 ? totalStars / validRatings.length : 0;
};

const SchoolCard = ({ school, moveToFavorites, isFavorite, addReview }) => {
    const [ratings, setRatings] = useState(Array.isArray(school.ratings) ? school.ratings : []);
    const [averageStars, setAverageStars] = useState(calculateAverageStars(ratings));
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [showNotes, setShowNotes] = useState(false);
    const [pros, setPros] = useState('');
    const [cons, setCons] = useState('');
    const [showAddRatingModal, setShowAddRatingModal] = useState(false);
    const [sentimentSummary, setSentimentSummary] = useState('');
    const [detailedSentiment, setDetailedSentiment] = useState({
        positive: 0,
        negative: 0,
        total: 0,
        positive_percentage: 0,
        negative_percentage: 0,
        common_words: []
    });

    const averageReview = {
        research: ratings.length > 0 ? ratings.reduce((sum, r) => sum + (r.research || 0), 0) / ratings.length : 0,
        socialLife: ratings.length > 0 ? ratings.reduce((sum, r) => sum + (r.socialLife || 0), 0) / ratings.length : 0,
        academicSupport: ratings.length > 0 ? ratings.reduce((sum, r) => sum + (r.academicSupport || 0), 0) / ratings.length : 0,
        classSize: ratings.length > 0 ? ratings.reduce((sum, r) => sum + (r.classSize || 0), 0) / ratings.length : 0,
        location: ratings.length > 0 ? ratings.reduce((sum, r) => sum + (r.location || 0), 0) / ratings.length : 0,
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

    // Memoize analyzeReviews to prevent unnecessary redefinition
    const analyzeReviews = useCallback(async (ratings) => {
        const validComments = ratings
            .filter(r => r && typeof r.comment === 'string')
            .map(rating => rating.comment)
            .join('\n');

        if (!validComments) {
            console.warn('No valid comments to analyze.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5001/analyze', {
                reviews: validComments
            });

            const { summary, positive, negative, total, positive_percentage, negative_percentage, common_words } = response.data;
            setSentimentSummary(summary);
            setDetailedSentiment({
                positive,
                negative,
                total,
                positive_percentage,
                negative_percentage,
                common_words
            });
        } catch (error) {
            console.error('Error analyzing reviews:', error);
        }
    }, []);

    useEffect(() => {
        // Recalculate average stars whenever ratings change
        setAverageStars(calculateAverageStars(ratings));

        if (Array.isArray(ratings) && ratings.length > 0) {
            analyzeReviews(ratings);
        }
    }, [ratings, analyzeReviews]);

    const renderStars = (averageStars) => {
        const fullStars = Math.floor(averageStars);
        const halfStar = averageStars % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;

        return (
            <>
                {'★'.repeat(fullStars)}
                {halfStar ? '½' : ''}
                {'☆'.repeat(emptyStars)}
            </>
        );
    };

    const handleAddReview = (newReview) => {
        if (newReview && typeof newReview.rating === 'number') {
            // Create a new array reference for updatedRatings
            const updatedRatings = [...ratings, newReview];
            setRatings(updatedRatings);
            
            // Optionally, sync the review with the backend if needed
            addReview(newReview);
            
            // Recalculate average stars
            setAverageStars(calculateAverageStars(updatedRatings));
    
            // Analyze reviews right after the state update
            analyzeReviews(updatedRatings);
        } else {
            console.error('Invalid review:', newReview); // Log invalid review
        }
    };

    return (
        <div className="card h-100">
            <div className="card-body">
                <h2 className="card-title">{school.name}</h2>
                <p className="card-text">{school.description}</p>
                <p><strong>Address:</strong> {school.address}</p>
                <p><strong>Website:</strong> <a href={school.website} target="_blank" rel="noopener noreferrer">{school.website}</a></p>
                <div className="stars mb-2">
                    {renderStars(averageStars)}
                    <span> ({averageStars.toFixed(1)} stars)</span>
                </div>
                <button onClick={() => setShowAllReviews(!showAllReviews)} className="btn btn-secondary mb-2">
                    {showAllReviews ? 'Show Average Review' : 'Show All Reviews'}
                </button>
                {showAllReviews ? (
                    <div>
                        <h3>Ratings</h3>
                        <div className="reviews-container">
                            {Array.isArray(ratings) && ratings.length > 0 ? (
                                ratings.map((rating, index) => (
                                    <div key={index} className="review">
                                        <p><strong>Rating:</strong> {rating.rating}</p>
                                        <p><strong>Comment:</strong> {rating.comment}</p>
                                        <p><strong>Research:</strong> {rating.research}</p>
                                        <p><strong>Social Life:</strong> {rating.socialLife}</p>
                                        <p><strong>Academic Support:</strong> {rating.academicSupport}</p>
                                        <p><strong>Class Size:</strong> {rating.classSize}</p>
                                        <p><strong>Location:</strong> {rating.location}</p>
                                        <p><strong>Date:</strong> {rating.date ? new Date(rating.date).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No reviews available.</p>
                            )}
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
                {sentimentSummary && (
                    <div className="overall-sentiment">
                        <h3>Review Summary</h3>
                        <p>{sentimentSummary}</p>
                        <p><strong>Positive Reviews:</strong> {detailedSentiment.positive} ({detailedSentiment.positive_percentage.toFixed(2)}%)</p>
                        <p><strong>Negative Reviews:</strong> {detailedSentiment.negative} ({detailedSentiment.negative_percentage.toFixed(2)}%)</p>
                        <p><strong>Total Reviews:</strong> {detailedSentiment.total}</p>
                    </div>
                )}
                <div className="mb-2">
                    <button onClick={() => setShowNotes(!showNotes)} className="btn btn-info">Toggle Notes</button>
                    {showNotes && (
                        <div className="mt-2">
                            <div className="form-group">
                                <label>Pros</label>
                                <textarea
                                    className="form-control"
                                    value={pros}
                                    onChange={(e) => setPros(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label>Cons</label>
                                <textarea
                                    className="form-control"
                                    value={cons}
                                    onChange={(e) => setCons(e.target.value)}
                                ></textarea>
                               
                            </div>
                        </div>
                    )}
                </div>
                <Button variant="primary" onClick={() => setShowAddRatingModal(true)}>Add Rating</Button>
                <AddRatingModal show={showAddRatingModal} handleClose={() => setShowAddRatingModal(false)} schoolId={school._id} addReview={handleAddReview} />
                <button onClick={() => moveToFavorites(school._id)} className="btn btn-warning mt-2">
                    {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
            </div>
        </div>
    );
};

export default SchoolCard;