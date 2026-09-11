// Dashboard module

// Load dashboard on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadDashboard();
});

// Load user dashboard
async function loadDashboard() {
    try {
        const currentUser = await auth.getCurrentUser();
        
        if (!currentUser) {
            window.location.href = 'login.html';
            return;
        }
        
        const userProfile = await userProfile.getProfile(currentUser.id);
        const userXP = await userProfile.getXP(currentUser.id);
        const userAchievements = await achievements.getAll(currentUser.id);
        const recentWorkouts = await workouts.getAll();
        
        const container = document.getElementById('dashboardContainer');
        container.innerHTML = `
            <div class="dashboard-card">
                <h2>Profile</h2>
                <p><strong>Username:</strong> ${userProfile.username}</p>
                <p><strong>XP:</strong> ${userXP}</p>
            </div>
            <div class="dashboard-card">
                <h2>Recent Workouts</h2>
                <p>Workouts completed: ${recentWorkouts.length}</p>
            </div>
            <div class="dashboard-card">
                <h2>Achievements</h2>
                <p>Achievements unlocked: ${userAchievements.length}</p>
            </div>
        `;
    } catch (error) {
        showError('Failed to load dashboard: ' + error.message);
    }
}