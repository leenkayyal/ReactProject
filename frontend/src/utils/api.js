import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  async request(endpoint, options = {}) {
    try {
      const { method = "GET", data, params, headers } = options;

      const response = await axiosInstance.request({
        url: endpoint,
        method,
        data,
        params,
        headers,
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.error || "Something went wrong";
        throw new Error(errorMessage);
      }
      throw new Error(`Network error: ${error.message}`);
    }
  },

  auth: {
    async register(email, password) {
      return await api.request("auth/register", {
        method: "POST",
        data: { email, password },
      });
    },

    async login(email, password) {
      return await api.request("auth/login", {
        method: "POST",
        data: { email, password },
      });
    },

    async logout() {
      return await api.request("auth/logout", {
        method: "POST",
      });
    },

    async getMe() {
      return await api.request("auth/me", {
        method: "GET",
      });
    },
  },
};
