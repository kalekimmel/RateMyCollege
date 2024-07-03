import React from 'react';
import { useDrop } from 'react-dnd';
import SchoolCard from './SchoolCard';
import './FavoriteSchools.css';

const FavoriteSchools = ({ favoriteSchools, onRemoveFromFavorites }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'school',
        drop: (item) => onRemoveFromFavorites(item.school),
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    return (
        <div ref={drop} className="favorite-schools" style={{ backgroundColor: isOver ? 'lightgreen' : 'white' }}>
            <h2>Favorite Schools</h2>
            {favoriteSchools.length > 0 ? (
                favoriteSchools.map(school => (
                    <SchoolCard key={school._id} school={school} onRemove={onRemoveFromFavorites} />
                ))
            ) : (
                <p>No favorite schools. Drag schools here to add them to your favorites.</p>
            )}
        </div>
    );
};

export default FavoriteSchools;