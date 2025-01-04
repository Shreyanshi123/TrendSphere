import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,

	// User Signup
	signup: async ({ name, email, password, confirmPassword }) => {
		set({ loading: true });

		if (password !== confirmPassword) {
			set({ loading: false });
			return toast.error("Passwords do not match");
		}

		try {
			const response = await axios.post("/auth/signup", { name, email, password });
			set({ user: response.data, loading: false });
			toast.success("Signup successful!");
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Signup failed");
		}
	},

	// User Login
	login: async (email, password) => {
		set({ loading: true });

		try {
			const response = await axios.post("/auth/login", { email, password });
			set({ user: response.data, loading: false });
			toast.success("Login successful!");
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Login failed");
		}
	},

	// User Logout
	logout: async () => {
		try {
			await axios.post("/auth/logout");
			set({ user: null });
			toast.success("Logged out successfully!");
		} catch (error) {
			toast.error(error.response?.data?.message || "Logout failed");
		}
	},

	// Check Authentication Status
	checkAuth: async () => {
		set({ checkingAuth: true });

		try {
			const response = await axios.get("/auth/profile");
			set({ user: response.data, checkingAuth: false });
		} catch (error) {
			console.error("Authentication check failed:", error.message);
			set({ user: null, checkingAuth: false });
		}
	},

	// Refresh Token
	refreshToken: async () => {
		if (get().checkingAuth) return; // Avoid duplicate refresh requests

		set({ checkingAuth: true });

		try {
			const response = await axios.post("/auth/refresh-token");
			set({ checkingAuth: false });
			toast.success("Token refreshed successfully!");
			return response.data;
		} catch (error) {
			set({ user: null, checkingAuth: false });
			toast.error("Token refresh failed");
			throw error;
		}
	},
}));

// Axios Response Interceptor for Token Refresh
let refreshPromise = null;

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				if (refreshPromise) {
					// Wait for ongoing token refresh to complete
					await refreshPromise;
					return axios(originalRequest);
				}

				// Start token refresh
				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest); // Retry the original request
			} catch (refreshError) {
				// Handle token refresh failure
				useUserStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error); // Pass other errors through
	}
);
