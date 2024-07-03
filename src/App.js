import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SchoolList from './components/SchoolList';
import AddSchool from './components/AddSchool';
import AddRating from './components/AddRating';
import './styles.css';

function App() {
    return (
        <DndProvider backend={HTML5Backend}>
            <Router>
                <div className="app-container">
                    <nav className="navbar">
                        <div className="navbar-brand">
                            <Link to="/">Rate My School</Link>
                        </div>
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/add-school">Add School</Link>
                            </li>
                        </ul>
                    </nav>
                    <div className="content">
                        <Routes>
                            <Route path="/" element={<SchoolList />} />
                            <Route path="/add-school" element={<AddSchool />} />
                            <Route path="/add-rating/:id" element={<AddRating />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </DndProvider>
    );
}


export default App;