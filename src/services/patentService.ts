import axios from '../config/axiosConfig';
import type { PatentDTO, PatentResponseAllDTO } from '../interfaces/IPatent';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAllPatents = async (): Promise<PatentDTO[]> => {
  const response = await axios.get<PatentResponseAllDTO>(`${BASE_URL}/patent`);
  return response.data.patentResponseDTOList || [];
};
