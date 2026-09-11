// Supabase configuration
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.4/+esm';

const SUPABASE_URL = 'https://3txxxtahylujkdgfitqfqq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_3TxXTAhylujKDGFI-tqfqQ_DYbmfGPF';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Authentication functions
const auth = {
    login: async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Login error:', error.message);
            throw error;
        }
    },
    signup: async (email, password, username) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username: username,
                    }
                }
            });
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Signup error:', error.message);
            throw error;
        }
    },
    logout: async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            console.error('Logout error:', error.message);
            throw error;
        }
    },
    getCurrentUser: async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            return user;
        } catch (error) {
            console.error('Get user error:', error.message);
            return null;
        }
    }
};

// Workout functions
const workouts = {
    getAll: async () => {
        try {
            const { data, error } = await supabase
                .from('workouts')
                .select('*');
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Get workouts error:', error.message);
            return [];
        }
    },
    create: async (workoutData) => {
        try {
            const { data, error } = await supabase
                .from('workouts')
                .insert([workoutData])
                .select();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Create workout error:', error.message);
            throw error;
        }
    },
    update: async (workoutId, workoutData) => {
        try {
            const { data, error } = await supabase
                .from('workouts')
                .update(workoutData)
                .eq('id', workoutId)
                .select();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Update workout error:', error.message);
            throw error;
        }
    },
    delete: async (workoutId) => {
        try {
            const { error } = await supabase
                .from('workouts')
                .delete()
                .eq('id', workoutId);
            if (error) throw error;
        } catch (error) {
            console.error('Delete workout error:', error.message);
            throw error;
        }
    }
};

// User profile functions
const userProfile = {
    getProfile: async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            if (error) throw error;
            return data || {};
        } catch (error) {
            console.error('Get profile error:', error.message);
            return {};
        }
    },
    updateProfile: async (userId, profileData) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update(profileData)
                .eq('id', userId)
                .select();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Update profile error:', error.message);
            throw error;
        }
    },
    getXP: async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('xp')
                .eq('id', userId)
                .single();
            if (error) throw error;
            return data?.xp || 0;
        } catch (error) {
            console.error('Get XP error:', error.message);
            return 0;
        }
    },
    addXP: async (userId, amount) => {
        try {
            const currentXP = await userProfile.getXP(userId);
            const { data, error } = await supabase
                .from('profiles')
                .update({ xp: currentXP + amount })
                .eq('id', userId)
                .select();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Add XP error:', error.message);
            throw error;
        }
    }
};

// Achievements functions
const achievements = {
    getAll: async (userId) => {
        try {
            const { data, error } = await supabase
                .from('user_achievements')
                .select('*')
                .eq('user_id', userId);
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Get achievements error:', error.message);
            return [];
        }
    },
    unlock: async (userId, achievementId) => {
        try {
            const { data, error } = await supabase
                .from('user_achievements')
                .insert([{
                    user_id: userId,
                    achievement_id: achievementId,
                    unlocked_at: new Date().toISOString()
                }])
                .select();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Unlock achievement error:', error.message);
            throw error;
        }
    }
};

// Leaderboard functions
const leaderboard = {
    getGlobal: async (limit = 100) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, username, xp, workouts_completed')
                .order('xp', { ascending: false })
                .limit(limit);
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Get global leaderboard error:', error.message);
            return [];
        }
    },
    getByCountry: async (country, limit = 100) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, username, xp, workouts_completed')
                .eq('country', country)
                .order('xp', { ascending: false })
                .limit(limit);
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Get country leaderboard error:', error.message);
            return [];
        }
    }
};

// Community functions
const community = {
    getPosts: async () => {
        try {
            const { data, error } = await supabase
                .from('community_posts')
                .select(`
                    id,
                    title,
                    content,
                    created_at,
                    profiles (username)
                `)
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Get posts error:', error.message);
            return [];
        }
    },
    createPost: async (postData) => {
        try {
            const { data, error } = await supabase
                .from('community_posts')
                .insert([postData])
                .select();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Create post error:', error.message);
            throw error;
        }
    },
    deletePost: async (postId) => {
        try {
            const { error } = await supabase
                .from('community_posts')
                .delete()
                .eq('id', postId);
            if (error) throw error;
        } catch (error) {
            console.error('Delete post error:', error.message);
            throw error;
        }
    }
};
