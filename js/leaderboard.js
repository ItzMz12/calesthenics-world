// Leaderboard module

// Load leaderboard on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadLeaderboard();
});

// Load global leaderboard
async function loadLeaderboard() {
    try {
        const topUsers = await leaderboard.getGlobal(100);
        const container = document.getElementById('leaderboardContainer');
        
        if (topUsers.length === 0) {
            container.innerHTML = '<p>No leaderboard data available yet.</p>';
            return;
        }
        
        const table = `
            <table class="leaderboard-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Username</th>
                        <th>XP</th>
                        <th>Workouts</th>
                    </tr>
                </thead>
                <tbody>
                    ${topUsers.map((user, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${user.username}</td>
                            <td>${user.xp}</td>
                            <td>${user.workouts_completed}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        container.innerHTML = table;
    } catch (error) {
        showError('Failed to load leaderboard: ' + error.message);
    }
}