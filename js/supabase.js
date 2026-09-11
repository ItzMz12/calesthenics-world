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
            return { success: true, data };
        } catch (error) {
            console.error('Login error:', error.message);
            return { success: false, error: error.message };
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
            return { success: true, data };
        } catch (error) {
            console.error('Signup error:', error.message);
            return { success: false, error: error.message };
        }
    },
    logout: async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error.message);
            return { success: false, error: error.message };
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

// User profile functions
const userProfile = {
    getProfile: async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            if (error && error.code !== 'PGRST116') throw error;
            return data || null;
        } catch (error) {
            console.error('Get profile error:', error.message);
            return null;
        }
    },
    createProfile: async (userId, profileData) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .insert([{ id: userId, ...profileData }])
                .select();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Create profile error:', error.message);
            throw error;
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
                .select('xp, level')
                .eq('id', userId)
                .single();
            if (error && error.code !== 'PGRST116') throw error;
            return { xp: data?.xp || 0, level: data?.level || 1 };
        } catch (error) {
            console.error('Get XP error:', error.message);
            return { xp: 0, level: 1 };
        }
    },
    addXP: async (userId, amount) => {
        try {
            const { xp: currentXP, level: currentLevel } = await userProfile.getXP(userId);
            const newXP = currentXP + amount;
            const xpPerLevel = 1000;
            const newLevel = Math.floor(newXP / xpPerLevel) + 1;
            
            const { data, error } = await supabase
                .from('profiles')
                .update({ xp: newXP, level: newLevel })
                .eq('id', userId)
                .select();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Add XP error:', error.message);
            throw error;
        }
    },
    getStreaks: async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('current_streak, longest_streak')
                .eq('id', userId)
                .single();
            if (error && error.code !== 'PGRST116') throw error;
            return { current: data?.current_streak || 0, longest: data?.longest_streak || 0 };
        } catch (error) {
            console.error('Get streaks error:', error.message);
            return { current: 0, longest: 0 };
        }
    },
    updateStreaks: async (userId, streaks) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update(streaks)
                .eq('id', userId)
                .select();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Update streaks error:', error.message);
            throw error;
        }
    }
};

// Workout functions
const workouts = {
    getAll: async () => {
        try {
            const { data, error } = await supabase
                .from('workouts')
                .select('*')
                .order('difficulty', { ascending: false });
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Get workouts error:', error.message);
            return [];
        }
    },
    getById: async (workoutId) => {
        try {
            const { data, error } = await supabase
                .from('workouts')
                .select('*')
                .eq('id', workoutId)
                .single();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Get workout error:', error.message);
            return null;
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

// Workout history (completion) functions
const workoutHistory = {
    getAll: async (userId) => {
        try {
            const { data, error } = await supabase
                .from('workout_history')
                .select(`
                    id,
                    user_id,
                    workout_id,
                    completed_at,
                    duration,
                    repetitions,
                    notes,
                    workouts (name, difficulty, xp_reward)
                `)
                .eq('user_id', userId)
                .order('completed_at', { ascending: false });
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Get workout history error:', error.message);
            return [];
        }
    },
    getByDate: async (userId, date) => {
        try {
            const startDate = new Date(date).toISOString().split('T')[0];
            const endDate = new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            
            const { data, error } = await supabase
                .from('workout_history')
                .select(`
                    id,
                    user_id,
                    workout_id,
                    completed_at,
                    duration,
                    repetitions,
                    workouts (name, difficulty)
                `)
                .eq('user_id', userId)
                .gte('completed_at', startDate)
                .lt('completed_at', endDate);
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Get workout history by date error:', error.message);
            return [];
        }
    },
    create: async (historyData) => {
        try {
            const { data, error } = await supabase
                .from('workout_history')
                .insert([{
                    ...historyData,
                    completed_at: new Date().toISOString()
                }])
                .select();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Create workout history error:', error.message);
            throw error;
        }
    },
    delete: async (historyId) => {
        try {
            const { error } = await supabase
                .from('workout_history')
                .delete()
                .eq('id', historyId);
            if (error) throw error;
        } catch (error) {
            console.error('Delete workout history error:', error.message);
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
                .select(`
                    id,
                    user_id,
                    achievement_id,
                    unlocked_at,
                    achievements (name, description, icon)
                `)
                .eq('user_id', userId)
                .order('unlocked_at', { ascending: false });
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Get achievements error:', error.message);
            return [];
        }
    },
    unlock: async (userId, achievementId) => {
        try {
            // Check if already unlocked
            const { data: existing } = await supabase
                .from('user_achievements')
                .select('id')
                .eq('user_id', userId)
                .eq('achievement_id', achievementId)
                .single();
            
            if (existing) return existing;
            
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
                .select('id, username, xp, level, workouts_completed, avatar_url')
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
                .select('id, username, xp, level, workouts_completed, avatar_url')
                .eq('country', country)
                .order('xp', { ascending: false })
                .limit(limit);
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Get country leaderboard error:', error.message);
            return [];
        }
    },
    getUserRank: async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('xp')
                .order('xp', { ascending: false });
            if (error) throw error;
            const rank = data?.findIndex(p => p.id === userId) + 1 || 0;
            return rank;
        } catch (error) {
            console.error('Get user rank error:', error.message);
            return 0;
        }
    }
};

// Community functions
const community = {
    getPosts: async (limit = 50) => {
        try {
            const { data, error } = await supabase
                .from('community_posts')
                .select(`
                    id,
                    title,
                    content,
                    user_id,
                    created_at,
                    updated_at,
                    profiles (username, avatar_url)
                `)
                .order('created_at', { ascending: false })
                .limit(limit);
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Get posts error:', error.message);
            return [];
        }
    },
    getPostById: async (postId) => {
        try {
            const { data, error } = await supabase
                .from('community_posts')
                .select(`
                    id,
                    title,
                    content,
                    user_id,
                    created_at,
                    updated_at,
                    profiles (username, avatar_url)
                `)
                .eq('id', postId)
                .single();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Get post error:', error.message);
            return null;
        }
    },
    createPost: async (postData) => {
        try {
            const { data, error } = await supabase
                .from('community_posts')
                .insert([{
                    ...postData,
                    created_at: new Date().toISOString()
                }])
                .select();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Create post error:', error.message);
            throw error;
        }
    },
    updatePost: async (postId, postData) => {
        try {
            const { data, error } = await supabase
                .from('community_posts')
                .update({
                    ...postData,
                    updated_at: new Date().toISOString()
                })
                .eq('id', postId)
                .select();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Update post error:', error.message);
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

// Export all functions
export { supabase, auth, userProfile, workouts, workoutHistory, achievements, leaderboard, community };
