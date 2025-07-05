import axios from "axios";
import { Matka } from "../types/matka";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL + "/api/matka";

export const createMatkaAPI = async (data: Matka) => {
  console.log(BASE_URL);
  const res = await axios.post(`${BASE_URL}`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const getAllMatkasAPI = async (): Promise<Matka[]> => {
  const res = await axios.get(`${BASE_URL}`);
  return res.data;
};

export const getMatkaByIdAPI = async (id: string): Promise<Matka> => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

export const updateMatkaAPI = async (id: string, data: Partial<Matka>) => {
  const res = await axios.put(`${BASE_URL}/${id}`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const deleteMatkaAPI = async (id: string) => {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
};
