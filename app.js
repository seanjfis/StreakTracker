document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-activity-form');
    const activityList = document.getElementById('activity-list');
    
    let activities = JSON.parse(localStorage.getItem('activities')) || [];

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const activityName = document.getElementById('activity-name').value;
        const activityStreak = parseInt(document.getElementById('activity-streak').value) || 0;
        if (activityName) {
            addActivity(activityName, activityStreak);
            document.getElementById('activity-name').value = '';
            document.getElementById('activity-streak').value = '';
        }
    });

    function addActivity(name, streak = 1) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - (streak - 1));
        const newActivity = { name, streak, lastUpdated: null, startDate: startDate.toDateString() };
        activities.push(newActivity);
        saveActivities();
        renderActivities();
    }



    function updateStreak(index) {
        const today = new Date().toDateString();
        if (activities[index].lastUpdated !== today) {
            activities[index].streak++;
            activities[index].lastUpdated = today;
            saveActivities();
            renderActivities();
        }
    }

    function deleteStreak(index) {
        activities.splice(index, 1); // Remove the activity at the specified index
        saveActivities();
        renderActivities();
    }

    function saveActivities() {
        localStorage.setItem('activities', JSON.stringify(activities));
    }

    function viewActivity(index) {
        const activity = activities[index];
        history.pushState({ index }, '', `#activity-${index}`);
        renderActivityDetails(activity);
    }

    function renderActivityDetails(activity) {
        const activityStartDate = new Date(activity.startDate);
        console.log('activity.startDate:', activity.startDate);
        console.log('activityStartDate:', activityStartDate);

        document.querySelector('.container').innerHTML = `
            <h1>${activity.name}</h1>
            <p><strong>Streak:</strong> ${activity.streak}</p>
            <p><strong>Date Started:</strong> ${activityStartDate.toDateString()}</p>
            <p><strong>Last Updated:</strong> ${activity.lastUpdated || 'Never'}</p>
            <button onclick="goBack()">Back</button>
        `;
    }


    function goBack() {
        renderActivities();
    }

    function renderActivities() {
        document.querySelector('.container').innerHTML = `
            <h1>Streak Tracker</h1>
            <form id="add-activity-form">
                <input type="text" id="activity-name" placeholder="Enter activity name">
                <input type="number" id="activity-streak" placeholder="Enter starting streak">
                <button type="submit">Add Activity</button>
            </form>
            <ul id="activity-list"></ul>
        `;

        const form = document.getElementById('add-activity-form');
        const activityList = document.getElementById('activity-list');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const activityName = document.getElementById('activity-name').value;
            const activityStreak = parseInt(document.getElementById('activity-streak').value) || 0;
            if (activityName) {
                addActivity(activityName, activityStreak);
                document.getElementById('activity-name').value = '';
                document.getElementById('activity-streak').value = '';
            }
        });

        activityList.innerHTML = '';
        activities.forEach((activity, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${activity.name} - Streak: ${activity.streak}</span>
                <button onclick="updateStreak(${index})">Complete</button>
                <button onclick="viewActivity(${index})">View</button>
                <button onclick="deleteStreak(${index})">Delete</button>
            `;
            activityList.appendChild(li);
        });
    }

    renderActivities();
    window.updateStreak = updateStreak; // Expose updateStreak to global scope
    window.deleteStreak = deleteStreak; // Expose deleteStreak to global scope
    window.viewActivity = viewActivity; // Expose viewActivity to global scope
    window.goBack = goBack; // Expose goBack to global scope
});
