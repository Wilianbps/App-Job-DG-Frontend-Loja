import axios from "axios";

const baseURLRemote = localStorage.getItem("baseURL:local")!;

export const apiLoja = axios.create({
  baseURL: "http://localhost:3004/",
});

export const apiRetaguarda = axios.create({
  /*   baseURL: "http://localhost:3005/", */
  baseURL: baseURLRemote,
});
