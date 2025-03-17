import { axios } from "@/services/axios";

const saveOrCreateUrl = data => (data.id ? `api/visualizations/${data.id}` : "api/visualizations");

const Visualization = {
  save: data => axios.post(saveOrCreateUrl(data), data),
  delete: data => axios.delete(`api/visualizations/${data.id}`),
  updatePositions: data => axios.put("api/visualizations", data),
};

export default Visualization;
