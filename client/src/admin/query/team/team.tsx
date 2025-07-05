import { TeamMember } from "@/src/admin/types/team/team";
import axios from "axios";
const APP_SERVER_URL = process.env.SERVER_URL;

export const addTeamAPI = async (data: TeamMember) => {
  const res = await axios.post(
    process.env.NEXT_PUBLIC_SERVER_URL + "/api/team",
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

export const listTeamAPI = async () => {
  const res = await axios.get(
    process.env.NEXT_PUBLIC_SERVER_URL + "/api/team",
    {
      headers: {
        "Content-Type": "application/json",
        // sessionId: localStorage.getItem("sessionId"),
      },
    }
  );
  return res;
};

export const updateTeamAPI = async (data: TeamMember) => {
  const res = await axios.post(
    process.env.NEXT_PUBLIC_SERVER_URL + "/api/team/" + data._id,
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

export const deleteTeamAPI = async (id: string) => {
  const res = await axios.delete(
    process.env.NEXT_PUBLIC_SERVER_URL + "/api/team/" + id,
    {
      headers: {
        "Content-Type": "application/json",
        // sessionId: localStorage.getItem("sessionId"),
      },
    }
  );
  return res;
};
