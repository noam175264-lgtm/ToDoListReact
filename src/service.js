import axios from "axios";

// יצירת instance של axios
const api = axios.create({
  baseURL: "http://localhost:5055"
});

// request interceptor: מוסיף Authorization אם יש token
api.interceptors.request.use(config => {
  const token = localStorage.getItem("jwtToken"); // שם אחיד!
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// response interceptor: תופס 401 ומעביר לעמוד /login
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("jwtToken");
      window.location.href = "/login";
    }
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default {
  // auth
  register: async ({username, password}) => {
    const resp = await api.post("/auth/register", { username, password });
    return resp.data;
  },

  login: async (username, password) => {
    const resp = await api.post("/auth/login", { username, password });
    const token = resp.data.token || resp.data.Token;
    if (token) {
      localStorage.setItem("jwtToken", token); // שם אחיד!
    }
    return resp.data;
  },

  logout: () => {
    localStorage.removeItem("jwtToken");
  },

  // tasks API - עם השמות הנכונים מהשרת
  getTasks: async () => {
    const result = await api.get("/tasks"); // תוקן מ-/items
    return result.data;
  },

  addTask: async (name, isComplete = false) => {
    const result = await api.post("/tasks", { name, isComplete }); // תוקן מ-/items
    return result.data;
  },

  updateTask: async (id, name, isComplete) => {
    const result = await api.put(`/tasks/${id}`, { name, isComplete }); // תוקן מ-/items
    return result.data;
  },

  deleteTask: async (id) => {
    const result = await api.delete(`/tasks/${id}`); // תוקן מ-/items
    return result.data;
  },
};