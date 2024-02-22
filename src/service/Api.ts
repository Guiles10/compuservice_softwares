import axios from 'axios';

export const Api = axios.create({
  // baseURL: "http://localhost:3001",
  baseURL: 'https://compuservice-db-8ca85a38ff76.herokuapp.com',
  withCredentials: true,
  timeout: 120000,
});
