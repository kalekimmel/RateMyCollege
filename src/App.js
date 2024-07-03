import React, { useEffect, useState } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AddRating from './components/AddRating';
import SchoolCard from './components/SchoolCard';
import AddSchool from './components/AddSchool';
import Favorites from './components/Favorites'; // Import the Favorites component
import { ItemTypes } from './constants'; // Import ItemTypes
import './App.css';

const App = () => {
    const [schools, setSchools] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('');

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const response = await axios.get('http://localhost:5000/schools');
                const schoolsWithRatings = response.data.map(school => {
                    const ratings = school.ratings;
                    const averageStars = ratings.length > 0 ? 
                        (ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length).toFixed(1) : 0;
                    return { ...school, averageStars: parseFloat(averageStars) };
                });
                setSchools(schoolsWithRatings);
            } catch (error) {
                console.error('There was an error fetching the schools!', error);
            }
        };

        fetchSchools();
    }, []);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSort = (event) => {
        setSortOption(event.target.value);
    };

    const addSchool = (newSchool) => {
        const ratings = newSchool.ratings || [];
        const averageStars = ratings.length > 0 ? 
            (ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length).toFixed(1) : 0;
        setSchools([...schools, { ...newSchool, averageStars: parseFloat(averageStars) }]);
    };

    const addReview = (schoolId, newReview) => {
        setSchools(prevSchools => prevSchools.map(school => {
            if (school._id === schoolId) {
                const updatedRatings = [...school.ratings, newReview];
                const averageStars = updatedRatings.length > 0 ? 
                    (updatedRatings.reduce((sum, rating) => sum + rating.rating, 0) / updatedRatings.length).toFixed(1) : 0;
                return { ...school, ratings: updatedRatings, averageStars: parseFloat(averageStars) };
            }
            return school;
        }));
    };

    const moveToFavorites = (schoolId) => {
        const school = schools.find(s => s._id === schoolId);
        setFavorites([...favorites, school]);
        setSchools(schools.filter(s => s._id !== schoolId));
    };

    const moveToSchools = (schoolId) => {
        const school = favorites.find(s => s._id === schoolId);
        setSchools([...schools, school]);
        setFavorites(favorites.filter(s => s._id !== schoolId));
    };

    const filteredSchools = schools.filter(school =>
        school.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedSchools = filteredSchools.sort((a, b) => {
        if (sortOption === 'name') {
            return a.name.localeCompare(b.name);
        } else if (sortOption === 'stars') {
            return b.averageStars - a.averageStars;
        } else {
            return 0;
        }
    });

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="App container">
                <header className="my-4">
                    <h1 className="text-center">Rate My School</h1>
                </header>
                <nav className="mb-4">
                    <Link to="/">Home</Link> | <Link to="/add-school">Add School</Link>
                </nav>
                <Favorites favorites={favorites} moveToSchools={moveToSchools} />
                <Routes>
                    <Route path="/" element={
                        <>
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search schools..."
                                        value={searchQuery}
                                        onChange={handleSearch}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <select className="form-select" value={sortOption} onChange={handleSort}>
                                        <option value="">Sort by: None</option>
                                        <option value="name">Sort by: Name</option>
                                        <option value="stars">Sort by: Stars</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                {sortedSchools.map(school => (
                                    <div className="col-md-4 mb-4" key={school._id}>
                                        <SchoolCard school={school} moveToFavorites={moveToFavorites} isFavorite={false} />
                                    </div>
                                ))}
                            </div>
                        </>
                    } />
                    <Route path="/add-rating/:id" element={<AddRating addReview={addReview} />} />
                    <Route path="/add-school" element={<AddSchool addSchool={addSchool} />} />
                </Routes>
            </div>
        </DndProvider>
    );
};

export default App;