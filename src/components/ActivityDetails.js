import React from 'react';
import './ActivityDetails.css';

function ActivityDetails({ activity, goBack }) {
    const activityStartDate = new Date(activity.startDate);

    let logHtml = '';
    if (activity.contributions && activity.contributions.length > 0) {
        logHtml = '<strong>Log:</strong><ul>';
        activity.contributions.forEach(contribution => {
            logHtml += `<li><strong>${contribution.date}:</strong> <span>${contribution.contribution}</span></li>`;
        });
        logHtml += '</ul>';
    }

    return (
        <div className="details-view">
            <h1>{activity.name}</h1>
            <p><strong>Streak:</strong> {activity.streak}</p>
            <p><strong>Date Started:</strong> {activityStartDate.toDateString()}</p>
            <p><strong>Last Updated:</strong> {activity.lastUpdated || 'Never'}</p>
            <p><strong>Longest Recorded Streak:</strong> {activity.longestRecordedStreak || 0}</p>
            {logHtml && <div className="log" dangerouslySetInnerHTML={{ __html: logHtml }} />}
            <button onClick={goBack}>Back</button>
        </div>
    );
}

export default ActivityDetails;
