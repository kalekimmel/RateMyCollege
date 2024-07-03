const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/schools', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false // To avoid deprecation warnings
});

// Define the review schema
const reviewSchema = new mongoose.Schema({
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    research: { type: Number, required: true, min: 0, max: 5 },
    socialLife: { type: Number, required: true, min: 0, max: 5 },
    academicSupport: { type: Number, required: true, min: 0, max: 5 },
    classSize: { type: Number, required: true, min: 0, max: 5 },
    location: { type: Number, required: true, min: 0, max: 5 },
    date: { type: Date, default: Date.now },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 }
});

// Define the school schema
const schoolSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    website: { type: String, required: true },
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
        price: req.body.price, // Include price in the request
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
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }
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
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }
        const review = school.ratings.id(req.params.reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
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
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }
        const review = school.ratings.id(req.params.reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        review.downvotes += 1;
        await school.save();
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));