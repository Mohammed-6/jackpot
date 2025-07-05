"use client";
import {
  addTeamAPI,
  deleteTeamAPI,
  listTeamAPI,
  updateTeamAPI,
} from "@/src/admin/query/team/team";
import { TeamMember } from "@/src/admin/types/team/team";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

type TeamContextType = {
  teamList: TeamMember[];
  addMember: (member: Omit<TeamMember, "id">) => void;
  updateMember: (member: TeamMember) => void;
  deleteMember: (id: string) => void;
};

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const [teamList, setTeamList] = useState<TeamMember[]>([]);

  useEffect(() => {
    const loadFirst = async () => {
      await listTeamAPI()
        .then((res: any) => {
          setTeamList(res.data);
        })
        .catch((error) => {
          toast.error(error.response.data.error);
          console.log(error);
        });
    };
    loadFirst();
  }, []);

  const addMember = async (member: Omit<TeamMember, "id">) => {
    await addTeamAPI(member)
      .then((res: any) => {
        toast.success("Team added successfully");
        setTeamList((prev) => [...prev, res.data]);
      })
      .catch((error) => {
        toast.error(error.response.data.error);
        console.log(error);
      });
  };

  const updateMember = async (updated: TeamMember) => {
    await updateTeamAPI(updated)
      .then((res: any) => {
        console.log(res);
        toast.success("Team updated successfully");
        setTeamList((prev) =>
          prev.map((member) => (member._id === updated._id ? res.data : member))
        );
      })
      .catch((error) => {
        toast.error(error.response.data.error);
        console.log(error);
      });
  };

  const deleteMember = async (id: string) => {
    await deleteTeamAPI(id)
      .then((res: any) => {
        toast.success("Team deleted successfully");
        setTeamList((prev) => prev.filter((member) => member._id !== id));
      })
      .catch((error) => {
        toast.error(error.response.data.error);
        console.log(error);
      });
  };

  return (
    <TeamContext.Provider
      value={{ teamList, addMember, updateMember, deleteMember }}
    >
      {children}
    </TeamContext.Provider>
  );
};

// Custom hook
export const useTeams = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error("useRoles must be used within a RolesProvider");
  }
  return context;
};
