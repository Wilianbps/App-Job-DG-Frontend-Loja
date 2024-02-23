import axios from "axios";

export const apiLoja = axios.create({
  baseURL: "http://localhost:3004/",
});

export const apiRetaguarda = axios.create({
  baseURL: "http://localhost:3005/",
});