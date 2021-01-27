import axios from "axios";

const instance = axios.create({
  baseURL: ".....", //base api url
});

export default instance;
