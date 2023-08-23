import axios from "axios";

const api = axios.create({
  baseURL: "https://api.openai.com",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer`,
  },
});

export default api;
