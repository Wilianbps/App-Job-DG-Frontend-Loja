import axios from "axios";

const baseURLRemote = localStorage.getItem("baseURL:local")!;

export const apiLoja = axios.create({
/*   baseURL: "http://localhost:3004/", */
baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const apiRetaguarda = axios.create({
  baseURL: baseURLRemote,
});
