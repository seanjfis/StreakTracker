document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-activity-form');
    const activityList = document.getElementById('activity-list');
    
    let activities = JSON.parse(localStorage.getItem('activities')) || [];

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const activityName = document.getElementById('activity-name').value;
        if (activityName) {
            addActivity(activityName);
            document.getElementById('activity-name').value = '';
        }
    });

    function addActivity(name) {
        const newActivity = { name, streak: 0, lastUpdated: null };
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

    function saveActivities() {
        localStorage.setItem('activities', JSON.stringify(activities));
    }

    function renderActivities() {
        activityList.innerHTML = '';
        activities.forEach((activity, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${activity.name} - Streak: ${activity.streak}</span>
                <button onclick="updateStreak(${index})">Complete</button>
            `;
            activityList.appendChild(li);
        });
    }

    renderActivities();
    window.updateStreak = updateStreak; // Expose updateStreak to global scope
});
