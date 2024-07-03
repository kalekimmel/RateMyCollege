import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SchoolCard from './SchoolCard';
import FavoriteSchools from './FavoriteSchools';
import './SchoolList.css';

const SchoolList = () => {
    const [schools, setSchools] = useState([]);
    const [favoriteSchools, setFavoriteSchools] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [schoolsPerPage] = useState(5);
    const [sortCriteria, setSortCriteria] = useState('none');

    useEffect(() => {
        fetchSchools();
    }, []);

    const fetchSchools = async () => {
        try {
            const response = await axios.get('http://localhost:5000/schools');
            setSchools(response.data);
        } catch (error) {
            console.error('There was an error fetching the schools!', error);
        }
    };

    const handleAddToFavorites = (school) => {
        setFavoriteSchools([...favoriteSchools, school]);
        setSchools(schools.filter(s => s._id !== school._id));
    };

    const handleRemoveFromFavorites = (school) => {
        setFavoriteSchools(favoriteSchools.filter(s => s._id !== school._id));
        setSchools([...schools, school]);
    };

    const handleSortChange = (e) => {
        setSortCriteria(e.target.value);
    };

    const sortSchools = (schools, criteria) => {
        if (criteria === 'none') return schools;

        return [...schools].sort((a, b) => {
            const aAvg = calculateAverage(a, criteria);
            const bAvg = calculateAverage(b, criteria);
            return bAvg - aAvg;
        });
    };

    const calculateAverage = (school, criteria) => {
        const totalRatings = school.ratings.length;
        if (totalRatings === 0) return 0;

        const sum = school.ratings.reduce((acc, rating) => acc + rating[criteria], 0);
        return sum / totalRatings;
    };

    const filteredSchools = schools.filter(school =>
        school.name.toLowerCase().includes(search.toLowerCase())
    );

    const sortedSchools = sortSchools(filteredSchools, sortCriteria);

    const indexOfLastSchool = currentPage * schoolsPerPage;
    const indexOfFirstSchool = indexOfLastSchool - schoolsPerPage;
    const currentSchools = sortedSchools.slice(indexOfFirstSchool, indexOfLastSchool);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className="school-list-container">
            <h1>Schools</h1>
            <input
                type="text"
                placeholder="Search schools..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-bar"
            />
            <div className="sort-dropdown">
                <label>Sort by: </label>
                <select value={sortCriteria} onChange={handleSortChange}>
                    <option value="none">None</option>
                    <option value="rating">Overall Rating</option>
                    <option value="research">Research</option>
                    <option value="socialLife">Social Life</option>
                    <option value="academicSupport">Academic Support</option>
                    <option value="classSize">Class Size</option>
                    <option value="location">Location</option>
                </select>
            </div>
            <div className="school-list">
                {currentSchools.map(school => (
                    <SchoolCard
                        key={school._id}
                        school={school}
                        onAddToFavorites={handleAddToFavorites}
                    />
                ))}
            </div>
            <Pagination
                schoolsPerPage={schoolsPerPage}
                totalSchools={filteredSchools.length}
                paginate={paginate}
            />
            <FavoriteSchools
                favoriteSchools={favoriteSchools}
                onRemoveFromFavorites={handleRemoveFromFavorites}
            />
        </div>
    );
};

const Pagination = ({ schoolsPerPage, totalSchools, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalSchools / schoolsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className="pagination">
                {pageNumbers.map(number => (
                    <li key={number} className="page-item">
                        <a onClick={() => paginate(number)} href="!#" className="page-link">
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default SchoolList;