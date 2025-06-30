import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isLoading: false,

    isCheckingAuth: false,

    register: async (username, email, password) => {
        set({ isLoading: true });
        try {
            // const response = await fetch('http://10.0.2.2:3000/api/auth/register', {
            const response = await fetch('http://10.0.2.2:3000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();
            if (response.ok) {
                await AsyncStorage.setItem("user", JSON.stringify(data.user));
                await AsyncStorage.setItem("token", data.token)


                set({ user: data.user, token: data.token, isLoading: false });
                return {
                    success: true
                }
            } else {
                throw new Error(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error("Registration error:", error);
            set({ isLoading: false });
            return {
                success: false,
                error: error.message || 'Registration failed'
            }
        }
    },

    login: async (email, password) => {
        set({ isLoading: true });
        try {
            // const response = await fetch('http:/
            const response = await fetch('http://10.0.2.2:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })
            const data = await response.json();
            if (response.ok) {
                await AsyncStorage.setItem("user", JSON.stringify(data.user));
                await AsyncStorage.setItem("token", data.token);

                set({ user: data.user, token: data.token, isLoading: false });
                return {
                    success: true
                }
            } else {
                throw new Error(data.message || 'Login failed');
            }


        } catch (error) {
            console.error("Login error:", error);
            set({ isLoading: false });
            return {
                success: false,
                error: error.message || 'Login failed'
            }
        }
    },
    checkAuth: async () => {
        // set({ isLoading: true });
        // try {
        //     const user = await AsyncStorage.getItem("user");
        //     const token = await AsyncStorage.getItem("token");

        //     if (user && token) {
        //         set({ user: JSON.parse(user), token, isLoading: false });
        //     } else {
        //         set({ user: null, token: null, isLoading: false });
        //     }
        // } catch (error) {
        //     console.error("Check auth error:", error);
        //     set({ isLoading: false });
        // }
        set({ isLoading: true });
        try {
            const userJson = await AsyncStorage.getItem("user");
            const token = await AsyncStorage.getItem("token");
            const user = userJson ? JSON.parse(userJson) : null;

            set({ token, user, isLoading: false })
        } catch (error) {
            console.error("Check auth error:", error);
            set({ isLoading: false });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    logout: async () => {
        set({ isLoading: true });
        try {
            await AsyncStorage.removeItem("user");
            await AsyncStorage.removeItem("token");
            set({ user: null, token: null, isLoading: false });
        } catch (error) {
            console.error("Logout error:", error);
            set({ isLoading: false });
        }
    }
}))