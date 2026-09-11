// Workouts module

// Load workouts on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadWorkouts();
});

// Load all workouts
async function loadWorkouts() {
    try {
        const workoutsList = await workouts.getAll();
        const container = document.getElementById('workoutsContainer');
        
        if (workoutsList.length === 0) {
            container.innerHTML = '<p>No workouts available yet.</p>';
            return;
        }
        
        container.innerHTML = workoutsList.map(workout => `
            <div class="workout-card">
                <h3>${workout.name}</h3>
                <p>${workout.description}</p>
                <p><strong>XP Reward:</strong> ${workout.xp}</p>
                <button onclick="selectWorkout(${workout.id})">Start Workout</button>
            </div>
        `).join('');
    } catch (error) {
        showError('Failed to load workouts: ' + error.message);
    }
}

// Select a workout to start
function selectWorkout(workoutId) {
    console.log('Starting workout:', workoutId);
    // Implement workout start logic
}