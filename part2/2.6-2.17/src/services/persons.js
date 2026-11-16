import axios from "axios";
const BASE_URL = "http://localhost:3000/persons";

const getAll = () => {
  const request = axios.get(BASE_URL);
  return request.then((response) => response.data);
};

const create = (personObject) => {
  const request = axios.post(BASE_URL, personObject);
  return request.then((response) => response.data);
};

const remove = (id) => {
  const request = axios.delete(`${BASE_URL}/${id}`);
  return request.then((response) => response.data);
};

const update = (id, personObject) => {
  const request = axios.put(`${BASE_URL}/${id}`, personObject);
  return request.then((response) => response.data);
};

export default {
  getAll,
  create,
  remove,
  update,
};
