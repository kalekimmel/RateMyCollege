const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/schools', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define the review schema
const reviewSchema = new mongoose.Schema({
    rating: Number,
    comment: String,
    research: Number,
    socialLife: Number,
    academicSupport: Number,
    classSize: Number,
    location: Number,
    date: { type: Date, default: Date.now },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 }
});

// Define the school schema
const schoolSchema = new mongoose.Schema({
    name: String,
    description: String,
    address: String,
    website: String,
    ratings: [reviewSchema]
});

const School = mongoose.model('School', schoolSchema);

// Route to get all schools
app.get('/schools', async (req, res) => {
    try {
        const schools = await School.find();
        res.json(schools);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to add a school
app.post('/schools', async (req, res) => {
    const school = new School({
        name: req.body.name,
        description: req.body.description,
        address: req.body.address,
        website: req.body.website,
        ratings: []
    });

    try {
        const newSchool = await school.save();
        res.status(201).json(newSchool);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to add a rating
app.post('/schools/:id/ratings', async (req, res) => {
    try {
        const school = await School.findById(req.params.id);
        const newRating = {
            rating: req.body.rating,
            comment: req.body.comment,
            research: req.body.research,
            socialLife: req.body.socialLife,
            academicSupport: req.body.academicSupport,
            classSize: req.body.classSize,
            location: req.body.location,
            upvotes: 0,
            downvotes: 0
        };
        school.ratings.push(newRating);
        await school.save();
        res.status(201).json(newRating);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to upvote a review
app.post('/schools/:schoolId/reviews/:reviewId/upvote', async (req, res) => {
    try {
        const school = await School.findById(req.params.schoolId);
        const review = school.ratings.id(req.params.reviewId);
        review.upvotes += 1;
        await school.save();
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to downvote a review
app.post('/schools/:schoolId/reviews/:reviewId/downvote', async (req, res) => {
    try {
        const school = await School.findById(req.params.schoolId);
        const review = school.ratings.id(req.params.reviewId);
        review.downvotes += 1;
        await school.save();
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));