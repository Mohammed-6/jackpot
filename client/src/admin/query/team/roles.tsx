import { Role } from "@/src/admin/types/team/roles";
import axios from "axios";
const APP_SERVER_URL = process.env.SERVER_URL;

export const addRoleAPI = async (data: Role) => {
  const res = await axios.post(
    process.env.NEXT_PUBLIC_SERVER_URL + "/api/roles",
    data,
    {
      headers: {
        "Content-Type": "application/json",
        // sessionId: localStorage.getItem("sessionId"),
      },
    }
  );
  return res;
};

export const listRoleAPI = async () => {
  const res = await axios.get(
    process.env.NEXT_PUBLIC_SERVER_URL + "/api/roles",
    {
      headers: {
        "Content-Type": "application/json",
        // sessionId: localStorage.getItem("sessionId"),
      },
    }
  );
  return res;
};

export const updateRoleAPI = async (data: Role) => {
  const res = await axios.post(
    process.env.NEXT_PUBLIC_SERVER_URL + "/api/roles/" + data._id,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        // sessionId: localStorage.getItem("sessionId"),
      },
    }
  );
  return res;
};

export const deleteRoleAPI = async (id: string) => {
  const res = await axios.delete(
    process.env.NEXT_PUBLIC_SERVER_URL + "/api/roles/" + id,
    {
      headers: {
        "Content-Type": "application/json",
        // sessionId: localStorage.getItem("sessionId"),
      },
    }
  );
  return res;
};
