// Community module

// Load community posts on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadCommunityPosts();
});

// Load community posts
async function loadCommunityPosts() {
    try {
        const posts = await community.getPosts();
        const container = document.getElementById('communityContainer');
        
        if (posts.length === 0) {
            container.innerHTML = '<p>No posts yet. Be the first to post!</p>';
            return;
        }
        
        container.innerHTML = posts.map(post => `
            <div class="community-post">
                <h3>${post.title}</h3>
                <p><strong>By:</strong> ${post.author}</p>
                <p>${post.content}</p>
                <small>${new Date(post.created_at).toLocaleString()}</small>
            </div>
        `).join('');
    } catch (error) {
        showError('Failed to load community posts: ' + error.message);
    }
}

// Create a new community post
async function createCommunityPost(title, content) {
    try {
        const currentUser = await auth.getCurrentUser();
        
        if (!currentUser) {
            showError('You must be logged in to post');
            return;
        }
        
        await community.createPost({
            title,
            content,
            author_id: currentUser.id
        });
        
        showSuccess('Post created successfully!');
        await loadCommunityPosts();
    } catch (error) {
        showError('Failed to create post: ' + error.message);
    }
}