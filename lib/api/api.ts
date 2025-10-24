import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/api`
  : "/api";

export const nextServer = axios.create({
  baseURL,
  withCredentials: true,
});
