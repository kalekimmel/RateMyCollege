const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/schools', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Could not connect to MongoDB", err);
});

const secretKey = 'your_secret_key'; // Use a secure key in production

// User schema and model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Review schema
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

// School schema and model
const schoolSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    website: { type: String, required: true },
    price: { type: Number, required: true },
    ratings: [reviewSchema]
});

const School = mongoose.model('School', schoolSchema);

// User registration
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// User login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(403).json({ message: 'Token is required' });

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Example of a protected route
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

// Route to get all schools
app.get('/schools', async (req, res) => {
    try {
        const schools = await School.find();
        res.json(schools);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to add a school (requires authentication)
app.post('/schools', authenticateToken, async (req, res) => {
    const school = new School({
        name: req.body.name,
        description: req.body.description,
        address: req.body.address,
        website: req.body.website,
        price: parseFloat(req.body.price), // Ensure price is parsed as a float
        ratings: []
    });

    try {
        const newSchool = await school.save();
        res.status(201).json(newSchool);
    } catch (error) {
        console.log('Error:', error); // Log error details
        res.status(400).json({ message: error.message });
    }
});

// Route to add a rating (no authentication required)
app.post('/schools/:id/ratings', async (req, res) => {
    console.log('Incoming request body:', req.body); // Log incoming request

    try {
        const school = await School.findById(req.params.id);
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }
        // Parse the fields to ensure they are numbers
        const newRating = {
            rating: parseInt(req.body.rating, 10),
            comment: req.body.comment,
            research: parseInt(req.body.research, 10),
            socialLife: parseInt(req.body.socialLife, 10),
            academicSupport: parseInt(req.body.academicSupport, 10),
            classSize: parseInt(req.body.classSize, 10),
            location: parseInt(req.body.location, 10),
            upvotes: 0,
            downvotes: 0
        };
        // Validate the parsed fields to ensure they are within the expected range
        if (
            isNaN(newRating.rating) || newRating.rating < 1 || newRating.rating > 5 ||
            isNaN(newRating.research) || newRating.research < 0 || newRating.research > 5 ||
            isNaN(newRating.socialLife) || newRating.socialLife < 0 || newRating.socialLife > 5 ||
            isNaN(newRating.academicSupport) || newRating.academicSupport < 0 || newRating.academicSupport > 5 ||
            isNaN(newRating.classSize) || newRating.classSize < 0 || newRating.classSize > 5 ||
            isNaN(newRating.location) || newRating.location < 0 || newRating.location > 5
        ) {
            throw new Error('Invalid input values');
        }
        school.ratings.push(newRating);
        await school.save();
        res.status(201).json(newRating);
    } catch (error) {
        console.log('Error:', error); // Log error details
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