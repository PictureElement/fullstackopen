import axios from "axios";
const BASE_URL = "/api";

const getAll = () => {
  const request = axios.get(`${BASE_URL}/persons`);
  return request.then((response) => response.data);
};

const create = (personObject) => {
  const request = axios.post(`${BASE_URL}/persons`, personObject);
  return request.then((response) => response.data);
};

const remove = (id) => {
  const request = axios.delete(`${BASE_URL}/persons/${id}`);
  return request.then((response) => response.data);
};

const update = (id, personObject) => {
  const request = axios.put(`${BASE_URL}/persons/${id}`, personObject);
  return request.then((response) => response.data);
};

export default {
  getAll,
  create,
  remove,
  update,
};
