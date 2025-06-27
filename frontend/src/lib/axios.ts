// lib/axios.ts
import axios from "axios";

export const axiosInstance = axios.create({
	baseURL: import.meta.env.MODE === "development"
		? "http://localhost:5001/api"
		: "/api",
});

let getTokenFn: (() => Promise<string | null>) | null = null;

export const injectTokenGetter = (fn: () => Promise<string | null>) => {
	getTokenFn = fn;
};

// Interceptor to attach token before each request
axiosInstance.interceptors.request.use(async (config) => {
	if (getTokenFn) {
		const token = await getTokenFn();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
	}
	return config;
});
