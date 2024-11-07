import axios from "axios";

export const api = axios.create({
  baseURL: "https://corte-rapido-api.onrender.com"
})