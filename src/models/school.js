const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    research: { type: Number, required: true },
    socialLife: { type: Number, required: true },
    academicSupport: { type: Number, required: true },
    classSize: { type: Number, required: true },
    location: { type: Number, required: true },
});

const schoolSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    website: { type: String, required: true },
    ratings: [ratingSchema],
});

const School = mongoose.model('School', schoolSchema);

module.exports = School;