import React, { useState, useEffect } from 'react';
import ActivityList from './components/ActivityList';
import ActivityDetails from './components/ActivityDetails';
import ActivityForm from './components/ActivityForm';

import './App.css';

function App() {
    const [activities, setActivities] = useState(() => {
        const storedActivities = JSON.parse(localStorage.getItem('activities'));
        return storedActivities || [];
    });

    const [selectedActivity, setSelectedActivity] = useState(null);

    // Save activities to localStorage whenever they are updated
    useEffect(() => {
        console.log("Saving activities to localStorage:", activities);
        localStorage.setItem('activities', JSON.stringify(activities));
    }, [activities]);

    const handleAddActivity = (name, streak) => {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - streak);

        setActivities([
            ...activities,
            {
                name,
                streak,
                startDate: startDate.toDateString(),
                contributions: [],
                isFrozen: false,
                isArchived: false,
                lastUpdated: '',
                longestRecordedStreak: streak
            },
        ]);
    };

    const handleArchiveActivity = (index, isArchived) => {
        const newActivities = [...activities];
        newActivities[index].isArchived = !isArchived;
        if (newActivities[index].isArchived) {
            newActivities[index].streak = 0;
        }
        setActivities(newActivities);
    };

    const handleUpdateStreak = (index, isArchived) => {
        const today = new Date().toDateString();
        const filteredActivities = activities.filter(activity => activity.isArchived === isArchived);

        const newActivities = [...activities];
        const activityIndex = activities.indexOf(filteredActivities[index]);

        const needsContribution = !(newActivities[activityIndex].name === "Fitness/Exercise");

        if (needsContribution) {
            if (newActivities[activityIndex].lastUpdated !== today) {
                const contribution = prompt("Enter streak contribution for today:");
                if (contribution) {
                    newActivities[activityIndex].streak++;
                    newActivities[activityIndex].lastUpdated = today;
                    newActivities[activityIndex].contributions.push({ date: today, contribution });

                    if (newActivities[activityIndex].streak > (newActivities[activityIndex].longestRecordedStreak || 0)) {
                        newActivities[activityIndex].longestRecordedStreak = newActivities[activityIndex].streak;
                    }

                    setActivities(newActivities);
                }
            } else {
                alert("Streak already updated today.");
            }
        } else {
            newActivities[activityIndex].streak++;
            newActivities[activityIndex].lastUpdated = today;

            if (newActivities[activityIndex].streak > (newActivities[activityIndex].longestRecordedStreak || 0)) {
                newActivities[activityIndex].longestRecordedStreak = newActivities[activityIndex].streak;
            }

            setActivities(newActivities);
        }
    };

    const handleToggleFreezeActivity = (index, isArchived) => {
        const filteredActivities = activities.filter(activity => activity.isArchived === isArchived);
        const newActivities = [...activities];
        const activityIndex = activities.indexOf(filteredActivities[index]);

        newActivities[activityIndex].isFrozen = !newActivities[activityIndex].isFrozen;
        setActivities(newActivities);
    };

    const handleDeleteStreak = (index, isArchived) => {
        const filteredActivities = activities.filter(activity => activity.isArchived === isArchived);
        const newActivities = activities.filter(activity => activity !== filteredActivities[index]);

        setActivities(newActivities);
    };

    const handleViewActivity = (index, isArchived) => {
        const filteredActivities = activities.filter(activity => activity.isArchived === isArchived);
        setSelectedActivity(filteredActivities[index]);
    };

    const handleCompleteAllActivities = () => {
        const today = new Date().toDateString();
        const newActivities = activities.map(activity => {
            if (activity.lastUpdated !== today) {
                const needsContribution = !(activity.name === "Fitness/Exercise");
                if (needsContribution) {
                    const contribution = prompt(`Enter streak contribution for ${activity.name} today:`);
                    if (contribution) {
                        return {
                            ...activity,
                            streak: activity.streak + 1,
                            lastUpdated: today,
                            contributions: [...activity.contributions, { date: today, contribution }]
                        };
                    }
                } else {
                    return {
                        ...activity,
                        streak: activity.streak + 1,
                        lastUpdated: today
                    };
                }
            }
            return activity;
        });

        setActivities(newActivities);
    };

    const goBack = () => {
        setSelectedActivity(null);
    };

    return (
        <div className="container">
            {selectedActivity ? (
                <ActivityDetails activity={selectedActivity} goBack={goBack} />
            ) : (
                <>
                    <h2>Streak Tracker</h2>
                    <ActivityForm onAddActivity={handleAddActivity} />
                    <button onClick={handleCompleteAllActivities}>Complete All</button>
                    <h2>Active Activities</h2>
                    <ActivityList
                        activities={activities.filter(activity => !activity.isArchived)}
                        onUpdateStreak={(index) => handleUpdateStreak(index, false)}
                        onToggleFreezeActivity={(index) => handleToggleFreezeActivity(index, false)}
                        onDeleteStreak={(index) => handleDeleteStreak(index, false)}
                        onArchiveActivity={(index) => handleArchiveActivity(index, false)}
                        onViewActivity={(index) => handleViewActivity(index, false)}
                    />
                    <h2>Archived Activities</h2>
                    <ActivityList
                        activities={activities.filter(activity => activity.isArchived)}
                        onUpdateStreak={(index) => handleUpdateStreak(index, true)}
                        onToggleFreezeActivity={(index) => handleToggleFreezeActivity(index, true)}
                        onDeleteStreak={(index) => handleDeleteStreak(index, true)}
                        onArchiveActivity={(index) => handleArchiveActivity(index, true)}
                        onViewActivity={(index) => handleViewActivity(index, true)}
                    />
                </>
            )}
        </div>
    );
}

export default App;
