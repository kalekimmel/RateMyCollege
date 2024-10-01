import React, { useEffect, useState } from 'react';
import vader from 'vader-sentiment';
import './Review.css';

const Review = ({ review }) => {
    return (
        <div className="review-card">
            <div className="review-content">
                <p><strong>Rating:</strong> {review.rating}</p>
                <p><strong>Comment:</strong> {review.comment}</p>
                <p><strong>Research:</strong> {review.research}</p>
                <p><strong>Social Life:</strong> {review.socialLife}</p>
                <p><strong>Academic Support:</strong> {review.academicSupport}</p>
                <p><strong>Class Size:</strong> {review.classSize}</p>
                <p><strong>Location:</strong> {review.location}</p>
                <p><strong>Date:</strong> {new Date(review.date).toLocaleDateString()}</p>
            </div>
        </div>
    );
};

const Reviews = ({ reviews = [] }) => {
    const [overallSentiment, setOverallSentiment] = useState(null);
    const [summary, setSummary] = useState('');

    useEffect(() => {
        if (reviews.length > 0) {
            analyzeSentiment(reviews);
        }
    }, [reviews]);

    const analyzeSentiment = (reviews) => {
        let totalSentiment = 0;
        reviews.forEach(review => {
            const result = vader.SentimentIntensityAnalyzer.polarity_scores(review.comment);
            totalSentiment += result.compound;
        });
        const averageSentiment = totalSentiment / reviews.length;
        setOverallSentiment(averageSentiment);
        generateSummary(averageSentiment);
    };

    const generateSummary = (averageSentiment) => {
        let summaryText = '';
        if (averageSentiment > 0.05) {
            summaryText = 'Overall, the reviews for this school are positive.';
        } else if (averageSentiment < -0.05) {
            summaryText = 'Overall, the reviews for this school are negative.';
        } else {
            summaryText = 'Overall, the reviews for this school are neutral.';
        }
        setSummary(summaryText);
    };

    return (
        <div>
            <h1>School Reviews</h1>
            {reviews.map((review, index) => (
                <Review key={index} review={review} />
            ))}
            {overallSentiment !== null && (
                <div className="overall-sentiment">
                    <h2>Overall Sentiment: {overallSentiment.toFixed(2)}</h2>
                    <p>{summary}</p>
                </div>
            )}
        </div>
    );
};

export default Reviews;