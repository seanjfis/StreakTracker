import React from 'react';
import './ActivityList.css';

function ActivityList({ activities, onUpdateStreak, onToggleFreezeActivity, onDeleteStreak, onViewActivity, onArchiveActivity }) {
    return (
        <ul>
            {activities.map((activity, index) => (
                <li
                    key={index}
                    className={`${activity.lastUpdated === new Date().toDateString() ? 'updated-today' : ''} ${activity.isArchived ? 'archived' : ''}`}
                    onClick={() => !activity.isArchived && onUpdateStreak(index)}
                >
                    <span>{activity.name} - Streak: {activity.streak}</span>
                    {!activity.isArchived && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleFreezeActivity(index);
                            }}
                        >
                            {activity.isFrozen ? 'Unfreeze' : 'Freeze'}
                        </button>
                    )}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewActivity(index);
                        }}
                    > View </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteStreak(index);
                        }}
                    > Delete
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onArchiveActivity(index);
                        }}
                    >
                        {activity.isArchived ? 'Unarchive' : 'Archive'}
                    </button>
                </li>
            ))}
        </ul>
    );
}

export default ActivityList;
