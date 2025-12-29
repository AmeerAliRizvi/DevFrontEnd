import axios from "axios";
import { BaseUrl } from "./constant";

const api = axios.create({
  baseURL: BaseUrl,
  withCredentials: true, // Implies you are using HttpOnly Cookies
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // 1. Ignore errors that aren't 401s or if no response exists
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // 2. Prevent infinite loops if the retry also fails
    if (original._retry) {
      return Promise.reject(error);
    }
    original._retry = true;

    // 3. Handle Concurrency: If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: () => resolve(api(original)),
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      // --- THE FIX ---
      // Use a new instance or global axios to avoid interceptor loops
      // if this call fails with 401.
      await axios.post(`${BaseUrl}/refreshToken`, {}, { withCredentials: true });

      // 4. Refresh succeeded -> Retry all queued requests
      processQueue(null);
      
      // Retry the original failing request
      return api(original);
    } catch (err) {
      // 5. Refresh failed -> Reject all queues
      processQueue(err, null);
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;