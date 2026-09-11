// Main application logic

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Application initialized');
    
    // Check if user is logged in
    const currentUser = await auth.getCurrentUser();
    
    if (currentUser) {
        console.log('User logged in:', currentUser);
        // Update navbar with logged-in state
        updateNavbarForLoggedIn(currentUser);
    }
});

// Update navbar for logged-in users
function updateNavbarForLoggedIn(user) {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        // Remove login and signup buttons
        const loginBtn = navLinks.querySelector('.btn-login');
        const signupBtn = navLinks.querySelector('.btn-signup');
        
        if (loginBtn) loginBtn.remove();
        if (signupBtn) signupBtn.remove();
        
        // Add logout button
        const logoutBtn = document.createElement('li');
        logoutBtn.innerHTML = `<a href="#" id="logoutBtn">Logout</a>`;
        navLinks.appendChild(logoutBtn);
        
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }
}

// Handle logout
async function handleLogout() {
    await auth.logout();
    window.location.href = 'index.html';
}

// Utility functions
function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
}

function showError(message) {
    showNotification(message, 'error');
}

function showSuccess(message) {
    showNotification(message, 'success');
}