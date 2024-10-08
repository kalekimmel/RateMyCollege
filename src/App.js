import React, { useEffect, useState } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SchoolCard from './components/SchoolCard';
import Favorites from './components/Favorites';
import SchoolMap from './components/SchoolMap';
import AddSchoolModal from './components/AddSchoolModal';
import RegisterModal from './components/RegisterModal';
import QuestionList from './components/QuestionList';
import LoginModal from './components/LoginModal';
import QuestionModal from './components/QuestionModal';
import ChatRoomModal from './components/ChatRoomModal'; // Import ChatRoomModal
import Reviews from './components/Review'; // Import Reviews component
import { Button } from 'react-bootstrap';
import './App.css';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Initialize socket connection

const App = () => {
  const [schools, setSchools] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [filterField, setFilterField] = useState('');
  const [filterCondition, setFilterCondition] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [showAddSchoolModal, setShowAddSchoolModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showChatRoomModal, setShowChatRoomModal] = useState(false); // State for ChatRoomModal
  const [token, setToken] = useState('');
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showReviews, setShowReviews] = useState(false); // State to show/hide reviews

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get('http://localhost:5000/schools');
        const schoolsWithRatings = response.data.map((school) => {
          const ratings = school.ratings;
          const averageStars =
            ratings.length > 0
              ? (
                  ratings.reduce((sum, rating) => sum + rating.rating, 0) /
                  ratings.length
                ).toFixed(1)
              : 0;
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

  const handleFilterFieldChange = (event) => {
    setFilterField(event.target.value);
  };

  const handleFilterConditionChange = (event) => {
    setFilterCondition(event.target.value);
  };

  const handleFilterValueChange = (event) => {
    setFilterValue(event.target.value);
  };

  const addSchool = (newSchool) => {
    const ratings = newSchool.ratings || [];
    const averageStars =
      ratings.length > 0
        ? (
            ratings.reduce((sum, rating) => sum + rating.rating, 0) /
            ratings.length
          ).toFixed(1)
        : 0;
    setSchools([...schools, { ...newSchool, averageStars: parseFloat(averageStars) }]);
  };

  const addReview = (schoolId, newReview) => {
    setSchools((prevSchools) =>
      prevSchools.map((school) => {
        if (school._id === schoolId) {
          const updatedRatings = [...school.ratings, newReview];
          const averageStars =
            updatedRatings.length > 0
              ? (
                  updatedRatings.reduce((sum, rating) => sum + rating.rating, 0) /
                  updatedRatings.length
                ).toFixed(1)
              : 0;
          return { ...school, ratings: updatedRatings, averageStars: parseFloat(averageStars) };
        }
        return school;
      })
    );
  };

  const moveToFavorites = (schoolId) => {
    const school = schools.find((s) => s._id === schoolId);
    setFavorites([...favorites, school]);
    setSchools(schools.filter((s) => s._id !== schoolId));
  };

  const moveToSchools = (schoolId) => {
    const school = favorites.find((s) => s._id === schoolId);
    setSchools([...schools, school]);
    setFavorites(favorites.filter((s) => s._id !== schoolId));
  };

  const filteredSchools = schools
    .filter((school) => school.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((school) => {
      if (!filterField || !filterCondition || !filterValue) return true;
      const value = parseFloat(filterValue);
      const getAverage = (field) =>
        school.ratings.length > 0
          ? school.ratings.reduce((sum, r) => sum + r[field], 0) / school.ratings.length
          : 0;

      if (filterField === 'location') {
        return filterCondition === 'greater'
          ? getAverage('location') > value
          : getAverage('location') < value;
      } else if (filterField === 'research') {
        return filterCondition === 'greater'
          ? getAverage('research') > value
          : getAverage('research') < value;
      } else if (filterField === 'socialLife') {
        return filterCondition === 'greater'
          ? getAverage('socialLife') > value
          : getAverage('socialLife') < value;
      } else if (filterField === 'academicSupport') {
        return filterCondition === 'greater'
          ? getAverage('academicSupport') > value
          : getAverage('academicSupport') < value;
      } else if (filterField === 'classSize') {
        return filterCondition === 'greater'
          ? getAverage('classSize') > value
          : getAverage('classSize') < value;
      }
      return true;
    });

  const sortedSchools = filteredSchools.sort((a, b) => {
    if (sortOption === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortOption === 'stars') {
      return b.averageStars - a.averageStars;
    } else {
      return 0;
    }
  });

  const handleLogout = () => {
    setToken('');
  };

  const allReviews = schools.flatMap(school => school.ratings || []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App container">
        <header className="my-4">
          <h1 className="text-center">Rate My School</h1>
        </header>
        <nav className="mb-4">
          <Button variant="primary" onClick={() => setShowAddSchoolModal(true)} disabled={!token}>
            Add School
          </Button>
          <Button variant="info" onClick={() => setShowQuestionModal(true)}>Q&A</Button> {/* Add Q&A button */}
          {!token ? (
            <>
              <Button variant="secondary" onClick={() => setShowRegisterModal(true)}>Register</Button>
              <Button variant="secondary" onClick={() => setShowLoginModal(true)}>Login</Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setShowChatRoomModal(true)}>Chat Room</Button>
              <Button variant="danger" onClick={handleLogout}>Logout</Button>
            </>
          )}
        </nav>
        <Favorites favorites={favorites} moveToSchools={moveToSchools} />
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
        <div className="row mb-4">
          <div className="col-md-4">
            <select className="form-select" value={filterField} onChange={handleFilterFieldChange}>
              <option value="">Filter by: None</option>
              <option value="location">Location</option>
              <option value="research">Research</option>
              <option value="socialLife">Social Life</option>
              <option value="academicSupport">Academic Support</option>
              <option value="classSize">Class Size</option>
            </select>
          </div>
          <div className="col-md-4">
            <select className="form-select" value={filterCondition} onChange={handleFilterConditionChange}>
              <option value="">Condition</option>
              <option value="greater">Greater than</option>
              <option value="less">Less than</option>
            </select>
          </div>
          <div className="col-md-4">
            <input
              type="number"
              className="form-control"
              placeholder="Value"
              value={filterValue}
              onChange={handleFilterValueChange}
            />
          </div>
        </div>
        <div className="row">
          {sortedSchools.map(school => (
            <div className="col-md-4 mb-4" key={school._id}>
              <SchoolCard school={school} moveToFavorites={moveToFavorites} isFavorite={false} addReview={addReview} />
            </div>
          ))}
        </div>
        <SchoolMap schools={schools} /> 
        <Button variant="info" onClick={() => setShowReviews(!showReviews)}>
          {showReviews ? 'Hide All Reviews' : 'Show All Reviews'}
        </Button>
        {showReviews && <Reviews reviews={allReviews} />} {/* Conditionally render Reviews component */}
        <AddSchoolModal show={showAddSchoolModal} handleClose={() => setShowAddSchoolModal(false)} addSchool={addSchool} token={token} />
        <RegisterModal show={showRegisterModal} handleClose={() => setShowRegisterModal(false)} />
        <LoginModal show={showLoginModal} handleClose={() => setShowLoginModal(false)} setToken={setToken} />
        <QuestionModal show={showQuestionModal} handleClose={() => setShowQuestionModal(false)} /> {/* Add QuestionModal */}
        <ChatRoomModal 
          show={showChatRoomModal} 
          handleClose={() => setShowChatRoomModal(false)} 
          schools={schools} 
          socket={socket} 
        /> {}
        <Routes>
          {}
        </Routes>
      </div>
    </DndProvider>
  );
};

export default App;