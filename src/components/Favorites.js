import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../constants'; 
import SchoolCard from './SchoolCard';

const Favorites = ({ favorites, moveToSchools }) => {
    const [, drop] = useDrop(() => ({
        accept: ItemTypes.SCHOOL,
        drop: (item) => {
            moveToSchools(item.id);
        },
    }));

    return (
        <div ref={drop} className="favorites-section">
            <h2>Favorites</h2>
            <div className="row">
                {favorites.map((school) => (
                    <div className="col-md-4 mb-4" key={school._id}>
                        <SchoolCard school={school} moveToFavorites={moveToSchools} isFavorite={true} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Favorites;