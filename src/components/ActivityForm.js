import React, { useState } from 'react';

function ActivityForm({ onAddActivity }) {
    const [name, setName] = useState('');
    const [streak, setStreak] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const streakValue = streak === '' ? 0 : parseInt(streak);
        onAddActivity(name, streakValue);
        setName('');
        setStreak('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Enter activity name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="number"
                placeholder="Enter starting streak"
                value={streak}
                onChange={(e) => setStreak(e.target.value)}
            />
            <button type="submit">Add Activity</button>
        </form>
    );
}

export default ActivityForm;
