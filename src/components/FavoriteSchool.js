
import React from 'react';
import SchoolCard from './SchoolCard';

const FavoriteSchool = ({ school, moveToSchools }) => {
    return (
        <SchoolCard school={school} moveToFavorites={moveToSchools} />
    );
};

export default FavoriteSchool;