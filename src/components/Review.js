import React from 'react';
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

export default Review;